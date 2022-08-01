import { Board } from "../Model/Board";
import { Cell } from "../Model/Cell";
import { PieceView } from "./PieceView";
import { getImgSrc } from "../Model/PieceEnums";
import { useDrop } from "react-dnd";


const movePiece = (boardState: Board, lastCell: Cell, cell: Cell): Board => {

    if (cell.piece?.color === lastCell?.piece?.color)
        return { ...boardState }

    cell.piece = lastCell.piece;
    lastCell.piece = undefined;

    return { ...boardState };
}

export const CellView = (props: { cell: Cell, boardState: Board, onPieceMove: (boardState: Board) => void }) => {


    const [, drop] = useDrop(() => ({
        accept: 'piece',
        drop: (item: { lastCell: Cell }) => {
            let lastCell: Cell = item.lastCell;
            props.onPieceMove(movePiece(props.boardState, lastCell, cell));
        }
    }))

    let cell: Cell = props.cell
    let pieceImg = cell.piece ? <PieceView cell={cell} src={getImgSrc(cell.piece?.color + cell.piece?.type)} /> : null;

    return (
        <div ref={drop} className={(cell.position.x + cell.position.y) % 2 === 0 ? "chess-cell dark-chess-cell" : "chess-cell"}>
            {pieceImg}
        </div>
    )
}





