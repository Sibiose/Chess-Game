import { PiecesMain } from "../PiecesModules/PiecesMain";
import { Piece } from "../PiecesModules/Piece";

interface Props {
  src: string;
  key: number;
  tileId: number;
}

const PieceImg = (props: Props) => {
  return <img className="piece-img" src={props.src} alt="" />;
};

export default PieceImg;
