import { Coordinate } from "./Coordinate";
import { Piece } from "./PiecesModules/Piece";

export class Cell extends Coordinate {
  isFree: boolean;
  occupyingPiece: Piece[];

  constructor(x: string, y: string, isFree: boolean, xySum: number) {
    super(x, y, xySum);
    this.isFree = isFree;
    this.occupyingPiece = [];
  }
}
