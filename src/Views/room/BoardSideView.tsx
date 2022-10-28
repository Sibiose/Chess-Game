import { useEffect, useState } from "react";
import { useServer, } from "../../api/Server";
import { ChessGame } from "../../Model/Board";
import { ChatView } from "./ChatView";
import { GameDetailsView } from "./GameDetailsView";


export let displayNone = {
    display: 'none'
}

export const BoardSideView = (props: { game: ChessGame }) => {
    let messages = useServer().currentPlayer?.room?.messages;

    useEffect(() => {
        if (!chatState) {
            setactiveNotification('chat-btn active-notification')
        }
    }, [messages])

    const { game } = props
    const handleChat = (open: boolean) => {
        setchatState(open);
        setactiveNotification('chat-btn');
    }

    const [chatState, setchatState] = useState(false);
    const [activeNotification, setactiveNotification] = useState('chat-btn');

    return (
        <div className="board-side-wrapper">
            <ChatView style={chatState ? {} : displayNone} />
            <GameDetailsView game={game} style={chatState ? displayNone : {}} />

            <div className="details-buttons">
                <button className="game-details-btn" onClick={() => handleChat(false)}>Game details</button>

                <button className={activeNotification} onClick={() => handleChat(true)}>Chat<div className="chat-notification"></div></button>


            </div>


        </div>
    )
}