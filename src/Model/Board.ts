import { Cell } from "./Cell";
import { PieceType, PlayerColors } from "./PieceEnums";

export interface Board {
    cells: Cell[];
}

export const createDefaultBoard = (bottomPlayer: PlayerColors): Board => {
    let topPlayer = bottomPlayer === PlayerColors.DARK ? PlayerColors.LIGHT : PlayerColors.DARK;
    let cells: Cell[] = [
        { piece: { type: PieceType.ROOK, color: topPlayer }, position: { x: 1, y: 8 } }, { piece: { type: PieceType.KNIGHT, color: topPlayer }, position: { x: 2, y: 8 } }, { piece: { type: PieceType.BISHOP, color: topPlayer }, position: { x: 3, y: 8 } }, { piece: { type: PieceType.QUEEN, color: topPlayer }, position: { x: 4, y: 8 } }, { piece: { type: PieceType.KING, color: topPlayer }, position: { x: 5, y: 8 } }, { piece: { type: PieceType.BISHOP, color: topPlayer }, position: { x: 6, y: 8 } }, { piece: { type: PieceType.KNIGHT, color: topPlayer }, position: { x: 7, y: 8 } }, { piece: { type: PieceType.ROOK, color: topPlayer }, position: { x: 8, y: 8 } },
        { piece: { type: PieceType.PAWN, color: topPlayer }, position: { x: 1, y: 7 } }, { piece: { type: PieceType.PAWN, color: topPlayer }, position: { x: 2, y: 7 } }, { piece: { type: PieceType.PAWN, color: topPlayer }, position: { x: 3, y: 7 } }, { piece: { type: PieceType.PAWN, color: topPlayer }, position: { x: 4, y: 7 } }, { piece: { type: PieceType.PAWN, color: topPlayer }, position: { x: 5, y: 7 } }, { piece: { type: PieceType.PAWN, color: topPlayer }, position: { x: 6, y: 7 } }, { piece: { type: PieceType.PAWN, color: topPlayer }, position: { x: 7, y: 7 } }, { piece: { type: PieceType.PAWN, color: topPlayer }, position: { x: 8, y: 7 } },
        { position: { x: 1, y: 6 } }, { position: { x: 2, y: 6 } }, { position: { x: 3, y: 6 } }, { position: { x: 4, y: 6 } }, { position: { x: 5, y: 6 } }, { position: { x: 6, y: 6 } }, { position: { x: 7, y: 6 } }, { position: { x: 8, y: 6 } },
        { position: { x: 1, y: 5 } }, { position: { x: 2, y: 5 } }, { position: { x: 3, y: 5 } }, { position: { x: 4, y: 5 } }, { position: { x: 5, y: 5 } }, { position: { x: 6, y: 5 } }, { position: { x: 7, y: 5 } }, { position: { x: 8, y: 5 } },
        { position: { x: 1, y: 4 } }, { position: { x: 2, y: 4 } }, { position: { x: 3, y: 4 } }, { position: { x: 4, y: 4 } }, { position: { x: 5, y: 4 } }, { position: { x: 6, y: 4 } }, { position: { x: 7, y: 4 } }, { position: { x: 8, y: 4 } },
        { position: { x: 1, y: 3 } }, { position: { x: 2, y: 3 } }, { position: { x: 3, y: 3 } }, { position: { x: 4, y: 3 } }, { position: { x: 5, y: 3 } }, { position: { x: 6, y: 3 } }, { position: { x: 7, y: 3 } }, { position: { x: 8, y: 3 } },
        { piece: { type: PieceType.PAWN, color: bottomPlayer }, position: { x: 1, y: 2 } }, { piece: { type: PieceType.PAWN, color: bottomPlayer }, position: { x: 2, y: 2 } }, { piece: { type: PieceType.PAWN, color: bottomPlayer }, position: { x: 3, y: 2 } }, { piece: { type: PieceType.PAWN, color: bottomPlayer }, position: { x: 4, y: 2 } }, { piece: { type: PieceType.PAWN, color: bottomPlayer }, position: { x: 5, y: 2 } }, { piece: { type: PieceType.PAWN, color: bottomPlayer }, position: { x: 6, y: 2 } }, { piece: { type: PieceType.PAWN, color: bottomPlayer }, position: { x: 7, y: 2 } }, { piece: { type: PieceType.PAWN, color: bottomPlayer }, position: { x: 8, y: 2 } },
        { piece: { type: PieceType.ROOK, color: bottomPlayer }, position: { x: 1, y: 1 } }, { piece: { type: PieceType.KNIGHT, color: bottomPlayer }, position: { x: 2, y: 1 } }, { piece: { type: PieceType.BISHOP, color: bottomPlayer }, position: { x: 3, y: 1 } }, { piece: { type: PieceType.QUEEN, color: bottomPlayer }, position: { x: 4, y: 1 } }, { piece: { type: PieceType.KING, color: bottomPlayer }, position: { x: 5, y: 1 } }, { piece: { type: PieceType.BISHOP, color: bottomPlayer }, position: { x: 6, y: 1 } }, { piece: { type: PieceType.KNIGHT, color: bottomPlayer }, position: { x: 7, y: 1 } }, { piece: { type: PieceType.ROOK, color: bottomPlayer }, position: { x: 8, y: 1 } }

    ]

    return { cells };
}