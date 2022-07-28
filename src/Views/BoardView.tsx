import { useState } from "react";
import { CellView } from "./CellView";
import { createDefaultBoard } from "../Model/Board";
import { PlayerColors } from "../Model/PieceEnums";

export const BoardView = () => {
    const [bottomPlayer, setBottomPlayer] = useState<PlayerColors>(PlayerColors.LIGHT);
    const [boardState, setBoardState] = useState(createDefaultBoard(bottomPlayer));

    const cells = boardState.cells.map((cell, i) => {
        return <CellView key={i} cell={cell} boardState={boardState} />
    })

    return (
        <div id="chess-table">
            {cells}
        </div>
    );
}









