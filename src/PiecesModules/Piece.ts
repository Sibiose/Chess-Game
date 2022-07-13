import { IPiece } from "./IPiece";

export class Piece implements IPiece {
  constructor(
    public imgSrc: string,
    public position: string,
    public pieceId: number
  ) {
    this.imgSrc = imgSrc;
    this.position = position;
  }

  move(newPosition: string): string {
    this.position = newPosition;
    return this.position;
  }
  select(){
    
  }
}
