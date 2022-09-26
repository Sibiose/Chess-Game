import { useState } from "react";
import { ChessGame } from "../Model/Board";
import { socket } from "../Server_API/ChessServer"

let hidden = {
    display: 'none'
}

export const BoardSideView = (props: { game: ChessGame }) => {
    const { game } = props
    const handleChat = (newState: boolean) => {
        setchatState(newState);
    }

    const [chatState, setchatState] = useState(false);

    return (
        <div className="board-side-wrapper">
            <ChatView style={chatState ? {} : hidden} />
            <GameDetailsView game={game} style={chatState ? hidden : {}} />
            <div className="details-buttons">
                <button className="game-details-btn" onClick={() => handleChat(false)}>Game details</button>
                <button className="chat-btn" onClick={() => handleChat(true)}>Chat</button>
            </div>
        </div>
    )
}

export const GameDetailsView = (props: { style: {}, game: ChessGame }) => {
    const { game } = props
    let moves = game.stateHistory.map((boardState, i) => {
        if (boardState.lastMovedPiece.pieceType) {
            let imgSrc = `../../Pieces/${boardState.lastMovedPiece.pieceType}-${boardState.lastMovedPiece.pieceColor}.svg`

            return <MoveItem key={i} id={i} target={boardState.targetCellCode} hasCaptured={boardState.hasCapturedOnLastMove} imgSrc={imgSrc} isInCheck={boardState.isInCheck} hasCastled={boardState.hasCastledOnLastMove} isInMate={boardState.isInMate} isInStaleMate={boardState.isInStaleMate} />
        }
    });

    return (
        <ul className="game-details" style={props.style} >
            {moves}
        </ul>
    )
}

export const ChatView = (props: { style: {} }) => {

    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<string[]>([]);

    const sendMessage = (message: string) => {
        if (message !== "") {
            socket.emit('sendMessage', message);
            setMessages([...messages, message])
        }
    }

    socket.on("receivedMessage", (message) => {
        setMessages([...messages, message]);
    });

    return (
        <div className="chat-screen" style={props.style}>
            <ul className="messages-list">{messages.map((message, i) => <li className="message-item" key={i}>{message}</li>)}</ul>

            <div className='chat-input-wrapper'>

                <input type="text" onChange={(e) => { setMessage(e.target.value ?? "") }} />
                <button onClick={() => sendMessage(message)}>Send</button>
            </div>
        </div>
    )
}

export interface MoveItemProps {
    id: number;
    imgSrc: string;
    target: string;
    hasCaptured: boolean;
    isInCheck: boolean;
    hasCastled: boolean;
    isInMate: boolean;
    isInStaleMate: boolean;
}


export const MoveItem = (props: { id: number, target: string, hasCaptured: boolean, imgSrc: string, isInCheck: boolean, hasCastled: boolean, isInMate: boolean, isInStaleMate: boolean }) => {
    let { id, hasCaptured, target, imgSrc, isInCheck, hasCastled, isInMate, isInStaleMate } = props;
    let actionSrc = '../../move-arrow.svg';
    if (isInStaleMate)
        //TODO: Add stale-mate sound and img
        actionSrc = '../../move-stalemate.svg'
    else if (isInCheck)
        actionSrc = '../../move-check.svg';
    else if (hasCaptured)
        actionSrc = '../../move-attack.svg';
    else if (hasCastled)
        actionSrc = '../../move-castle.svg';

    return (
        <li className="move-item">
            <h3 className="move-id">{id}</h3>
            <div className="move-details">
                <img className="move-piece-icon" src={imgSrc} alt='' />
                <img className={isInMate ? "checkmate-icon action-icon" : isInCheck ? "check-icon action-icon" : "action-icon"}
                    src={actionSrc} alt='' />
            </div>
            <p className="move-target">{hasCaptured ? 'x' + target : target}</p>

        </li>
    )
}