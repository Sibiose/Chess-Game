import { socket } from "../Server_API/ChessServer";
import { BoardState, getOppositePlayer } from "./Board";
import { Cell, indexToPosition, indexToString, positionToIndex } from "./Cell";
import { PieceType, PlayerColors } from "./PieceEnums";

/**
 *  A method that takes in the current boardstate, swaps the drop cell with the dragging cell and then erases the content of the dragged cell.
 * @returns A new Board State
 */
export const move = (boardState: BoardState, from: number, to: number) => {
    let fromCell = { ...boardState.cells[from] };
    let toCell = { ...boardState.cells[to] }
    const dx = Math.abs(indexToPosition(from)[0] - indexToPosition(to)[0]);

    handleCastle(boardState, from, to);
    handleCapturePiece(boardState, toCell, toCell.pieceColor ? true : false)
    if (checkPromote(boardState.cells[from].pieceType, to))
        promotePawn(boardState.cells[from]);

    boardState.lastMovedPiece = { ...boardState.cells[from] };
    boardState.targetCellCode = indexToString(to);
    boardState.cells[from].wasMoved = true;
    boardState.cells[to] = { ...boardState.cells[from] };
    boardState.cells[from] = {};
    let isInCheck = isPlayerInCheck(boardState, getOppositePlayer(boardState.currentPlayer));
    let hasLegalMoves = detectHasLegalMoves(boardState, getOppositePlayer(boardState.currentPlayer));
    let isInMate = isInCheck && hasLegalMoves === false;
    let isInStaleMate = !isInCheck && hasLegalMoves === false;

    boardState.isInCheck = isInCheck;
    boardState.isInMate = isInMate;
    boardState.isInStaleMate = isInStaleMate;
    let { stateHistory, ...boardStateSnapshot } = boardState;

    boardState.stateHistory.push({ ...boardStateSnapshot })

    //Playing sound depending on case
    let sound: string = 'Move'
    if (isInMate)
        sound = 'CheckMate'
    else if (isInCheck)
        sound = 'Check'
    else if (fromCell.pieceType === PieceType.KING && dx > 1)
        sound = 'Castle'
    else if (toCell?.pieceType)
        sound = 'Capture'

    playSound(sound);

    return { ...boardState }
}

/**
 * A method that is called for every drop cell and decides whether that cell is a viable drop spot.
 * @returns A boolean response that will dictate whether the dragged element can be dropped there.
 */
export const canMove = (boardState: BoardState, from: number, to: number) => {
    let [x1, y1] = indexToPosition(from);
    let [x2, y2] = indexToPosition(to);
    let dx = Math.abs(x2 - x1);
    let lastCell = boardState.cells[from];
    let cell = boardState.cells[to];

    if (lastCell.pieceColor === cell.pieceColor)
        return false;
    if (lastCell.pieceColor !== boardState.currentPlayer)
        return false;

    let pseudoState = pseudoMove(boardState, from, to);

    if (isPlayerInCheck(pseudoState, boardState.currentPlayer))
        return false;

    //Not letting king cross a check whilst castling
    if (lastCell.pieceType === PieceType.KING && dx > 1) {
        for (let i = 1; i <= dx; i++) {
            pseudoState = pseudoMove(boardState, from, x1 < x2 ? from + i : from - i)
            if (isPlayerInCheck(pseudoState, boardState.currentPlayer)) {
                return false;
            }
        }
    }

    return computePieceMoves(boardState, from, to);
}

/**
 * A method that simulates a chess move for the current player
 * @returns A simulated state that exists one move ahead of the current state.
 */
export const pseudoMove = (boardState: BoardState, from: number, to: number) => {
    let pseudoState = { ...boardState }
    let cells = boardState.cells.map(cell => cell);
    cells[to] = { ...cells[from] };
    cells[from] = {};
    let pseudoCurrent = getOppositePlayer(boardState.currentPlayer);

    return { ...pseudoState, cells, pseudoCurrent }

}

/**
 * A method that takes the current boardState and computes all the moves possible for the dragged piece
 * @returns A boolean response that shows if the dragged piece can move in a specific cell
 */
export const computePieceMoves = (boardState: BoardState, from: number, to: number) => {
    let canMove = true;
    let lastCell = boardState.cells[from];

    switch (lastCell.pieceType) {
        case PieceType.KING:
            canMove = computeKingMoves(boardState, from, to);
            break;
        case PieceType.KNIGHT:
            canMove = computeKnightMoves(from, to);
            break;
        case PieceType.PAWN:
            let negative = lastCell.pieceColor === boardState.bottomPlayer ? 1 : -1;
            canMove = computePawnMoves(negative, boardState.cells, from, to);
            break;
        case PieceType.ROOK:
            canMove = computeRookMoves(boardState.cells, from, to);
            break;
        case PieceType.BISHOP:
            canMove = computeBishopMoves(boardState.cells, from, to);
            break;
        case PieceType.QUEEN:
            canMove = computeQueenMoves(boardState.cells, from, to);
            break;
    }
    return canMove
}
/**
 * Computes legal moves if the piece type is king
 */
export const computeKingMoves = (boardState: BoardState, from: number, to: number) => {
    let [x1, y1] = indexToPosition(from);
    let [x2, y2] = indexToPosition(to);
    let canCastleLeft: boolean = true;
    let canCastleRight: boolean = true;
    let moveToRight: boolean = x1 < x2;
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);

    if (!boardState.cells[from].wasMoved && !boardState.isInCheck) {

        for (let i = 1; i <= dx; i++) {
            if (boardState.cells[moveToRight ? from + i : from - i]?.pieceType !== undefined) {
                moveToRight ? canCastleRight = false : canCastleLeft = false;
                break;
            }
        }
        if (!boardState.cells[from - 4]?.wasMoved && canCastleLeft && to === from - 3)
            return true
        if (!boardState.cells[from + 3]?.wasMoved && canCastleRight && to === from + 2)
            return true
    }

    if (dx < 2 && dy < 2)
        return true

    return false;
}

/**
 * Computes legal moves if the piece type is Knight
 */
export const computeKnightMoves = (from: number, to: number) => {
    let [x, y] = indexToPosition(from);
    let [x2, y2] = indexToPosition(to);

    const dx = Math.abs(x2 - x);
    const dy = Math.abs(y2 - y);

    if ((dx === 2 && dy === 1) || (dx === 1 && dy === 2))
        return true

    return false;
}

/**
 * Computes legal moves if the piece type is Pawn
 */
export const computePawnMoves = (negative: number, cells: Cell[], from: number, to: number) => {
    let [x, y] = indexToPosition(from);
    let [x2, y2] = indexToPosition(to);

    const dx = Math.abs(x2 - x);
    const dy = y2 - y;
    if (dx === 0 && cells[positionToIndex(x2, y2)].pieceType !== undefined)
        return false;

    if (dx === 0 && ((dy === negative) ||
        ((y === 2 || y === 7) && dy === 2 * negative && cells[positionToIndex(x2, y2 - 1 * negative)].pieceType === undefined)) || (dx === 1 && dy === 1 * negative && cells[positionToIndex(x2, y2)].pieceType !== undefined))
        return true

    return false;
}

/**
 * Computes legal moves if the piece type is Rook
 */
export const computeRookMoves = (cells: Cell[], from: number, to: number) => {
    let [x1, y1] = indexToPosition(from);
    let [x2, y2] = indexToPosition(to);

    if (x1 !== x2 && y1 !== y2)
        return false
    return checkPerpendicularObstacles(cells, from, to);
}

/**
 * Computes legal moves if the piece type is Bishop
 */
export const computeBishopMoves = (cells: Cell[], from: number, to: number) => {
    let [x1, y1] = indexToPosition(from);
    let [x2, y2] = indexToPosition(to);
    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);

    if (dx !== dy)
        return false

    return checkDiagonalObstacles(cells, from, to);
}

/**
 * Computes legal moves if the piece type is Queen
 */
export const computeQueenMoves = (cells: Cell[], from: number, to: number) => {
    let [x1, y1] = indexToPosition(from);
    let [x2, y2] = indexToPosition(to);
    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);

    if (dx !== dy && (x1 !== x2 && y1 !== y2))
        return false;

    let check1 = checkDiagonalObstacles(cells, from, to);
    let check2 = checkPerpendicularObstacles(cells, from, to);

    if (check1 !== check2) {
        return false;
    }
    return check1;
}

/**
 * A method that checks all legal squares on the horizontal and vertical axis. If the loop meets an obstacle piece, it will stop
 * It stops the dragging piece to jump over other pieces.
 * @returns A boolean response to show if the cell permits a legal move
 */
export const checkPerpendicularObstacles = (cells: Cell[], from: number, to: number) => {

    let [x1, y1] = indexToPosition(from);
    let [x2, y2] = indexToPosition(to);
    let fromy = y1 < y2 ? y1 : y2;
    let toy = y1 < y2 ? y2 : y1;
    let fromx = x1 < x2 ? x1 : x2;
    let tox = x1 < x2 ? x2 : x1;

    if (x1 === x2) {
        for (let i = fromy + 1; i < toy; i++) {
            if (cells[positionToIndex(x1, i)].pieceType !== undefined) {
                return false
            }
        }
    } else if (y1 === y2) {
        for (let i = fromx + 1; i < tox; i++) {
            if (cells[positionToIndex(i, y1)].pieceType !== undefined) {
                return false
            }
        }
    }

    return true
}

/**
 * A method that checks all legal squares on the diagonal axis. If the loop meets an obstacle piece, it will stop
 * It stops the dragging piece to jump over other pieces.
 * @returns A boolean response to show if the cell permits a legal move
 */
export const checkDiagonalObstacles = (cells: Cell[], from: number, to: number) => {
    let [x1, y1] = indexToPosition(from);
    let [x2, y2] = indexToPosition(to);
    let dx = Math.abs(x2 - x1);

    if (x1 < x2 && y1 < y2) {
        for (let i = 1; i < dx; i++) {
            if (cells[positionToIndex(x1 + i, y1 + i)].pieceType !== undefined) {
                return false
            }
        }
    } else if (x1 > x2 && y1 > y2) {
        for (let i = 1; i < dx; i++) {
            if (cells[positionToIndex(x1 - i, y1 - i)].pieceType !== undefined) {
                return false
            }
        }
    } else if (x1 < x2 && y1 > y2) {
        for (let i = 1; i < dx; i++) {
            if (cells[positionToIndex(x1 + i, y1 - i)].pieceType !== undefined) {
                return false
            }
        }
    } else if (x1 > x2 && y1 < y2) {
        for (let i = 1; i < dx; i++) {
            if (cells[positionToIndex(x1 - i, y1 + i)].pieceType !== undefined) {
                return false
            }
        }
    }
    return true
}

export const handleCheck = () => {
    //Do something when checks are triggered
}

/**
 * A method that computes if the current player is in check
 */
export const isPlayerInCheck = (boardState: BoardState, playerColor: PlayerColors) => {
    let cells = boardState.cells.map(cell => cell);
    let result = false;
    let oppositeColor = getOppositePlayer(playerColor);
    let king = cells.indexOf(cells.filter(cell => cell.pieceColor === playerColor && cell.pieceType === PieceType.KING)[0]);

    let oppositePieces = cells.map((cell, i) => {
        return cell.pieceType !== undefined && cell.pieceColor === oppositeColor ? i : null;
    }).filter(i => i);

    oppositePieces.forEach(piece => {
        if (!result)
            result = computePieceMoves(boardState, piece as any, king);
    })
    return result;
}

export const detectHasLegalMoves = (boardState: BoardState, playerColor: PlayerColors) => {
    let playerCellsIndexes = boardState.cells.map((cell, i) => cell?.pieceColor === playerColor ? i : null).filter(i => i);
    let possibleCellsIndexes = boardState.cells.map((cell, i) => cell?.pieceColor !== playerColor ? i : null).filter(i => i);
    let hasLegalMoves = false;

    //Checks all legal moves for a specific playerColor
    playerCellsIndexes.forEach(cellIndex => {
        if (!hasLegalMoves)
            possibleCellsIndexes.forEach(pCellIndex => {
                if (!hasLegalMoves)
                    //Forcing the turn switch for the legal moves check
                    hasLegalMoves = canMove({ ...boardState, currentPlayer: playerColor }, cellIndex as any, pCellIndex as any)
            });
    });

    return hasLegalMoves
}

export const checkPromote = (pieceType: PieceType | undefined, index: number): boolean => {
    if (pieceType === PieceType.PAWN && (indexToPosition(index)[1] === 1 || indexToPosition(index)[1] === 8))
        return true
    return false
}

export const promotePawn = (cell: Cell) => {
    cell.pieceType = PieceType.QUEEN;
}

export const handleCastle = (boardState: BoardState, from: number, to: number) => {
    const dx = Math.abs(indexToPosition(from)[0] - indexToPosition(to)[0]);
    if (boardState.cells[from].pieceType === PieceType.KING && dx > 1) {
        let castleLeft = from < to ? true : false;
        let rook = boardState.cells[castleLeft ? from + 3 : from - 4];
        boardState.cells[castleLeft ? from + 1 : from - 2] = { ...rook, wasMoved: true };
        boardState.cells[castleLeft ? from + 3 : from - 4] = {};
        boardState.hasCastledOnLastMove = true;
    } else
        boardState.hasCastledOnLastMove = false;
}

export const checkHasMovedLastTurn = (cell: Cell, boardState: BoardState): boolean => {
    return boardState.stateHistory[boardState.stateHistory.length - 1].lastMovedPiece.id === cell.id;
}

export const handleCapturePiece = (boardState: BoardState, capturedPiece: Cell, hasCaptured: boolean) => {
    if (hasCaptured) {
        boardState.capturedPieces.push({ ...capturedPiece })
    }

    boardState.hasCapturedOnLastMove = hasCaptured;
}

export const playSound = (soundType: string) => {
    let sound = new Audio(`./SFX/${soundType}.mp3`)
    sound.play();
}