import { BoardView } from "./Views/BoardView";
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { useState } from "react";
import { PlayerColors } from "./Model/PieceEnums";
import { ChessGame, useBoard } from "./Model/Board";


function App() {

  const [bottomPlayer, setBottomPlayer] = useState<PlayerColors>(PlayerColors.LIGHT);

  const game: ChessGame = useBoard(bottomPlayer)

  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <BoardView game={game} />
      </DndProvider>
    </div>
  );
}

export default App;
