import { Dispatch } from "react";
import { Piece } from "../PiecesModules/Piece";
import PieceImg from "./PieceImg";

interface Props {
  xySum: number;
  key: string;
  xy: string;
  boardState: Piece[];
  setBoardState: Dispatch<Piece[]>;
}

const CellDiv = (props: Props) => {
  return (
    <div
      className={
        props.xySum % 2 === 0 ? "chess-cell dark-chess-cell" : "chess-cell"
      }
    >
      {props.boardState.map((piece) => {
        if (piece.position === props.xy) {
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
