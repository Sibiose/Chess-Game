import { Board } from "./Board";
import { Piece, PieceView } from "./Piece";
import { createImgSrcMap } from "./PieceEnums";

export interface Coordonate {
    x: number;
    y: number;
}

export interface Cell {
    position: Coordonate;
    isFree: boolean;
    pieceAssigned: Piece[];
}

export const CellView = (props: { cell: Cell, boardState: Board }) => {
    let cell: Cell = props.cell
    let boardState: Board = props.boardState;
    let imgSrcMap = createImgSrcMap();

    let pieceImg = boardState.pieces.map((piece, i) => {
        if (piece.position.x === cell.position.x && piece.position.y === cell.position.y) {
            return <PieceView key={i} src={imgSrcMap.get(piece.pieceColor + piece.pieceType) ?? ""} />
        }
        return
    })
    return (
        <div className={(cell.position.x + cell.position.y) % 2 === 0 ? "chess-cell dark-chess-cell" : "chess-cell"}>
            {pieceImg}
        </div>
    )
}

export const createDefaultCells = (pieces: Piece[]): Cell[] => {

    let cells: Cell[] = [];

    for (let i = 8; i >= 1; i--) {
        for (let j = 1; j <= 8; j++) {
            cells.push({ position: { x: j, y: i }, isFree: true, pieceAssigned: [] })
        }
    }
    cells = cells.map(cell => {
        pieces.forEach(piece => {
            if (cell.position.x === piece.position.x && cell.position.y === piece.position.y) {
                cell.pieceAssigned.push(piece);
                cell.isFree = false;
            }
        })
        return cell;
    })

    return cells;
}




