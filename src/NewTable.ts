import { Cell } from "./Cell";
import { Piece } from "./PiecesModules/Piece";
import { PiecesMain } from "./PiecesModules/PiecesMain";

export class NewTable {
  cellArray: Cell[] = [];
  columns: string[] = ["1", "2", "3", "4", "5", "6", "7", "8"];
  rows: string[] = ["H", "G", "F", "E", "D", "C", "B", "A"];

  buildTable() {
    this.rows.forEach((row, rowIndex) => {
      this.columns.forEach((column, columnIndex) => {
        this.cellArray.push(
          new Cell(row, column, true, rowIndex + columnIndex)
        );
      });
    });
  }
  buildPieces() {
    PiecesMain.buildLightPieces();
    PiecesMain.buildDarkPieces();
  }

  placePieces() {
    PiecesMain.piecesArr.forEach((piece) => {
      let cell = this.cellArray.filter((cell) => cell.xy === piece.position)[0];
      cell.occupyingPiece.push(piece);
      cell.isFree = false;
    });
  }
}
