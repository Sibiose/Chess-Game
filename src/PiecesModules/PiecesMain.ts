import { Piece } from "./Piece";
import { PieceFactory } from "./PieceFactory";
import { PieceType } from "./PieceType";
import { PiecesStarterPosition } from "./PiecesStarterPosition";

export class PiecesMain {
  public static piecesArr: Piece[] = [];

  public static createPiece(
    pieceType: PieceType,
    isLight: boolean,
    position: string
  ): Piece {
    let createdPiece: Piece = PieceFactory.getPiece(
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
}
