import { PieceType } from "../PiecesModules/PieceType";
import { piecesService, PiecesService } from "./Pieces.service";

export class PiecesController {
  constructor(private piecesService: PiecesService) {}

  getPieces() {
    return this.piecesService.getPieces();
  }

  getPieceByPosition(position: string) {
    return this.piecesService.getPieceByPosition(position);
  }

  createPiece(pieceType: PieceType, isLight: boolean, position: string) {
    return this.piecesService.createPiece(pieceType, isLight, position);
  }

  buildPieces() {
    return this.piecesService.buildPieces();
  }
}

export const piecesController: PiecesController = new PiecesController(
  piecesService
);
