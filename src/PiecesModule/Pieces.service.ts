import { Piece } from "../PiecesModules/Piece";
import { PieceFactory } from "../PiecesModules/PieceFactory";
import { PiecesStarterPosition } from "../PiecesModules/PiecesStarterPosition";
import { PieceType } from "../PiecesModules/PieceType";

export class PiecesService {
  constructor(
    private pieces: Piece[] = [],
    private pieceFactory: PieceFactory = new PieceFactory()
  ) {}

  public getPieces(): Piece[] {
    return this.pieces;
  }

  public getPieceByPosition(position: string): Piece {
    return this.pieces.filter((piece) => piece.position === position)[0];
  }

  public createPiece(
    pieceType: PieceType,
    isLight: boolean,
    position: string
  ): Piece {
    let piece = this.pieceFactory.getPiece(pieceType, isLight, position);
    this.pieces.push(piece);
    return piece;
  }

  private buildLightPieces() {
    PiecesStarterPosition.LPawn.forEach((p) => {
      this.createPiece(PieceType.PAWN, true, p);
    });
    PiecesStarterPosition.LKing.forEach((p) => {
      this.createPiece(PieceType.KING, true, p);
    });
    PiecesStarterPosition.LQueen.forEach((p) => {
      this.createPiece(PieceType.QUEEN, true, p);
    });
    PiecesStarterPosition.LKnight.forEach((p) => {
      this.createPiece(PieceType.KNIGHT, true, p);
    });
    PiecesStarterPosition.LBishop.forEach((p) => {
      this.createPiece(PieceType.BISHOP, true, p);
    });
    PiecesStarterPosition.LRook.forEach((p) => {
      this.createPiece(PieceType.ROOK, true, p);
    });
  }

  private buildDarkPieces() {
    PiecesStarterPosition.DPawn.forEach((pawn) => {
      this.createPiece(PieceType.PAWN, false, pawn);
    });
    PiecesStarterPosition.DKing.forEach((p) => {
      this.createPiece(PieceType.KING, false, p);
    });
    PiecesStarterPosition.DQueen.forEach((p) => {
      this.createPiece(PieceType.QUEEN, false, p);
    });
    PiecesStarterPosition.DKnight.forEach((p) => {
      this.createPiece(PieceType.KNIGHT, false, p);
    });
    PiecesStarterPosition.DBishop.forEach((p) => {
      this.createPiece(PieceType.BISHOP, false, p);
    });
    PiecesStarterPosition.DRook.forEach((p) => {
      this.createPiece(PieceType.ROOK, false, p);
    });
  }

  public buildPieces() {
    this.buildLightPieces();
    this.buildLightPieces();
  }
}

export const piecesService = new PiecesService();
