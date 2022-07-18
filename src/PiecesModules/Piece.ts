import { IPiece } from "./IPiece";

export class Piece implements IPiece {
  constructor(public imgSrc: string, public position: string) {}

  move(newPosition: string): string {
    this.position = newPosition;
    return this.position;
  }
}
