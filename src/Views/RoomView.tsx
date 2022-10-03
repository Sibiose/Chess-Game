import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { getPlayerById, getRoomById } from "../../server"
import { Player, Server } from "../api/Server.dto"
import { ChessGame } from "../Model/Board"
import { BoardSideView } from "./BoardSideView"
import { BoardView } from "./BoardView"
import { PlayerDetailsView } from "./PlayerDetailsView"

export const RoomView = (props: { game: ChessGame, server: Server, loggedInPlayer: Player | undefined }) => {
    const { game, server, loggedInPlayer } = props;
    let currentRoom = server.rooms.rooms.find(room => room.id === loggedInPlayer?.roomId);
    let bottomPlayer = server.players.players.find(player=> player.id === currentRoom?.joinedPlayers[0] );
    let topPlayer = server.players.players.find(player=> player.id === currentRoom?.joinedPlayers[1] );
    return (
        <>
            <main>
                <PlayerDetailsView game={game} isBottom={false} username={topPlayer ? topPlayer.username : "Waiting for player"} />
                <DndProvider backend={HTML5Backend}>
                    <BoardView game={game} />
                </DndProvider>
                <PlayerDetailsView game={game} isBottom={true} username={bottomPlayer ? bottomPlayer.username : "Waiting for player"} />
            </main>
            <aside>
                <BoardSideView game={game} server={server} />
            </aside>
        </>
    )
}