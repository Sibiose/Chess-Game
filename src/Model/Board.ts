import { useEffect, useMemo, useState } from "react";
import { canMove, isPlayerTurn } from "./MovementLogic";
import { Cell, emptyCell } from "./Cell";
import { PieceType, PlayerColors } from "./PieceEnums";
import { onPlayerMove } from "../api/Server";

/**
 * An interface used for the boardState
 */

export interface BoardStateSnapshot {
    bottomPlayer: PlayerColors;
    cells: Cell[];
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
    currentSound?: string;
}

export interface BoardState extends BoardStateSnapshot {
    stateHistory: BoardStateSnapshot[];
}

/**
 * An interface used for the game object.
 */
export interface ChessGame extends BoardState {
    move: (from: number, to: number) => void
    canMove: (from: number, to: number) => boolean
    isPlayerTurn: (playerColor: PlayerColors | undefined) => boolean
}

/**
 * A custom hook that generates the boardState and dispatch method.
 * It creates and returns the Game object based on the current boardState.
 * The game methods allow and register any state change
 */
export const useBoard = (roomId: string, gameState: BoardState) => {
    const [boardState, setBoardState] = useState<BoardState>(gameState);

    useEffect(() => { setBoardState({ ...gameState }) }, [gameState]);

    let game = useMemo(() => {
        return {
            ...boardState,
            move: (from: number, to: number) => onPlayerMove(roomId, from, to),
            canMove: (from: number, to: number) => canMove(boardState, from, to),
            isPlayerTurn: (playerColor: PlayerColors | undefined) => isPlayerTurn(playerColor, boardState.currentPlayer)
        }
    }, [boardState, setBoardState, gameState])
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
    let newState = { cells, bottomPlayer, currentPlayer: PlayerColors.LIGHT, capturedPieces: [], stateHistory: [], hasCapturedOnLastMove: false, lastMovedPiece: emptyCell, targetCellCode: '', isInCheck: false, hasCastledOnLastMove: false, isInMate: false, isInStaleMate: false, timestamp: new Date().getTime() }

    return { ...newState, stateHistory: [{ ...newState }] };
}

export const getOppositePlayer = (playerColor: PlayerColors) => {
    return playerColor === PlayerColors.DARK ? PlayerColors.LIGHT : PlayerColors.DARK;
}

export const getBoardFEN = (boardstate: BoardState): string => {
    let FENstring: string = '';
    let pieceAnnotationMap: Map<PieceType, string> = new Map<PieceType, string>([[PieceType.KING, 'k'], [PieceType.PAWN, 'p'], [PieceType.QUEEN, 'q'], [PieceType.BISHOP, 'b'], [PieceType.KNIGHT, 'n'], [PieceType.ROOK, 'r']]);
    let stringCells = boardstate.cells.map(cell => {
        if (!cell.pieceType) {
            return 'e'
        }
        else {
            let pieceCode = pieceAnnotationMap.get(cell.pieceType) ?? ""
            return cell.pieceColor === PlayerColors.LIGHT ? pieceCode?.toUpperCase() : pieceCode;
        }
    }).filter(c => c);
    let emptyCellsCounter: number = 0;
    stringCells.forEach((str, i) => {
        if (i !== 0 && i % 8 === 0) {
            if (emptyCellsCounter !== 0) {
                FENstring += emptyCellsCounter.toString();
                emptyCellsCounter = 0;
            }
            FENstring += '/';
        }
        if (str === 'e') {
            emptyCellsCounter++
        }
        else {
            if (emptyCellsCounter !== 0) {
                FENstring += emptyCellsCounter.toString();
                emptyCellsCounter = 0;
            }
            FENstring += str;
        }

    });

    FENstring += boardstate.currentPlayer === PlayerColors.DARK ? ' b ' : ' w ';

    let lightKingIndex: number = boardstate.bottomPlayer === PlayerColors.LIGHT ? 60 : 4;
    let darkKingIndex: number = boardstate.bottomPlayer === PlayerColors.LIGHT ? 4 : 60;

    let lightCastleKing: boolean = boardstate.cells[lightKingIndex].pieceType !== PieceType.KING ? false : canMove({ ...boardstate, currentPlayer: PlayerColors.LIGHT }, lightKingIndex, lightKingIndex + 2);
    let lightCastleQueen: boolean = boardstate.cells[lightKingIndex].pieceType !== PieceType.KING ? false : canMove({ ...boardstate, currentPlayer: PlayerColors.LIGHT }, lightKingIndex, lightKingIndex - 3);
    let darkCastleKing: boolean = boardstate.cells[darkKingIndex].pieceType !== PieceType.KING ? false : canMove({ ...boardstate, currentPlayer: PlayerColors.DARK }, darkKingIndex, darkKingIndex + 2);
    let darkCastleQueen: boolean = boardstate.cells[darkKingIndex].pieceType !== PieceType.KING ? false : canMove({ ...boardstate, currentPlayer: PlayerColors.DARK }, darkKingIndex, darkKingIndex - 3);

    if (lightCastleKing)
        FENstring += 'K';
    if (lightCastleQueen)
        FENstring += 'Q';
    if (darkCastleKing)
        FENstring += 'k';
    if (darkCastleQueen)
        FENstring += 'q';
    if (!lightCastleKing && !lightCastleQueen && !darkCastleKing && !darkCastleQueen)
        FENstring += '-';

    //Ignoring En Passant and move turn counter
    FENstring += ' - 0 0';
    return FENstring;
}