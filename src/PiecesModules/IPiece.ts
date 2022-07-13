export interface IPiece {
  imgSrc: string;
  position: string;
  pieceId: number;

  move(newPosition: string): string;
}
