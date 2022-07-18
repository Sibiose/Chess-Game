import { Dispatch } from "react";
import { Cell } from "../Cell";
import { Piece } from "../PiecesModules/Piece";
import { PiecesMain } from "../PiecesModules/PiecesMain";
import PieceImg from "./PieceImg";

interface Props {
  key: string;
  boardState: Piece[];
  setBoardState: Dispatch<Piece[]>;
  cell: Cell;
}

const CellDiv = (props: Props) => {
  const cell = props.cell;
  return (
    <div
      onClick={() => {
        if (PiecesMain.selectedPiece.length > 0) {
          PiecesMain.selectedCell[0].occupyingPiece = [];
          PiecesMain.selectedPiece[0].move(cell.xy);
          cell.occupyingPiece[0] = PiecesMain.selectedPiece[0];
          PiecesMain.deSelectPiece();
          props.setBoardState([...props.boardState]);
        } else {
          PiecesMain.selectPiece(cell.occupyingPiece[0], cell);
        }
      }}
      className={
        cell.xySum % 2 === 0 ? "chess-cell dark-chess-cell" : "chess-cell"
      }
    >
      {props.boardState.map((piece) => {
        if (piece.position === cell.xy) {
          return (
            <PieceImg
              tileId={piece.pieceId}
              key={piece.pieceId}
              src={piece.imgSrc}
            />
          );
        }
        return this;
      })}
    </div>
  );
};

export default CellDiv;
