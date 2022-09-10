import { useState } from "react";


export const BoardSideView = () => {

    const [chatState, setchatState] = useState(false);

    return (
        <div className="board-side-wrapper">
            {chatState ? <ChatView /> : <GameDetailsView />}
            <div className="details-buttons">
                <button className="game-details-btn" onClick={() => setchatState(false)}>Game details</button>
                <button className="chat-btn" onClick={() => setchatState(true)}>Chat</button>
            </div>
        </div>
    )
}

export const GameDetailsView = () => {
    return (
        <div className="game-details">
            <h1>This is the game-details view</h1>
        </div>
    )
}

export const ChatView = () => {
    return (
        <div className="chat-screen">
            <h1>This is the chat view</h1>
        </div>
    )
}