import { Dispatch } from "react";
//import { chessTable } from "../ChessTable";
import { Piece } from "../PiecesModules/Piece";
import CellDiv from "./CellDiv";
import { newChessTable } from "../ChessTable";

const Table = (props: {
  boardState: Piece[];
  setBoardState: Dispatch<Piece[]>;
}) => {
  return (
    <div id="chess-table">
      {newChessTable.cellArray.map((cell) => {
        return (
          <CellDiv
            cell={cell}
            key={cell.xy}
            boardState={props.boardState}
            setBoardState={props.setBoardState}
          />
        );
      })}
    </div>
  );
};

export default Table;
