import { PieceType, PlayerColors } from "./PieceEnums";


export interface Cell {
    pieceColor?: PlayerColors
    pieceType?: PieceType | undefined
}

// Empty cell constant
export const emptyCell: Cell = {};

/**
 * A method that gives the x and y coordonates for a cell index
 */
export const indexToPosition = (index: number): [number, number] => {
    let x: number = index % 8 + 1;
    let y: number = Math.abs(Math.floor(index / 8) - 8);

    return [x, y]
}
/**
 * A method that gives the cell index of a pair of x and y coordonates
 */
export const positionToIndex = (x: number, y: number): number => {
    return Math.abs(y * -1 + 8) * 8 + x - 1;
}

