import { ChessGame, getOppositePlayer } from "../../Model/Board"

export const PlayerDetailsView = (props: { game: ChessGame, isBottom: boolean, username: string }) => {
    const { game, isBottom, username } = props;
    let playerColor = isBottom ? game.bottomPlayer : getOppositePlayer(game.bottomPlayer);
    let myTurn = game.isPlayerTurn(playerColor);
    let capturedPieces = game.capturedPieces.filter(cell => cell.pieceColor !== playerColor).map((cell, i) => {
        let imgSrc = `../../Pieces/${cell.pieceType}-${cell.pieceColor}.svg`
        return <img key={i} className="captured-piece-icon" src={imgSrc} />
    });



    return (
        <div className={`${myTurn ? 'player-details-activated player-details' : 'player-details'}`}>
            <h2 title={username} className="player-name text-overflow-ellipsis">{username}</h2>
            <div className="captured-pieces-container">{capturedPieces}</div>
        </div>

    )
}