import { Pawn, King, Queen, Knight, Bishop, Rook } from "./IndividualPieces";
import { PieceType } from "./PieceType";
import { PieceImgSrc } from "./PieceImgSrc";
import { Piece } from "./Piece";
import { PiecesMain } from "./PiecesMain";

export class PieceFactory {
  public static getPiece(
    pieceType: PieceType,
    isLight: boolean,
    position: string
  ): Piece {
    switch (pieceType) {
      case PieceType.PAWN:
        if (isLight) {
          return new Pawn(
            PieceImgSrc.LPawn,
            position,
            PieceFactory.generatePieceId()
          );
        } else {
          return new Pawn(
            PieceImgSrc.DPawn,
            position,
            PieceFactory.generatePieceId()
          );
        }

      case PieceType.KING:
        if (isLight) {
          return new King(
            PieceImgSrc.LKing,
            position,
            PieceFactory.generatePieceId()
          );
        } else {
          return new King(
            PieceImgSrc.DKing,
            position,
            PieceFactory.generatePieceId()
          );
        }
      case PieceType.QUEEN:
        if (isLight) {
          return new Queen(
            PieceImgSrc.LQueen,
            position,
            PieceFactory.generatePieceId()
          );
        } else {
          return new Queen(
            PieceImgSrc.DQueen,
            position,
            PieceFactory.generatePieceId()
          );
        }
      case PieceType.KNIGHT:
        if (isLight) {
          return new Knight(
            PieceImgSrc.LKnight,
            position,
            PieceFactory.generatePieceId()
          );
        } else {
          return new Knight(
            PieceImgSrc.DKnight,
            position,
            PieceFactory.generatePieceId()
          );
        }
      case PieceType.BISHOP:
        if (isLight) {
          return new Bishop(
            PieceImgSrc.LBishop,
            position,
            PieceFactory.generatePieceId()
          );
        } else {
          return new Bishop(
            PieceImgSrc.DBishop,
            position,
            PieceFactory.generatePieceId()
          );
        }
      case PieceType.ROOK:
        if (isLight) {
          return new Rook(
            PieceImgSrc.LRook,
            position,
            PieceFactory.generatePieceId()
          );
        } else {
          return new Rook(
            PieceImgSrc.DRook,
            position,
            PieceFactory.generatePieceId()
          );
        }
      case undefined:
        throw Error("Unsupported piece!");
    }
  }

  private static generatePieceId(): number {
    return PiecesMain.piecesArr.length + 1;
  }
}
