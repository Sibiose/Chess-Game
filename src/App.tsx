import { BoardView } from "./Views/BoardView";
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { useState } from "react";
import { PlayerColors } from "./Model/PieceEnums";
import { ChessGame, useBoard } from "./Model/Board";
import { PlayerDetailsView } from "./Views/PlayerDetailsView";
import { BoardSideView } from "./Views/BoardSideView";
import { RequestUsernameView } from "./Views/RequestUsernameView";
import { useServer } from "./api/Server";
import { Server } from "./api/Server.dto"
import { LobbyView } from "./Views/LobbyView";


function App() {
  const [username, setUsername] = useState<string>('');
  const [bottomPlayer, setBottomPlayer] = useState<PlayerColors>(PlayerColors.LIGHT);

  const game: ChessGame = useBoard(bottomPlayer);

  const server: Server = useServer();
  
  const status = server.connected ? <div style={{ color: 'green' }}>CONNECTED</div> : <div style={{ color: 'red' }}>NOT CONNECTED</div>

  return (
    <div className="App">
      {/* {status} */}
      {username === "" ? <RequestUsernameView setUsername={setUsername} /> : null
        // <><main>
        //   <PlayerDetailsView game={game} isBottom={false} />
        //   <DndProvider backend={HTML5Backend}>
        //     <BoardView game={game} />
        //   </DndProvider>
        //   <PlayerDetailsView game={game} isBottom={true} />
        // </main>
        //   <aside>
        //     <BoardSideView game={game} server={server} />
        //   </aside>
        // </>
      }
      {username !== "" ? <LobbyView rooms={server.rooms.rooms} /> : null}
    </div>
  );
}

export default App;
