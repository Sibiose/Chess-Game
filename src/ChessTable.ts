import { Cell } from "./Cell";
import { Piece } from "./PiecesModules/Piece";
import { PiecesMain } from "./PiecesModules/PiecesMain";

export class ChessTable {
  columns: string[] = ["1", "2", "3", "4", "5", "6", "7", "8"];
  rows: string[] = ["H", "G", "F", "E", "D", "C", "B", "A"];
  cellArr: Cell[] = [];
  pieces: Piece[] = [];

  buildTable() {
    this.rows.forEach((row, rowIndex) => {
      this.columns.forEach((column, columnIndex) => {
        this.cellArr.push(new Cell(row, column, true, rowIndex + columnIndex));
      });
    });
  }
  buildPieces() {
    PiecesMain.buildLightPieces();
    PiecesMain.buildDarkPieces();
  }
  renderPieces() {}
}

export const chessTable: ChessTable = new ChessTable();

chessTable.buildTable();
chessTable.buildPieces();
PiecesMain.piecesArr[2].move(`D3`);
console.log(PiecesMain.piecesArr);
