import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { onLeaveRoom, useServer } from "../../api/Server"
import { PlayerDto, RoomDto } from "../../api/Server.dto"
import { BoardState, ChessGame, useBoard } from "../../Model/Board"
import { BoardSideView } from "./BoardSideView"
import { BoardView } from "./BoardView"
import { PlayerDetailsView } from "./PlayerDetailsView"
import "../../styles/board.css";
import "../../styles/board-side.css";

export const RoomView = () => {
    let currentPlayer = useServer().currentPlayer;
    let currentRoom = currentPlayer?.room

    const game: ChessGame = useBoard(currentRoom?.id ?? "", currentRoom?.gameState);
    let myTurn = game.isPlayerTurn(currentPlayer?.pieceColor);
    return (
        <section className="room-section">
            <main className="room-main">
                {game.isInMate || game.isInStaleMate ? <GameResultModal game={game} currentPlayer={currentPlayer} /> : null}
                {game.isInMate || game.isInStaleMate ? <BoardOverlay /> : null}
                <PlayerDetailsView game={game} isBottom={false} username={currentRoom?.topPlayer?.username ? currentRoom.topPlayer.username : "Waiting for player"} />
                <DndProvider backend={HTML5Backend}>
                    <BoardView game={game} />
                </DndProvider>
                <PlayerDetailsView game={game} isBottom={true} username={currentRoom?.bottomPlayer?.username ? currentRoom.bottomPlayer.username : "Waiting for player"} />
            </main>
            <aside className="room-aside">
                <BoardSideView game={game} />
                <div className="my-turn">
                    <h3>{`${myTurn ? 'Your' : 'Opponent'} turn`}</h3>
                </div>
                <button className="leave-room-btn" onClick={() => { onLeaveRoom(currentRoom?.id ?? "", currentPlayer?.id ?? "") }}>Leave Room</button>
            </aside>
        </section>
    )
}

export const GameResultModal = (props: { game: ChessGame, currentPlayer: PlayerDto | undefined }) => {
    const { game, currentPlayer } = props;
    let myTurn = game.isPlayerTurn(currentPlayer?.pieceColor);
    let message: string = "";
    if (game.isInMate) {
        message = myTurn ? "Too bad! You Lost!" : "Congratulations, You Won!";
    }
    if (game.isInStaleMate) {
        message = "Game ended in a stalemate!"
    }
    return (
        <div className="game-result-modal">{message} </div>
    )
}

export const BoardOverlay = () => {
    return (
        <div className="board-overlay"></div>
    )
}