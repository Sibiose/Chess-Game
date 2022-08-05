import { BoardState } from "./Board";
import { Cell, indexToPosition, positionToIndex } from "./Cell";
import { PieceType, PlayerColors } from "./PieceEnums";

export const move = (boardState: BoardState, from: number, to: number) => {

    boardState.cells[to] = { ...boardState.cells[from] };
    boardState.cells[from] = {};
    console.log(handleCheck(boardState, from, to));
    return { ...boardState }
}

export const computeMoves = (boardState: BoardState, from: number) => {

    return { ...boardState }
}


export const canMove = (boardState: BoardState, from: number, to: number) => {
    let lastCell = boardState.cells[from];
    let cell = boardState.cells[to];
    if (lastCell.pieceColor === cell.pieceColor)
        return false;
    if (lastCell.pieceColor !== boardState.currentPlayer)
        return false;

    return computePieceMoves(boardState, from, to);
}


export const computePieceMoves = (boardState: BoardState, from: number, to: number) => {
    let canMove = true;
    let lastCell = boardState.cells[from];


    switch (lastCell.pieceType) {
        case PieceType.KING:
            canMove = computeKingMoves(from, to);
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
export const computeKingMoves = (from: number, to: number) => {
    let [x, y] = indexToPosition(from);
    let [x2, y2] = indexToPosition(to);

    const dx = Math.abs(x2 - x);
    const dy = Math.abs(y2 - y);

    if (dx < 2 && dy < 2)
        return true

    return false;
}

export const computeKnightMoves = (from: number, to: number) => {
    let [x, y] = indexToPosition(from);
    let [x2, y2] = indexToPosition(to);

    const dx = Math.abs(x2 - x);
    const dy = Math.abs(y2 - y);

    if ((dx === 2 && dy === 1) || (dx === 1 && dy === 2))
        return true

    return false;
}

export const computePawnMoves = (negative: number, cells: Cell[], from: number, to: number) => {
    let [x, y] = indexToPosition(from);
    let [x2, y2] = indexToPosition(to);

    const dx = Math.abs(x2 - x);
    const dy = y2 - y;
    if (dx === 0 && cells[positionToIndex(x2, y2)].pieceType !== undefined)
        return false;

    if (dx === 0 && ((dy === negative) ||
        ((y === 2 || y === 7) && dy === 2 * negative && cells[positionToIndex(x2, y2 - 1 * negative)].pieceType === undefined)))
        return true

    if (dx === 1 && dy === 1 * negative && cells[positionToIndex(x2, y2)].pieceType !== undefined)
        return true

    return false;
}

export const computeRookMoves = (cells: Cell[], from: number, to: number) => {
    let [x1, y1] = indexToPosition(from);
    let [x2, y2] = indexToPosition(to);

    if (x1 !== x2 && y1 !== y2)
        return false
    return checkPerpendicularObstacles(cells, from, to);
}

export const computeBishopMoves = (cells: Cell[], from: number, to: number) => {
    let [x1, y1] = indexToPosition(from);
    let [x2, y2] = indexToPosition(to);
    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);

    if (dx !== dy)
        return false

    return checkDiagonalObstacles(cells, from, to);
}

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

export const handleCheck = (boardState: BoardState, from: number, to: number): [boolean, boolean] => {

    return [isLightInCheck(boardState, from, to), isDarkInCheck(boardState, from, to)];


}

export const isLightInCheck = (boardState: BoardState, from: number, to: number) => {
    let cells = boardState.cells;
    let result = false;
    let lightKing = cells.indexOf(cells.filter(cell => cell.pieceColor === PlayerColors.LIGHT && cell.pieceType === PieceType.KING)[0]);

    let darkPieces = cells.map((cell, i) => {
        return cell.pieceType !== undefined && cell.pieceColor === PlayerColors.DARK ? i : null;
    })

    darkPieces.forEach(piece => {
        if (piece) {
            result = computePieceMoves(boardState, piece, lightKing);
            if (result === true) {
                console.log('Light King Check', boardState.cells[piece]);
                return result;
            }
        }
    })

    return result;
}

export const isDarkInCheck = (boardState: BoardState, from: number, to: number) => {
    let cells = boardState.cells;
    let result = false;
    let darkKing = cells.indexOf(cells.filter(cell => cell.pieceColor === PlayerColors.DARK && cell.pieceType === PieceType.KING)[0]);

    let lightPieces = cells.map((cell, i) => {
        return cell.pieceType !== undefined && cell.pieceColor === PlayerColors.LIGHT ? i : null;
    })

    lightPieces.forEach(piece => {
        if (piece) {
            result = computePieceMoves(boardState, piece, darkKing);
            if (result === true) {
                console.log('Dark king Check', boardState.cells[piece]);
                return result;
            }
        }
    })

    return result;
}