export interface IPiece {
  imgSrc: string;
  position: string;

  move(newPosition: string): string;
}
