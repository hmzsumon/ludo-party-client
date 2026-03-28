import type { TDataRoomUserOrder, TTotalPlayers } from "@/interfaces";

/**
 * Función que dado el orden de los usuarios, retorna el nombre y la foto
 * dle mismo...
 * @param orderPlayers
 * @param totalPlayers
 * @returns
 */
export const getPositionPlayers = (
  orderPlayers: TDataRoomUserOrder,
  totalPlayers: TTotalPlayers,
) => {
  const players: { name: string; photo: string; isBot?: boolean }[] = [];

  /**
   * Se iteran la totalidad de usuarios que se conectan...
   */
  for (let i = 1; i <= totalPlayers; i++) {
    /**
     * Si el orden del usario existe, se extrae el nombre y la foto
     */
    const { name = "", photo = "", isBot = false } = orderPlayers?.[i] || {};
    players.push({ name, photo, isBot });
  }

  return players;
};
