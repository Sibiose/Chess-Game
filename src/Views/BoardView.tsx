import { CellView } from "./CellView";
import { ChessGame} from "../Model/Board";

export const BoardView = (props: { game: ChessGame }) => {

    const { game } = props

    const cells = game.cells.map((_, i) => {
        return <CellView game={game} key={i} index={i} />
    })

    return (
        <div id="chess-table">
            {cells}
        </div>
    );
}









