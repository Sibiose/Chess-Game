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
import { useState } from "react"

export const RoomView = () => {
    let currentPlayer = useServer().currentPlayer;
    let currentRoom = currentPlayer?.room;
    const [openModal, setOpenModal] = useState<boolean>(false);
    //TODO: Add leave room if click on yes,
    const handleLeaveRoom = (gameHasStarted: boolean, gameHasEnded: boolean, roomId?: string, playerId?: string) => {
        if (roomId && playerId) {
            console.log(gameHasStarted);
            if (!gameHasStarted || gameHasEnded) {
                onLeaveRoom(roomId, playerId)
            }
            else {
                setOpenModal(true);
            }
        }
    }

    const game: ChessGame = useBoard(currentRoom?.id ?? "", currentRoom?.gameState);
    let myTurn = game.isPlayerTurn(currentPlayer?.pieceColor);
    let usernamePlaceholder: string = !currentRoom?.isMultiplayer ? "Computer" : currentRoom.gameHasStarted ? "Player left the game" : "Waiting for player";
    return (
        <section className="room-section">
            {openModal ? <RoomOverlay setOpenModal={setOpenModal} /> : null}
            <main className="room-main">
                {game.isInMate || game.isInStaleMate || currentRoom?.gameHasEnded ? <GameResultModal game={game} currentPlayer={currentPlayer} /> : null}
                {game.isInMate || game.isInStaleMate || currentRoom?.gameHasEnded ? < BoardOverlay /> : null}
                {openModal ? <LeaveRoomModal setOpenModal={setOpenModal} /> : null}
                <PlayerDetailsView game={game} isBottom={false} username={currentRoom?.topPlayer?.username ? currentRoom.topPlayer.username : usernamePlaceholder} />
                <DndProvider backend={HTML5Backend}>
                    <BoardView game={game} />
                </DndProvider>
                <PlayerDetailsView game={game} isBottom={true} username={currentRoom?.bottomPlayer?.username ? currentRoom.bottomPlayer.username : usernamePlaceholder} />
            </main>
            <aside className="room-aside">
                <BoardSideView game={game} />
                <div className="my-turn">
                    <h3>{`${myTurn ? 'Your' : 'Opponent'} turn`}</h3>
                </div>
                <button className="leave-room-btn" onClick={() => { handleLeaveRoom(currentRoom?.gameHasStarted ? true : false, currentRoom?.gameHasEnded ? true : false, currentRoom?.id, currentPlayer?.id) }}>Leave Room</button>
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
    if (currentPlayer?.room?.gameHasEnded && !game.isInStaleMate && !game.isInMate) {
        message = 'You win. Opponent abandoned the game!'
    }
    return (
        <div className="game-result-modal">{message} </div>
    )
}

export const LeaveRoomModal = (props: { setOpenModal: (openModal: boolean) => void }) => {
    const { setOpenModal } = props;
    let currentPlayer = useServer().currentPlayer;
    let currentRoom = useServer().currentPlayer?.room;
    return (
        <div className="leave-room-modal">
            <h3>Are you sure you want to leave the room and abandon the game?</h3>
            <div className="leave-room-button-container">
                <button onClick={() => {
                    onLeaveRoom(currentRoom?.id ?? "", currentPlayer?.id)
                }}>Yes</button>
                <button onClick={() => {
                    setOpenModal(false);
                }}>No</button>
            </div>
        </div>
    )
}

export const BoardOverlay = () => {
    return (
        <div className="board-overlay"></div>
    )
}

export const RoomOverlay = (props: { setOpenModal: (openModal: boolean) => void }) => {
    return (
        <div onClick={() => {
            props.setOpenModal(false);
        }} className="room-overlay"></div>
    )
}