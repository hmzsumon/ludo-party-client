import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Socket } from "socket.io-client";

import { useOptionsContext } from "@/context/optionContext";
import useInterval from "@/hooks/useInterval";
import useWait from "@/hooks/useWait";
import { useLazyGetWalletQuery } from "@/redux/features/wallet/walletApi";
import type {
  IActionsMoveToken,
  IActionsTurn,
  IGameOver,
  IListTokens,
  IPlayer,
  ISelectTokenValues,
  IUser,
  TBoardColors,
  TDicevalues,
  TOfflineBotMode,
  TShowTotalTokens,
  TTotalPlayers,
  TTypeGame,
} from "../../interfaces";
import {
  EActionsBoardGame,
  EBoardColors,
  EPositionProfiles,
  ESounds,
  ETypeGame,
  INITIAL_ACTIONS_MOVE_TOKEN,
  TOKEN_MOVEMENT_INTERVAL_VALUE,
  WAIT_SHOW_MODAL_GAME_OVER,
} from "../../utils/constants";

import PageWrapper from "../wrapper/page";
import BackButton from "./backButton";
import Board from "./board";
import BoardWrapper from "./boardWrapper";

import Debug from "./debug";
import Gameover from "./gameover";
import {
  getInitialActionsTurnValue,
  getInitialDataPlayers,
  getInitialOnlineHvBPlayers,
  getInitialOnlineHvBTokens,
  getInitialPositionTokens,
  getOfflineControlledTokenSelection,
  getOfflineWeightedDice,
  getRandomValueDice,
  validateDicesForTokens,
  validateMovementToken,
  validateSelectToken,
  validateSelectTokenRandomly,
} from "./helpers";
import ProfileSection from "./profileSection";
import ShowTotalTokens from "./showTotalTokens";
import Tokens from "./tokens";

interface GameProps {
  totalPlayers: TTotalPlayers;
  initialTurn: number;
  users: IUser[];
  typeGame?: TTypeGame;
  boardColor?: TBoardColors;
  debug?: boolean;
  roomName?: string;
  socket?: Socket;
  currentUserId?: string;
  betAmount?: number;
  offlineBotMode?: TOfflineBotMode;
  onlineBotMode?: TOfflineBotMode;
}

const Game = ({
  totalPlayers = 2,
  initialTurn = 0,
  users = [],
  typeGame = ETypeGame.OFFLINE,
  boardColor = EBoardColors.RGYB,
  debug = false,
  roomName = "",
  socket,
  currentUserId = "",
  betAmount = 0,
  offlineBotMode = "EASY",
  onlineBotMode = "EASY",
}: GameProps) => {
  const { playSound } = useOptionsContext();
  const [refreshWallet] = useLazyGetWalletQuery();
  const didEmitMatchResultRef = useRef(false);
  const assistOpeningDelayRef = useRef(2);
  const botActionLockRef = useRef(false);

  /* ────────── online human vs bot setup detect ────────── */
  const isOnlineHumanVsBotSetup = useMemo(() => {
    if (typeGame !== ETypeGame.ONLINE) return false;
    if (totalPlayers !== 2) return false;

    const totalBots = users.filter((user) => user?.isBot).length;
    const totalHumans = users.filter((user) => !user?.isBot).length;

    return totalBots === 1 && totalHumans === 1;
  }, [typeGame, totalPlayers, users]);

  /* ────────── initial players data ────────── */
  const initialPlayers = useMemo(() => {
    // offline আগের মতোই থাকবে
    if (!isOnlineHumanVsBotSetup) {
      return getInitialDataPlayers(users, boardColor, totalPlayers);
    }

    // online human vs bot এর জন্য seat based player init
    return getInitialOnlineHvBPlayers(users, boardColor, totalPlayers);
  }, [users, boardColor, totalPlayers, isOnlineHumanVsBotSetup]);

  /* ────────── players state init ────────── */
  const [players, setPlayers] = useState<IPlayer[]>(initialPlayers);

  /* ────────── tokens state init ────────── */
  const [listTokens, setListTokens] = useState<IListTokens[]>(() => {
    // offline আগের মতোই থাকবে
    if (!isOnlineHumanVsBotSetup) {
      return getInitialPositionTokens(
        boardColor,
        totalPlayers,
        initialPlayers,
        currentUserId,
      );
    }

    // online human vs bot এর জন্য আলাদা token init
    return getInitialOnlineHvBTokens(
      boardColor,
      totalPlayers,
      initialPlayers,
      currentUserId,
    );
  });

  /* ────────── turn init ────────── */
  const [actionsTurn, setActionsTurn] = useState<IActionsTurn>(() =>
    getInitialActionsTurnValue(initialTurn, initialPlayers, currentUserId),
  );

  const [currentTurn, setCurrentTurn] = useState(initialTurn);
  const [actionsMoveToken, setActionsMoveToken] = useState<IActionsMoveToken>(
    INITIAL_ACTIONS_MOVE_TOKEN,
  );
  const [totalTokens, setTotalTokens] = useState<TShowTotalTokens>({});
  const [isGameOver, setIsGameOver] = useState<IGameOver>({
    showModal: false,
    gameOver: false,
  });

  /* ────────── online mode flags ────────── */
  const isOnlineGame = useMemo(
    () => typeGame === ETypeGame.ONLINE && Boolean(socket) && Boolean(roomName),
    [roomName, socket, typeGame],
  );

  /* ────────── sync players and tokens when users/room data update ────────── */
  useEffect(() => {
    const nextPlayers = !isOnlineHumanVsBotSetup
      ? getInitialDataPlayers(users, boardColor, totalPlayers)
      : getInitialOnlineHvBPlayers(users, boardColor, totalPlayers);

    const nextTokens = !isOnlineHumanVsBotSetup
      ? getInitialPositionTokens(
          boardColor,
          totalPlayers,
          nextPlayers,
          currentUserId,
        )
      : getInitialOnlineHvBTokens(
          boardColor,
          totalPlayers,
          nextPlayers,
          currentUserId,
        );

    setPlayers(nextPlayers);
    setListTokens(nextTokens);
    setCurrentTurn(initialTurn);
    setActionsTurn(
      getInitialActionsTurnValue(initialTurn, nextPlayers, currentUserId),
    );
    setTotalTokens({});
  }, [
    users,
    boardColor,
    totalPlayers,
    currentUserId,
    initialTurn,
    isOnlineHumanVsBotSetup,
  ]);

  /* ────────── local player index ────────── */
  const currentPlayerIndex = useMemo(() => {
    if (!currentUserId) return -1;
    return players.findIndex((player) => player.id === currentUserId);
  }, [currentUserId, players]);

  /* ────────── turn ownership ────────── */
  const isMyOnlineTurn =
    isOnlineGame &&
    currentPlayerIndex >= 0 &&
    currentTurn === currentPlayerIndex;

  /* ────────── current turn player detect ────────── */
  const currentTurnPlayer = players[currentTurn];
  const isBotTurn = Boolean(currentTurnPlayer?.isBot);

  /* ────────── active bot mode source ────────── */
  const activeBotMode = useMemo<TOfflineBotMode>(() => {
    if (isOnlineGame) {
      return onlineBotMode || "EASY";
    }

    return offlineBotMode || "EASY";
  }, [isOnlineGame, offlineBotMode, onlineBotMode]);

  /* ────────── detect human vs bot room ────────── */
  const isHumanVsBotRoom = useMemo(() => {
    if (!isOnlineGame) return false;
    return totalPlayers === 2 && players.some((player) => player.isBot);
  }, [isOnlineGame, players, totalPlayers]);

  /* ────────── human player controls online bot ────────── */
  const onlineBotControllerId = useMemo(() => {
    if (!isHumanVsBotRoom) return "";
    return players.find((player) => !player.isBot)?.id || "";
  }, [isHumanVsBotRoom, players]);

  /* ────────── allow only one client to control bot ────────── */
  const canControlOnlineBot = useMemo(() => {
    if (!isHumanVsBotRoom) return false;
    return Boolean(currentUserId) && currentUserId === onlineBotControllerId;
  }, [currentUserId, isHumanVsBotRoom, onlineBotControllerId]);

  /* ────────── controlled bot mode enable ────────── */
  const hasControlledBotMode = useMemo(() => {
    if (!isOnlineGame) return true;
    return players.some((player) => player.isBot);
  }, [isOnlineGame, players]);

  /* ────────── favored bot index for assist / easy control ────────── */
  const favoredBotIndex = useMemo(() => {
    return players.findIndex(
      (player) => player.isBot && player.index === currentTurn,
    );
  }, [currentTurn, players]);

  /* ────────── room action emit ────────── */
  const emitRoomAction = useCallback(
    (payload: Record<string, unknown>) => {
      if (!socket || !roomName) return;
      socket.emit("ACTIONS", payload);
    },
    [roomName, socket],
  );

  /* ────────── handle opponent leave result ────────── */
  const handleOpponentLeaveResult = useCallback(
    (leftUserId: string) => {
      setPlayers((prevPlayers) => {
        const copyPlayers = prevPlayers.map((player) => ({ ...player }));
        const leftPlayerIndex = copyPlayers.findIndex(
          (player) => player.id === leftUserId,
        );

        if (leftPlayerIndex >= 0) {
          copyPlayers[leftPlayerIndex].isOffline = true;
          copyPlayers[leftPlayerIndex].finished = true;
          copyPlayers[leftPlayerIndex].ranking = copyPlayers.length;
        }

        const remainingPlayers = copyPlayers.filter(
          (player) => player.id !== leftUserId && !player.isOffline,
        );

        remainingPlayers.sort((a, b) => {
          if (a.id === currentUserId) return -1;
          if (b.id === currentUserId) return 1;
          return a.index - b.index;
        });

        remainingPlayers.forEach((player, index) => {
          copyPlayers[player.index].finished = true;
          copyPlayers[player.index].ranking = index + 1;
        });

        return copyPlayers;
      });

      setActionsMoveToken(INITIAL_ACTIONS_MOVE_TOKEN);
      setActionsTurn((prev) => ({
        ...prev,
        timerActivated: false,
        disabledDice: true,
        showDice: false,
        isDisabledUI: true,
      }));

      playSound(ESounds.GAMER_OVER);
      setIsGameOver({ showModal: false, gameOver: true });
    },
    [currentUserId, playSound],
  );

  /* ────────── token selection handler ────────── */
  const handleSelectedToken = useCallback(
    ({ diceIndex, tokenIndex }: ISelectTokenValues, isActionSocket = false) => {
      if (isOnlineGame && !isActionSocket) {
        if (isBotTurn) {
          if (!canControlOnlineBot) return;
          if (botActionLockRef.current) return;

          botActionLockRef.current = true;
        } else {
          if (!isMyOnlineTurn) return;
        }

        emitRoomAction({
          type: EActionsBoardGame.SELECT_TOKEN,
          roomName,
          [EActionsBoardGame.SELECT_TOKEN]: {
            diceIndex,
            tokenIndex,
          },
        });
        return;
      }

      botActionLockRef.current = false;

      validateSelectToken({
        actionsTurn,
        currentTurn,
        diceIndex,
        listTokens,
        tokenIndex,
        totalTokens,
        setActionsMoveToken,
        setActionsTurn,
        setTotalTokens,
        setListTokens,
      });
    },
    [
      actionsTurn,
      currentTurn,
      canControlOnlineBot,
      emitRoomAction,
      isBotTurn,
      isMyOnlineTurn,
      isOnlineGame,
      listTokens,
      roomName,
      totalTokens,
    ],
  );

  /* ────────── timer handler ────────── */
  const handleTimer = useCallback(
    (ends = false) => {
      const currentPlayer = players[currentTurn];
      if (!currentPlayer) return;

      const { isBot } = currentPlayer;

      if (isOnlineGame) {
        if (isBot) {
          if (!canControlOnlineBot) return;
        } else if (!isMyOnlineTurn) {
          return;
        }
      }

      const makeAutomaticMovement = ends || isBot;

      if (makeAutomaticMovement) {
        if (actionsTurn.actionsBoardGame === EActionsBoardGame.ROLL_DICE) {
          handleSelectDice();
        }

        if (actionsTurn.actionsBoardGame === EActionsBoardGame.SELECT_TOKEN) {
          if (
            isBot &&
            hasControlledBotMode &&
            favoredBotIndex >= 0 &&
            activeBotMode
          ) {
            const { diceIndex, tokenIndex } =
              getOfflineControlledTokenSelection(
                currentTurn,
                listTokens,
                actionsTurn.diceList,
                favoredBotIndex,
                activeBotMode,
              );

            handleSelectedToken({ diceIndex, tokenIndex });
            return;
          }

          const { diceIndex, tokenIndex } = validateSelectTokenRandomly(
            currentTurn,
            listTokens,
            actionsTurn.diceList,
          );

          handleSelectedToken({ diceIndex, tokenIndex });
        }
      }
    },
    [
      actionsTurn.actionsBoardGame,
      actionsTurn.diceList,
      activeBotMode,
      canControlOnlineBot,
      currentTurn,
      favoredBotIndex,
      handleSelectedToken,
      hasControlledBotMode,
      isMyOnlineTurn,
      isOnlineGame,
      listTokens,
      players,
    ],
  );

  /* ────────── dice select handler ────────── */
  const handleSelectDice = useCallback(
    (diceValue?: TDicevalues, isActionSocket = false) => {
      /* ────────── controlled bot dice for assist mode ────────── */
      let resolvedDiceValue = diceValue;

      if (
        !resolvedDiceValue &&
        isBotTurn &&
        hasControlledBotMode &&
        activeBotMode === "ASSIST" &&
        favoredBotIndex >= 0
      ) {
        resolvedDiceValue = getOfflineWeightedDice({
          actionsTurn,
          currentTurn,
          listTokens,
          favoredBotIndex,
          currentRollCount: actionsTurn.diceRollNumber,
          assistOpeningDelay: assistOpeningDelayRef.current,
        });
      }

      if (!resolvedDiceValue) {
        resolvedDiceValue = (Math.floor(Math.random() * 6) + 1) as TDicevalues;
      }

      if (isOnlineGame && !isActionSocket) {
        if (isBotTurn) {
          if (!canControlOnlineBot) return;
          if (botActionLockRef.current) return;

          botActionLockRef.current = true;
        } else {
          if (!isMyOnlineTurn) return;
        }

        emitRoomAction({
          type: EActionsBoardGame.ROLL_DICE,
          roomName,
          [EActionsBoardGame.ROLL_DICE]: resolvedDiceValue,
        });
        return;
      }

      botActionLockRef.current = false;

      setActionsTurn((current) =>
        getRandomValueDice(current, resolvedDiceValue),
      );
      playSound(ESounds.ROLL_DICE);
    },
    [
      actionsTurn,
      activeBotMode,
      canControlOnlineBot,
      currentTurn,
      emitRoomAction,
      favoredBotIndex,
      hasControlledBotMode,
      isBotTurn,
      isMyOnlineTurn,
      isOnlineGame,
      listTokens,
      playSound,
      roomName,
    ],
  );

  /* ────────── dice done handler ────────── */
  const handleDoneDice = useCallback(
    (isActionSocket = false) => {
      if (isOnlineGame && !isActionSocket) {
        if (isBotTurn) {
          if (!canControlOnlineBot) return;
          if (botActionLockRef.current) return;

          botActionLockRef.current = true;
        } else {
          if (!isMyOnlineTurn) return;
        }

        emitRoomAction({
          type: EActionsBoardGame.DONE_DICE,
          roomName,
          [EActionsBoardGame.DONE_DICE]: true,
        });
        return;
      }

      botActionLockRef.current = false;

      validateDicesForTokens({
        actionsTurn,
        currentTurn,
        listTokens,
        players,
        totalTokens,
        currentUserId,
        playSound,
        setActionsMoveToken,
        setActionsTurn,
        setCurrentTurn,
        setListTokens,
        setTotalTokens,
      });
    },
    [
      actionsTurn,
      currentTurn,
      currentUserId,
      canControlOnlineBot,
      emitRoomAction,
      isBotTurn,
      isMyOnlineTurn,
      isOnlineGame,
      listTokens,
      players,
      playSound,
      roomName,
      totalTokens,
    ],
  );

  /* ────────── mute chat handler ────────── */
  const handleMuteChat = useCallback((playerIndex: number) => {
    console.log("handleMuteChat: ", { playerIndex });
  }, []);

  /* ────────── unlock bot action after state changes ────────── */
  useEffect(() => {
    botActionLockRef.current = false;
  }, [currentTurn, actionsTurn.actionsBoardGame, actionsTurn.diceList.length]);

  /* ────────── settle wager when game over ────────── */
  useEffect(() => {
    if (
      !isOnlineGame ||
      !socket ||
      !roomName ||
      !betAmount ||
      didEmitMatchResultRef.current
    ) {
      return;
    }

    const sortedPlayers = [...players]
      .filter((player) => player.ranking > 0)
      .sort((a, b) => a.ranking - b.ranking);

    const winner = sortedPlayers[0];
    if (!winner || !isGameOver.gameOver) return;

    didEmitMatchResultRef.current = true;
    socket.emit("MATCH_RESULT", {
      roomName,
      winnerUserId: winner.id,
    });
    refreshWallet();
  }, [
    betAmount,
    isGameOver.gameOver,
    isOnlineGame,
    players,
    refreshWallet,
    roomName,
    socket,
  ]);

  /* ────────── socket listeners ────────── */
  useEffect(() => {
    if (!isOnlineGame || !socket) return;

    const onRollDice = (payload: any) => {
      const value = payload?.[EActionsBoardGame.ROLL_DICE] as TDicevalues;
      if (!value) return;
      handleSelectDice(value, true);
    };

    const onSelectToken = (payload: any) => {
      const data = payload?.[EActionsBoardGame.SELECT_TOKEN] as
        | ISelectTokenValues
        | undefined;

      if (!data) return;
      handleSelectedToken(data, true);
    };

    const onDoneDice = () => {
      handleDoneDice(true);
    };

    const onOpponentLeave = (payload: any) => {
      const leftUserId =
        payload?.[EActionsBoardGame.OPPONENT_LEAVE] ||
        payload?.OPPONENT_LEAVE ||
        "";

      if (!leftUserId) return;

      handleOpponentLeaveResult(leftUserId);
    };

    const onWagerSettled = () => {
      refreshWallet();
    };

    socket.on(EActionsBoardGame.ROLL_DICE, onRollDice);
    socket.on(EActionsBoardGame.SELECT_TOKEN, onSelectToken);
    socket.on(EActionsBoardGame.DONE_DICE, onDoneDice);
    socket.on(EActionsBoardGame.OPPONENT_LEAVE, onOpponentLeave);
    socket.on("WAGER_SETTLED", onWagerSettled);

    return () => {
      socket.off(EActionsBoardGame.ROLL_DICE, onRollDice);
      socket.off(EActionsBoardGame.SELECT_TOKEN, onSelectToken);
      socket.off(EActionsBoardGame.DONE_DICE, onDoneDice);
      socket.off(EActionsBoardGame.OPPONENT_LEAVE, onOpponentLeave);
      socket.off("WAGER_SETTLED", onWagerSettled);
    };
  }, [
    handleDoneDice,
    handleOpponentLeaveResult,
    handleSelectDice,
    handleSelectedToken,
    isOnlineGame,
    refreshWallet,
    socket,
  ]);

  /* ────────── token movement interval ────────── */
  useInterval(
    () => {
      validateMovementToken({
        actionsMoveToken,
        actionsTurn,
        currentTurn,
        listTokens,
        players,
        totalTokens,
        currentUserId,
        playSound,
        setActionsMoveToken,
        setActionsTurn,
        setCurrentTurn,
        setIsGameOver,
        setListTokens,
        setPlayers,
        setTotalTokens,
      });
    },
    actionsMoveToken.isRunning ? TOKEN_MOVEMENT_INTERVAL_VALUE : null,
  );

  /* ────────── game over wait ────────── */
  useWait(
    isGameOver.gameOver,
    WAIT_SHOW_MODAL_GAME_OVER,
    useCallback(() => setIsGameOver({ showModal: true, gameOver: true }), []),
  );

  /* ────────── profile props ────────── */
  const profileHandlers = {
    handleTimer,
    handleSelectDice,
    handleDoneDice,
    handleMuteChat,
  };

  const profileProps = { players, totalPlayers, currentTurn, actionsTurn };

  return (
    <PageWrapper leftOption={<BackButton withConfirmation />}>
      {isGameOver.showModal && <Gameover players={players} />}

      <BoardWrapper>
        <ProfileSection
          basePosition={EPositionProfiles.TOP}
          profileHandlers={profileHandlers}
          {...profileProps}
        />

        <Board boardColor={boardColor}>
          {debug && <Debug.Tiles />}

          <Tokens
            debug={debug}
            isDisabledUI={actionsTurn.isDisabledUI}
            listTokens={listTokens}
            diceList={actionsTurn.diceList}
            handleSelectedToken={handleSelectedToken}
          />

          <ShowTotalTokens totalTokens={totalTokens} />
        </Board>

        <ProfileSection
          basePosition={EPositionProfiles.BOTTOM}
          profileHandlers={profileHandlers}
          {...profileProps}
        />
      </BoardWrapper>

      {debug && (
        <Debug.Tokens
          typeGame={typeGame}
          players={players}
          listTokens={listTokens}
          actionsTurn={actionsTurn}
          setListTokens={setListTokens}
          handleSelectDice={handleSelectDice}
        />
      )}
    </PageWrapper>
  );
};

export default React.memo(Game);
