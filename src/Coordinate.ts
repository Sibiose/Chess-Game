export class Coordinate {
  x: string;
  y: string;
  xy: string;
  xySum: number;

  constructor(x: string, y: string, xySum: number) {
    this.x = x;
    this.y = y;
    this.xy = x + y;
    this.xySum = xySum;
  }
}
