import { BoardView } from "./Views/BoardView";
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { useState } from "react";
import { PlayerColors } from "./Model/PieceEnums";
import { ChessGame, useBoard } from "./Model/Board";
import { PlayerDetailsView } from "./Views/PlayerDetailsView";
import { BoardSideView } from "./Views/BoardSideView";
import { RequestUsernameView } from "./Views/RequestUsernameView";


function App() {
  const [username, setUsername] = useState<string>('');
  const [bottomPlayer, setBottomPlayer] = useState<PlayerColors>(PlayerColors.LIGHT);
  
  const game: ChessGame = useBoard(bottomPlayer)

  return (
    <div className="App">
      {username === "" ? <RequestUsernameView setUsername={setUsername} /> :
        <><main>
          <PlayerDetailsView game={game} isBottom={false} />
          <DndProvider backend={HTML5Backend}>
            <BoardView game={game} />
          </DndProvider>
          <PlayerDetailsView game={game} isBottom={true} />
        </main>
          <aside>
            <BoardSideView game={game} />
          </aside>
        </>
      }
    </div>
  );
}

export default App;
