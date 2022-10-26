import { ChessGame } from "../../Model/Board";

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

export const MoveItem = (props: MoveItemProps) => {
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