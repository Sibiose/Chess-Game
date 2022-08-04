import { useState } from "react";
import { CellView } from "./CellView";
import { useBoard } from "../Model/Board";
import { PlayerColors } from "../Model/PieceEnums";


export const BoardView = () => {

    const [bottomPlayer, setBottomPlayer] = useState<PlayerColors>(PlayerColors.LIGHT);

    const game = useBoard(bottomPlayer)

    const cells = game.cells.map((_, i) => {
        return <CellView game={game} key={i} index={i} />
    })

    return (
        <div id="chess-table">
            {cells}
        </div>
    );
}









