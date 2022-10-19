import { ChessGame, getOppositePlayer } from "../Model/Board"

export const PlayerDetailsView = (props: { game: ChessGame, isBottom: boolean, username: string }) => {

    const { game, isBottom, username } = props;
    let playerColor = isBottom ? game.bottomPlayer : getOppositePlayer(game.bottomPlayer);
    let capturedPieces = game.capturedPieces.filter(cell => cell.pieceColor !== playerColor).map((cell, i) => {
        let imgSrc = `../../Pieces/${cell.pieceType}-${cell.pieceColor}.svg`
        return <img key={i} className="captured-piece-icon" src={imgSrc} />
    });



    return (
        <div className="player-details">
            <h2 className="player-name">{username}</h2>
            <div className="captured-pieces-container">{capturedPieces}</div>
            <h2 className="timer">10:00</h2>
        </div>

    )
}