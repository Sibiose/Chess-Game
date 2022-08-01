import { Board } from "../Model/Board";
import { Cell, getPieceCellMatch } from "../Model/Cell";
import { PieceView } from "./PieceView";
import { getImgSrc } from "../Model/PieceEnums";
import { useDrop } from "react-dnd";
import { Piece } from "../Model/Piece";


const movePiece = (boardState: Board, piece: Piece, cell: Cell): Board => {
    let cells: Cell[] = boardState.cells

    if (cell.pieceAssigned?.pieceColor === piece.pieceColor)
        return { ...boardState }

    if (cell.pieceAssigned && cell.pieceAssigned?.pieceColor !== piece.pieceColor) {
        boardState.pieces = boardState.pieces.filter(p => p.id !== cell.pieceAssigned?.id)
        cell.pieceAssigned = undefined;
    }

    let lastCell = cells.find(c => c?.pieceAssigned?.id === piece.id);
    if (lastCell)
        lastCell.pieceAssigned = undefined;

    cells = cells.map(c => {
        if (c.id === cell.id) {
            piece.position = { ...cell.position }
            c.pieceAssigned = piece;
        }
        return c
    })

    return { ...boardState, cells };
}



export const CellView = (props: { cell: Cell, boardState: Board, onPieceMove: (boardState: Board) => void }) => {


    const [, drop] = useDrop(() => ({
        accept: 'piece',
        drop: (item: { piece: Piece }) => {
            let piece: Piece = item.piece;
            props.onPieceMove(movePiece(props.boardState, piece, cell));
        }
    }))

    let cell: Cell = props.cell
    let pieceImg = cell.pieceAssigned ? <PieceView piece={cell.pieceAssigned} src={getImgSrc(cell.pieceAssigned?.pieceColor + cell.pieceAssigned?.pieceType)} /> : null;
    let pieceImg2 = props.boardState.pieces.map(p => {
        if (getPieceCellMatch(p, cell)) {
            return <PieceView key={p.id} piece={p} src={getImgSrc(p.pieceColor + p.pieceType)} />
        }
    })
    return (
        <div ref={drop} className={(cell.position.x + cell.position.y) % 2 === 0 ? "chess-cell dark-chess-cell" : "chess-cell"}>
            {pieceImg2}
        </div>
    )
}





