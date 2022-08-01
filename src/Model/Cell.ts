import { Piece } from "./Piece";

export interface Coordonate {
    x: number;
    y: number;
}

export interface Cell {
    id: number;
    position: Coordonate;
    pieceAssigned: Piece | undefined;
}

export const createDefaultCells = (pieces: Piece[]): Cell[] => {

    let cells: Cell[] = [];
    let id = 1;
    for (let i = 8; i >= 1; i--) {
        for (let j = 1; j <= 8; j++) {
            cells = cells.concat({ id, position: { x: j, y: i }, pieceAssigned: undefined })
            id++;
        }
    }
    cells = cells.map(cell => {
        pieces.forEach(piece => {
            if (getPieceCellMatch(piece, cell))
                cell.pieceAssigned = piece;
        })
        return cell;
    })
    return cells;
}

export const getPieceCellMatch = (piece: Piece, cell: Cell): boolean => {
    if (piece.position.x === cell.position.x && piece.position.y === cell.position.y)
        return true;
    return false;
}
export const getCellMatch = (cell1: Cell, cell2: Cell): boolean => {
    if (cell1.position.x === cell2.position.x && cell1.position.y === cell2.position.y)
        return true
    return false;
}
