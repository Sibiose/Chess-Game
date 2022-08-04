import { BoardState } from "./Board";
import { Cell, indexToPosition } from "./Cell";
import { PieceType } from "./PieceEnums";

export const move = (boardState: BoardState, from: number, to: number) => {

    boardState.cells[to] = { ...boardState.cells[from] };
    boardState.cells[from] = {};

    return { ...boardState }
}

export const computeMoves = (boardState: BoardState, from: number) => {

    return { ...boardState, legalMoves: [10, 15, 20] }
}


export const canMove = (boardState: BoardState, from: number, to: number) => {
    let canMove = true;
    let lastCell = boardState.cells[from];
    let cell = boardState.cells[to];
    if (lastCell.pieceColor === cell.pieceColor)
        return false;

    switch (lastCell.pieceType) {
        case PieceType.KING:
            canMove = computeKingMoves(from, to);
            break;
        case PieceType.KNIGHT:
            canMove = computeKnightMoves(from, to);
            break;
        case PieceType.PAWN:
            let negative = lastCell.pieceColor === boardState.bottomPlayer ? 1 : -1;
            canMove = computePawnMoves(negative, from, to);
            break;
        case PieceType.ROOK:
            canMove = computeRookMoves(boardState.cells, from, to);
            break;

    }

    return canMove;

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

export const computePawnMoves = (negative: number, from: number, to: number) => {
    let [x, y] = indexToPosition(from);
    let [x2, y2] = indexToPosition(to);

    const dx = Math.abs(x2 - x);
    const dy = y2 - y;

    if (dx === 0 && ((dy === negative) ||
        ((y === 2 || y === 7) && dy === 2 * negative)))
        return true

    return false;
}

export const computeRookMoves = (cells: Cell[], from: number, to: number) => {
    let [x, y] = indexToPosition(from);
    let [x2, y2] = indexToPosition(to);
    const dx = Math.abs(x2 - x);
    const dy = Math.abs(y2 - y);


    //     let obstacles = cells.filter((cell, i) => {
    //         let [cellx, celly] = indexToPosition(i)
    //         if (cell.pieceType && cellx === x || celly === y)
    //             return cell
    //     }).map((_, i) => indexToPosition(i));

    // console.log(obstacles)


    //     let xObstacles = obstacles.filter(obs => obs[1] === y).map(obs => obs[0]);
    //     let yObstacles = obstacles.filter(obs => obs[0] === x).map(obs => obs[1]);

    //     let yMax = Math.max(...yObstacles);
    //     let yMin = Math.min(...yObstacles);
    //     let xMax = Math.max(...xObstacles);
    //     let xMin = Math.min(...xObstacles);
    //     // console.log(xObstacles);
    //     // console.log(yObstacles)
    //     // console.log(yMax, yMin, xMax, xMin)

    //     if (dy === 0 && (x2 <= xMax || x2 >= xMin) || dx === 0 && (y2 <= yMax || y2 >= yMin))
    //         return true

    return false
}