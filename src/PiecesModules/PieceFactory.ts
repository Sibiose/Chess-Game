import { Pawn, King, Queen, Knight, Bishop, Rook } from "./IndividualPieces";
import { PieceType } from "./PieceType";
import { PieceImgSrc } from "./PieceImgSrc";
import { Piece } from "./Piece";
import { PiecesMain } from "./PiecesMain";

export class PieceFactory {
  public getPiece(
    pieceType: PieceType,
    isLight: boolean,
    position: string
  ): Piece {
    switch (pieceType) {
      case PieceType.PAWN:
        if (isLight) {
          return new Pawn(PieceImgSrc.LPawn, position);
        } else {
          return new Pawn(PieceImgSrc.DPawn, position);
        }

      case PieceType.KING:
        if (isLight) {
          return new King(PieceImgSrc.LKing, position);
        } else {
          return new King(PieceImgSrc.DKing, position);
        }
      case PieceType.QUEEN:
        if (isLight) {
          return new Queen(PieceImgSrc.LQueen, position);
        } else {
          return new Queen(PieceImgSrc.DQueen, position);
        }
      case PieceType.KNIGHT:
        if (isLight) {
          return new Knight(PieceImgSrc.LKnight, position);
        } else {
          return new Knight(PieceImgSrc.DKnight, position);
        }
      case PieceType.BISHOP:
        if (isLight) {
          return new Bishop(PieceImgSrc.LBishop, position);
        } else {
          return new Bishop(PieceImgSrc.DBishop, position);
        }
      case PieceType.ROOK:
        if (isLight) {
          return new Rook(PieceImgSrc.LRook, position);
        } else {
          return new Rook(PieceImgSrc.DRook, position);
        }
      case undefined:
        throw Error("Unsupported piece!");
    }
  }
}

export const pieceFactory = new PieceFactory();
