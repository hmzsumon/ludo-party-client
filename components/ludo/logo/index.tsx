import { EColors } from "@/utils/constants";

import type { TColors } from "@/interfaces";
import Dice from "../dice";
import Piece from "../token/components/piece";

const DATA_LOGO: { letter: string; color: TColors }[] = [
  {
    letter: "L",
    color: EColors.YELLOW,
  },
  {
    letter: "U",
    color: EColors.RED,
  },
  {
    letter: "D",
    color: EColors.GREEN,
  },
  {
    letter: "O",
    color: EColors.BLUE,
  },
];

const Logo = () => (
  <div className="game-logo">
    <div className="game-logo-name">
      <div className="game-logo-dice">
        {new Array(2).fill(null).map((_, key) => (
          <Dice key={key} value={6} size={40} />
        ))}
      </div>
      {DATA_LOGO.map(({ letter, color }) => (
        <div key={letter} className="game-logo-letters">
          <div className="game-logo-letter">{letter}</div>
          <Piece color={color} style={{ width: 30, height: 30 }} />
        </div>
      ))}
    </div>
    <div className="game-logo-footer">Party</div>
  </div>
);

export default Logo;
