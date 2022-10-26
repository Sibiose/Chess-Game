import { useState } from "react";
import { useServer, } from "../../api/Server";
import { ChessGame } from "../../Model/Board";
import { ChatView } from "./ChatView";
import { GameDetailsView } from "./GameDetailsView";


export let displayNone = {
    display: 'none'
}

export const BoardSideView = (props: { game: ChessGame }) => {
    const { game } = props
    let currentPlayer = useServer().currentPlayer
    const handleChat = (newState: boolean) => {
        setchatState(newState);
    }
    let myTurn = game.isPlayerTurn(currentPlayer?.pieceColor);
    const [chatState, setchatState] = useState(false);

    return (
        <div className="board-side-wrapper">
            <ChatView style={chatState ? {} : displayNone} />
            <GameDetailsView game={game} style={chatState ? displayNone : {}} />

            <div className="details-buttons">
                <button className="game-details-btn" onClick={() => handleChat(false)}>Game details</button>
                <button className="chat-btn" onClick={() => handleChat(true)}>Chat</button>
            </div>
            <div className="my-turn">
                <p>{`${myTurn ? 'Your' : 'Opponent'} turn`}</p>
            </div>

        </div>
    )
}