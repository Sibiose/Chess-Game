import { useMemo, useState } from "react";
import { canMove, computeMoves, move } from "./MovementLogic";
import { Cell, emptyCell } from "./Cell";
import { PieceType, PlayerColors } from "./PieceEnums";

export interface BoardState {
    bottomPlayer: PlayerColors;
    cells: Cell[];
    legalMoves: number[];
    currentPlayer: PlayerColors;
}

export interface ChessGame extends BoardState {
    move: (from: number, to: number) => void
    canMove: (from: number, to: number) => boolean
    computeMoves: (from: number) => void
    switchPlayer: () => void
}

export const useBoard = (bottomPlayer: PlayerColors) => {
    const [boardState, setBoardState] = useState<BoardState>(createDefaultBoard(bottomPlayer));

    let game = useMemo(() => {
        return {
            ...boardState,
            move: (from: number, to: number) => setBoardState(move(boardState, from, to)),
            canMove: (from: number, to: number) => canMove(boardState, from, to),
            computeMoves: (from: number) => setBoardState(computeMoves(boardState, from)),
            switchPlayer: () => setBoardState(switchPlayer(boardState))
        }
    }, [boardState, setBoardState])
    return game;
}

export const createDefaultBoard = (bottomPlayer: PlayerColors): BoardState => {
    let topPlayer = bottomPlayer === PlayerColors.DARK ? PlayerColors.LIGHT : PlayerColors.DARK;
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
    return { cells, bottomPlayer, legalMoves: [], currentPlayer: PlayerColors.LIGHT };
}

export const switchPlayer = (boardState: BoardState) => {
    let currentPlayer = boardState.currentPlayer === PlayerColors.LIGHT ? PlayerColors.DARK : PlayerColors.LIGHT;

    return { ...boardState, currentPlayer }
}