import { BoardView } from "./Views/BoardView";
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { useState } from "react";
import { PlayerColors } from "./Model/PieceEnums";
import { ChessGame, useBoard } from "./Model/Board";
import { PlayerDetailsView } from "./Views/PlayerDetailsView";


function App() {

  const [bottomPlayer, setBottomPlayer] = useState<PlayerColors>(PlayerColors.LIGHT);

  const game: ChessGame = useBoard(bottomPlayer)

  return (
    <div className="App">
      <PlayerDetailsView game={game} isBottom={false} />
      <DndProvider backend={HTML5Backend}>
        <BoardView game={game} />
      </DndProvider>
      <PlayerDetailsView game={game} isBottom={true} />
    </div>
  );
}

export default App;
