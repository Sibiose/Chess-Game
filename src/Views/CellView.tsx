import { Board } from "../Model/Board";
import { Cell } from "../Model/Cell";
import { PieceView } from "./PieceView";
import { createImgSrcMap } from "../Model/PieceEnums";

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





