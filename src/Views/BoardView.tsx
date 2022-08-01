import { useState } from "react";
import { CellView } from "./CellView";
import { Board, createDefaultBoard } from "../Model/Board";
import { PlayerColors } from "../Model/PieceEnums";



export const BoardView = () => {

    const onPieceMove = (boardState: Board) => {
        setBoardState(boardState);
    }
    const [bottomPlayer, setBottomPlayer] = useState<PlayerColors>(PlayerColors.LIGHT);
    const defaultState = createDefaultBoard(bottomPlayer)

    const [boardState, setBoardState] = useState<Board>(defaultState);

    const cells = boardState.cells.map((cell, i) => {
        return <CellView onPieceMove={onPieceMove} key={i} cell={cell} boardState={boardState} />
    })

    return (
        <div id="chess-table">
            {cells}
        </div>
    );
}









