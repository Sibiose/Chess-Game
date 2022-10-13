import { useMemo, useState } from "react";
import { canMove, move } from "./MovementLogic";
import { Cell, emptyCell } from "./Cell";
import { PieceType, PlayerColors } from "./PieceEnums";
import { onPlayerMove } from "../api/Server";

/**
 * An interface used for the boardState
 */
export interface BoardState {
    bottomPlayer: PlayerColors;
    cells: Cell[];
    stateHistory: BoardState[];
    capturedPieces: Cell[];
    currentPlayer: PlayerColors;
    hasCapturedOnLastMove: boolean;
    lastMovedPiece: Cell;
    targetCellCode: string;
    isInCheck: boolean;
    isInMate: boolean;
    isInStaleMate: boolean;
    hasCastledOnLastMove: boolean;
    timestamp?: number;
}

/**
 * An interface used for the game object.
 */
export interface ChessGame extends BoardState {
    move: (from: number, to: number) => void
    canMove: (from: number, to: number) => boolean
    switchPlayer: () => void
}

/**
 * A custom hook that generates the boardState and dispatch method.
 * It creates and returns the Game object based on the current boardState.
 * The game methods allow and register any state change
 */
export const useBoard = (roomId: string, gameState: BoardState) => {
    const [boardState, setBoardState] = useState<BoardState>({ ...gameState });

    let game = useMemo(() => {
        return {
            ...boardState,
            move: (from: number, to: number) => onPlayerMove(roomId, from, to),
            canMove: (from: number, to: number) => canMove(boardState, from, to),
            switchPlayer: () => setBoardState(switchPlayer(boardState))
        }
    }, [boardState, setBoardState])
    return game;
}


/**
 * A method used to change the current player;
 */
export const switchPlayer = (boardState: BoardState) => {
    let currentPlayer = getOppositePlayer(boardState.currentPlayer);

    return { ...boardState, currentPlayer }
}

/**
 * A method that creates a default chess board based on the bottom player choice color
 * @returns A default chess board with 64 cells, and 32 pieces placed at their legal positions.The default starting player is always light.
 */
export const createDefaultBoard = (bottomPlayer: PlayerColors): BoardState => {
    let topPlayer = getOppositePlayer(bottomPlayer)
    let cells: Cell[] = [
        { pieceType: PieceType.ROOK, pieceColor: topPlayer, id: 25 }, { pieceType: PieceType.KNIGHT, pieceColor: topPlayer, id: 26 }, { pieceType: PieceType.BISHOP, pieceColor: topPlayer, id: 27 }, { pieceType: PieceType.QUEEN, pieceColor: topPlayer, id: 28 }, { pieceType: PieceType.KING, pieceColor: topPlayer, id: 29 }, { pieceType: PieceType.BISHOP, pieceColor: topPlayer, id: 30 }, { pieceType: PieceType.KNIGHT, pieceColor: topPlayer, id: 31 }, { pieceType: PieceType.ROOK, pieceColor: topPlayer, id: 32 },
        { pieceType: PieceType.PAWN, pieceColor: topPlayer, id: 17 }, { pieceType: PieceType.PAWN, pieceColor: topPlayer, id: 18 }, { pieceType: PieceType.PAWN, pieceColor: topPlayer, id: 19 }, { pieceType: PieceType.PAWN, pieceColor: topPlayer, id: 20 }, { pieceType: PieceType.PAWN, pieceColor: topPlayer, id: 21 }, { pieceType: PieceType.PAWN, pieceColor: topPlayer, id: 22 }, { pieceType: PieceType.PAWN, pieceColor: topPlayer, id: 23 }, { pieceType: PieceType.PAWN, pieceColor: topPlayer, id: 24 },
        emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell,
        emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell,
        emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell,
        emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell,
        { pieceType: PieceType.PAWN, pieceColor: bottomPlayer, id: 9 }, { pieceType: PieceType.PAWN, pieceColor: bottomPlayer, id: 10 }, { pieceType: PieceType.PAWN, pieceColor: bottomPlayer, id: 11 }, { pieceType: PieceType.PAWN, pieceColor: bottomPlayer, id: 12 }, { pieceType: PieceType.PAWN, pieceColor: bottomPlayer, id: 13 }, { pieceType: PieceType.PAWN, pieceColor: bottomPlayer, id: 14 }, { pieceType: PieceType.PAWN, pieceColor: bottomPlayer, id: 15 }, { pieceType: PieceType.PAWN, pieceColor: bottomPlayer, id: 16 },
        { pieceType: PieceType.ROOK, pieceColor: bottomPlayer, id: 1 }, { pieceType: PieceType.KNIGHT, pieceColor: bottomPlayer, id: 2 }, { pieceType: PieceType.BISHOP, pieceColor: bottomPlayer, id: 3 }, { pieceType: PieceType.QUEEN, pieceColor: bottomPlayer, id: 4 }, { pieceType: PieceType.KING, pieceColor: bottomPlayer, id: 5 }, { pieceType: PieceType.BISHOP, pieceColor: bottomPlayer, id: 6 }, { pieceType: PieceType.KNIGHT, pieceColor: bottomPlayer, id: 7 }, { pieceType: PieceType.ROOK, pieceColor: bottomPlayer, id: 8 },
    ]
    let newState = { cells, bottomPlayer, currentPlayer: PlayerColors.LIGHT, capturedPieces: [], stateHistory: [], hasCapturedOnLastMove: false, lastMovedPiece: emptyCell, targetCellCode: '', isInCheck: false, hasCastledOnLastMove: false, isInMate: false, isInStaleMate: false }

    return { ...newState, stateHistory: [{ ...newState }] };
}

export const getOppositePlayer = (playerColor: PlayerColors) => {
    return playerColor === PlayerColors.DARK ? PlayerColors.LIGHT : PlayerColors.DARK;
}