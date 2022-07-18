import { Piece } from "./Piece";
import { pieceFactory, PieceFactory } from "./PieceFactory";
import { PieceType } from "./PieceType";
import { PiecesStarterPosition } from "./PiecesStarterPosition";
import { Cell } from "../Cell";

interface selectedSquare {
  selectedPiece: Piece[];
  selectedCell: Cell[];
}

export class PiecesMain {
  public static piecesArr: Piece[] = [];
  public static selectedPiece: Piece[] = [];
  public static selectedCell: Cell[] = [];

  public static createPiece(
    pieceType: PieceType,
    isLight: boolean,
    position: string
  ): Piece {
    let createdPiece: Piece = pieceFactory.getPiece(
      pieceType,
      isLight,
      position
    );
    PiecesMain.piecesArr.push(createdPiece);
    return createdPiece;
  }

  public static buildLightPieces() {
    PiecesStarterPosition.LPawn.forEach((p) => {
      PiecesMain.createPiece(PieceType.PAWN, true, p);
    });
    PiecesStarterPosition.LKing.forEach((p) => {
      PiecesMain.createPiece(PieceType.KING, true, p);
    });
    PiecesStarterPosition.LQueen.forEach((p) => {
      PiecesMain.createPiece(PieceType.QUEEN, true, p);
    });
    PiecesStarterPosition.LKnight.forEach((p) => {
      PiecesMain.createPiece(PieceType.KNIGHT, true, p);
    });
    PiecesStarterPosition.LBishop.forEach((p) => {
      PiecesMain.createPiece(PieceType.BISHOP, true, p);
    });
    PiecesStarterPosition.LRook.forEach((p) => {
      PiecesMain.createPiece(PieceType.ROOK, true, p);
    });
  }
  public static buildDarkPieces() {
    PiecesStarterPosition.DPawn.forEach((pawn) => {
      PiecesMain.createPiece(PieceType.PAWN, false, pawn);
    });
    PiecesStarterPosition.DKing.forEach((p) => {
      PiecesMain.createPiece(PieceType.KING, false, p);
    });
    PiecesStarterPosition.DQueen.forEach((p) => {
      PiecesMain.createPiece(PieceType.QUEEN, false, p);
    });
    PiecesStarterPosition.DKnight.forEach((p) => {
      PiecesMain.createPiece(PieceType.KNIGHT, false, p);
    });
    PiecesStarterPosition.DBishop.forEach((p) => {
      PiecesMain.createPiece(PieceType.BISHOP, false, p);
    });
    PiecesStarterPosition.DRook.forEach((p) => {
      PiecesMain.createPiece(PieceType.ROOK, false, p);
    });
  }

  public static selectPiece(piece: Piece, cell: Cell) {
    PiecesMain.deSelectPiece();
    PiecesMain.selectedPiece.push(piece);
    PiecesMain.selectedCell.push(cell);
    console.log(piece);
  }

  public static deSelectPiece() {
    PiecesMain.selectedPiece = [];
    PiecesMain.selectedCell = [];
  }
}
