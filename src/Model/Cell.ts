import { PieceType, PlayerColors } from "./PieceEnums";

export interface Cell {
    pieceColor?: PlayerColors
    pieceType?: PieceType | undefined
}

export const emptyCell: Cell = {};

export const indexToPosition = (index: number): [number, number] => {
    let x: number = index % 8 + 1;
    let y: number = Math.abs(Math.floor(index / 8) - 8);

    return [x, y]
}

export const positionToIndex = (x:number, y:number):number =>{

    return (y-1) * 8 + x; 
}

