import { ChessGame, getOppositePlayer } from "../Model/Board"

export const PlayerDetailsView = (props: { game: ChessGame, isBottom: boolean }) => {

    const { game, isBottom } = props;
    let playerColor = isBottom ? game.bottomPlayer : getOppositePlayer(game.bottomPlayer);
    let capturedPieces = game.capturedPieces.filter(cell => cell.pieceColor !== playerColor).map(cell => {
        let imgSrc = `../../Pieces/${cell.pieceType}-${cell.pieceColor}.svg`
        return <img className="captured-piece-icon" src={imgSrc} />
    });



    return (
        <div className="player-details">
            <h2 className="player-name">Player</h2>
            <div className="captured-pieces-container">{capturedPieces}</div>
            <h2 className="timer">10:00</h2>
        </div>

    )
}