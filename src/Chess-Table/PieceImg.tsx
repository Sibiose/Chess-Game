import { PiecesMain } from "../PiecesModules/PiecesMain";
import { Piece } from "../PiecesModules/Piece";

interface Props {
  src: string;
  key: number;
  tileId: number;
}

const PieceImg = (props: Props) => {
  return (
    <img
      onClick={() => {
        let selectedPiece: Piece = PiecesMain.piecesArr.filter(
          (p) => p.pieceId === props.tileId
        )[0];
        console.log(selectedPiece);
        selectedPiece.move("F3");
        console.log(props.tileId);
        // console.log(count);
      }}
      className="piece-img"
      src={props.src}
      alt=""
    />
  );
};

export default PieceImg;
