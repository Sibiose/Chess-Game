import { Piece } from "./Piece";

export interface Coordonate {
    x: number;
    y: number;
}

export interface Cell {
    position: Coordonate;
    pieceAssigned: Piece | undefined;
}

export const createDefaultCells = (pieces: Piece[]): Cell[] => {

    let cells: Cell[] = [];

    for (let i = 8; i >= 1; i--) {
        for (let j = 1; j <= 8; j++) {
            cells = cells.concat({ position: { x: j, y: i }, pieceAssigned: undefined })
        }
    }
    cells = cells.map(cell => {
        pieces.forEach(piece => {
            if (cell.position.x === piece.position.x && cell.position.y === piece.position.y) {
                cell.pieceAssigned = piece;
            }
        })
        return cell;
    })
    console.log(cells);
    return cells;
}
