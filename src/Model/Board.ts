import { Cell, createDefaultCells } from "./Cell";
import { PlayerColors } from "./PieceEnums";
import { createDefaultPieces, Piece } from "./Piece";

export interface Board {
    cells: Cell[];
    pieces: Piece[];
}

export const createDefaultBoard = (bottomPlayer: PlayerColors): Board => {
    let pieces = createDefaultPieces(bottomPlayer);
    let cells = createDefaultCells(pieces);

    return { pieces, cells };
}