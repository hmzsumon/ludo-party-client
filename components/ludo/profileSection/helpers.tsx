import type {
  IActionsTurn,
  IPlayer,
  IProfileHandlers,
  TPositionProfile,
  TPositionProfiles,
  TTotalPlayers,
} from "@/interfaces";
import { DEFAULT_VALUE_ACTION_TURN } from "@/utils/constants";
import { Profile } from "./components";

type TPositionPlayerIndex = Record<TPositionProfile, number>;
type TPositionBoard = Record<TPositionProfiles, Partial<TPositionPlayerIndex>>;
type TPositionTotalPlayers = Record<TTotalPlayers, Partial<TPositionBoard>>;

export interface ProfileSectionProps {
  basePosition: TPositionProfiles;
  currentTurn: number;
  players: IPlayer[];
  totalPlayers: TTotalPlayers;
  profileHandlers: IProfileHandlers;
  actionsTurn: IActionsTurn;
  currentUserId?: string;
}

/**
 * Default distribution — offline mode এ ব্যবহার হয়।
 * Player 1 সবসময় BOTTOM LEFT, Player 2 TOP RIGHT।
 */
const DISTRIBUTION_PROFILES: TPositionTotalPlayers = {
  2: {
    BOTTOM: { LEFT: 1 },
    TOP: { RIGHT: 2 },
  },
  3: {
    BOTTOM: { LEFT: 1 },
    TOP: { LEFT: 2, RIGHT: 3 },
  },
  4: {
    BOTTOM: { LEFT: 1, RIGHT: 4 },
    TOP: { LEFT: 2, RIGHT: 3 },
  },
};

/**
 * Online mode এ current user কে সবসময় BOTTOM LEFT এ দেখাতে
 * player গুলোর actual index থেকে একটি custom distribution তৈরি করে।
 *
 * উদাহরণ (2 player):
 *   Backend order: [Sumon(idx=0, GREEN/BOTTOM_LEFT), Nahid(idx=1, BLUE/TOP_RIGHT)]
 *
 *   Sumon এর device (myIndex=0):
 *     BOTTOM LEFT  → players[0] = Sumon     ✅
 *     TOP    RIGHT → players[1] = Nahid     ✅
 *
 *   Nahid এর device (myIndex=1):
 *     BOTTOM LEFT  → players[1] = Nahid     ✅  (1-based: slot 2)
 *     TOP    RIGHT → players[0] = Sumon     ✅  (1-based: slot 1)
 */
const buildOnlineDistribution = (
  myIndex: number,
  totalPlayers: TTotalPlayers,
): TPositionTotalPlayers => {
  const n = totalPlayers;

  // 1-based slots এ current user কে BOTTOM LEFT এ রাখি,
  // বাকিরা order অনুযায়ী পরের slot এ যাবে।
  // slot(i) = (myIndex + i) % n, 1-based = slot(i) + 1
  const slot = (offset: number) => ((myIndex + offset) % n) + 1;

  if (n === 2) {
    return {
      2: {
        BOTTOM: { LEFT: slot(0) },
        TOP: { RIGHT: slot(1) },
      },
    } as TPositionTotalPlayers;
  }

  if (n === 3) {
    return {
      3: {
        BOTTOM: { LEFT: slot(0) },
        TOP: { LEFT: slot(1), RIGHT: slot(2) },
      },
    } as TPositionTotalPlayers;
  }

  // 4 players
  return {
    4: {
      BOTTOM: { LEFT: slot(0), RIGHT: slot(3) },
      TOP: { LEFT: slot(1), RIGHT: slot(2) },
    },
  } as TPositionTotalPlayers;
};

export const renderProfileComponent = (
  props: ProfileSectionProps,
  position: TPositionProfile,
) => {
  const {
    basePosition,
    currentTurn,
    players,
    totalPlayers,
    profileHandlers,
    actionsTurn,
    currentUserId,
  } = props;

  /* ── Online game এ current user এর actual index বের করি ── */
  const myIndex = currentUserId
    ? players.findIndex((p) => p.id === currentUserId)
    : -1;

  /*
   * myIndex > 0 মানে current user backend order এ প্রথমে নেই,
   * তখন তার perspective অনুযায়ী distribution বানাই।
   * myIndex === 0 বা offline এ default distribution ব্যবহার হবে।
   */
  const distribution =
    myIndex > 0
      ? buildOnlineDistribution(myIndex, totalPlayers)
      : DISTRIBUTION_PROFILES;

  /* indexProfile: 1-based player slot number, 0 মানে এই position এ কেউ নেই */
  const indexProfile =
    distribution[totalPlayers]?.[basePosition]?.[position] || 0;

  if (indexProfile !== 0) {
    const hasTurn = currentTurn === indexProfile - 1;
    const newActionsTurn = hasTurn ? actionsTurn : DEFAULT_VALUE_ACTION_TURN;

    const extProps = {
      basePosition,
      position,
      hasTurn,
      actionsTurn: newActionsTurn,
      ...profileHandlers,
    };

    return <Profile {...extProps} player={players[indexProfile - 1]} />;
  }
};
