import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { RoomDto} from "../api/Server.dto"
import { ChessGame, useBoard } from "../Model/Board"
import { BoardSideView } from "./BoardSideView"
import { BoardView } from "./BoardView"
import { PlayerDetailsView } from "./PlayerDetailsView"

export const RoomView = (props: { currentRoom: RoomDto | undefined }) => {
    const { currentRoom } = props;
    const game: ChessGame = useBoard(currentRoom?.id ?? "", currentRoom?.gameState);
    return (
        <>
            <main>
                <PlayerDetailsView game={game} isBottom={false} username={currentRoom?.topPlayer?.username ? currentRoom.topPlayer.username : "Waiting for player"} />
                <DndProvider backend={HTML5Backend}>
                    <BoardView game={game} />
                </DndProvider>
                <PlayerDetailsView game={game} isBottom={true} username={currentRoom?.bottomPlayer?.username ? currentRoom.bottomPlayer.username : "Waiting for player"} />
            </main>
            <aside>
                <BoardSideView game={game} />
            </aside>
        </>
    )
}