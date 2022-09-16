import { useMemo, useState } from "react";
import { canMove, move } from "./MovementLogic";
import { Cell, emptyCell } from "./Cell";
import { PieceType, PlayerColors } from "./PieceEnums";

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
export const useBoard = (bottomPlayer: PlayerColors) => {
    const [boardState, setBoardState] = useState<BoardState>(createDefaultBoard(bottomPlayer));

    let game = useMemo(() => {
        return {
            ...boardState,
            move: (from: number, to: number) => setBoardState(move(boardState, from, to)),
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
        { pieceType: PieceType.ROOK, pieceColor: topPlayer }, { pieceType: PieceType.KNIGHT, pieceColor: topPlayer }, { pieceType: PieceType.BISHOP, pieceColor: topPlayer }, { pieceType: PieceType.QUEEN, pieceColor: topPlayer }, { pieceType: PieceType.KING, pieceColor: topPlayer }, { pieceType: PieceType.BISHOP, pieceColor: topPlayer }, { pieceType: PieceType.KNIGHT, pieceColor: topPlayer }, { pieceType: PieceType.ROOK, pieceColor: topPlayer },
        { pieceType: PieceType.PAWN, pieceColor: topPlayer }, { pieceType: PieceType.PAWN, pieceColor: topPlayer }, { pieceType: PieceType.PAWN, pieceColor: topPlayer }, { pieceType: PieceType.PAWN, pieceColor: topPlayer }, { pieceType: PieceType.PAWN, pieceColor: topPlayer }, { pieceType: PieceType.PAWN, pieceColor: topPlayer }, { pieceType: PieceType.PAWN, pieceColor: topPlayer }, { pieceType: PieceType.PAWN, pieceColor: topPlayer },
        emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell,
        emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell,
        emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell,
        emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell,
        { pieceType: PieceType.PAWN, pieceColor: bottomPlayer }, { pieceType: PieceType.PAWN, pieceColor: bottomPlayer }, { pieceType: PieceType.PAWN, pieceColor: bottomPlayer }, { pieceType: PieceType.PAWN, pieceColor: bottomPlayer }, { pieceType: PieceType.PAWN, pieceColor: bottomPlayer }, { pieceType: PieceType.PAWN, pieceColor: bottomPlayer }, { pieceType: PieceType.PAWN, pieceColor: bottomPlayer }, { pieceType: PieceType.PAWN, pieceColor: bottomPlayer },
        { pieceType: PieceType.ROOK, pieceColor: bottomPlayer }, { pieceType: PieceType.KNIGHT, pieceColor: bottomPlayer }, { pieceType: PieceType.BISHOP, pieceColor: bottomPlayer }, { pieceType: PieceType.QUEEN, pieceColor: bottomPlayer }, { pieceType: PieceType.KING, pieceColor: bottomPlayer }, { pieceType: PieceType.BISHOP, pieceColor: bottomPlayer }, { pieceType: PieceType.KNIGHT, pieceColor: bottomPlayer }, { pieceType: PieceType.ROOK, pieceColor: bottomPlayer },
    ]
    let newState = { cells, bottomPlayer, currentPlayer: PlayerColors.LIGHT, capturedPieces: [], stateHistory: [], hasCapturedOnLastMove: false, lastMovedPiece: emptyCell, targetCellCode: '', isInCheck: false }

    return { ...newState, stateHistory: [{ ...newState }] };
}

export const getOppositePlayer = (playerColor: PlayerColors) => {
    return playerColor === PlayerColors.DARK ? PlayerColors.LIGHT : PlayerColors.DARK;
}