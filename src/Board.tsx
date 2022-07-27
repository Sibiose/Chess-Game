import { useState } from "react";
import { Cell, CellView, createDefaultCells } from "./Cell";
import { Piece, createDefaultPieces } from "./Piece";
import { PlayerColors } from "./PieceEnums";

export interface Board {
    cells: Cell[];
    pieces: Piece[];
}

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

export const createDefaultBoard = (bottomPlayer: PlayerColors): Board => {
    let pieces = createDefaultPieces(bottomPlayer);
    let cells = createDefaultCells(pieces);

    return { pieces, cells };
}







