import { useState } from "react";
import { ChessGame } from "../Model/Board";

export const BoardSideView = (props: { game: ChessGame }) => {
    const { game } = props
    const handleChat = (newState: boolean) => {
        setchatState(newState);
    }

    const [chatState, setchatState] = useState(false);

    return (
        <div className="board-side-wrapper">
            {chatState ? <ChatView /> : <GameDetailsView game={game} />}
            <div className="details-buttons">
                <button className="game-details-btn" onClick={() => handleChat(false)}>Game details</button>
                <button className="chat-btn" onClick={() => handleChat(true)}>Chat</button>
            </div>
        </div>
    )
}

export const GameDetailsView = (props: { game: ChessGame }) => {
    const { game } = props
    let moves = game.stateHistory.map((boardState, i) => {
        if (boardState.lastMovedPiece.pieceType) {
            let imgSrc = `../../Pieces/${boardState.lastMovedPiece.pieceType}-${boardState.lastMovedPiece.pieceColor}.svg`

            return <MoveItem key={i} id={i} target={boardState.targetCellCode} hasCaptured={boardState.hasCapturedOnLastMove} imgSrc={imgSrc} isInCheck={boardState.isInCheck} hasCastled={boardState.hasCastledOnLastMove} />
        }
    });

    return (
        <ul className="game-details" >
            {moves}
        </ul>
    )
}

export const ChatView = () => {
    return (
        <div className="chat-screen">
            <h1>This is the chat view</h1>
        </div>
    )
}

export const MoveItem = (props: { id: number, target: string, hasCaptured: boolean, imgSrc: string, isInCheck: boolean, hasCastled: boolean }) => {
    let { id, hasCaptured, target, imgSrc, isInCheck, hasCastled } = props;
    let actionSrc = '../../move-arrow.svg';
    if (isInCheck)
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
                <img className={isInCheck ? "action-icon check-icon" : "action-icon"}
                    src={actionSrc} alt='' />
            </div>
            <p className="move-target">{hasCaptured ? 'x' + target : target}</p>

        </li>
    )
}