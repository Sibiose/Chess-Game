import { Dispatch } from "react";
import { chessTable } from "../ChessTable";
import { Piece } from "../PiecesModules/Piece";
import CellDiv from "./CellDiv";

const Table = (props: {
  boardState: Piece[];
  setBoardState: Dispatch<Piece[]>;
}) => {
  return (
    <div id="chess-table">
      {chessTable.cellArr.map((cell) => {
        return (
          <CellDiv
            xy={cell.xy}
            key={cell.xy}
            xySum={cell.xySum}
            boardState={props.boardState}
            setBoardState={props.setBoardState}
          />
        );
      })}
    </div>
  );
};

export default Table;
