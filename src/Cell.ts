import { Coordinate } from "./Coordinate";

export class Cell extends Coordinate {
  isFree: boolean;

  constructor(x: string, y: string, isFree: boolean, xySum: number) {
    super(x, y, xySum);
    this.isFree = isFree;
  }
}
