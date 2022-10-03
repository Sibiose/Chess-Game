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
import { Player, Server } from "./api/Server.dto"
import { LobbyView } from "./Views/LobbyView";
import { ConnectedTab } from "./Views/shared/ConnectedTab";
import { RoomView } from "./Views/RoomView";


function App() {
  const [username, setUsername] = useState<string>('');
  const [bottomPlayer, setBottomPlayer] = useState<PlayerColors>(PlayerColors.LIGHT);

  const game: ChessGame = useBoard(bottomPlayer);
  const server: Server = useServer();
  const loggedInPlayer: Player | undefined = server.players.players.find(player => player.username === username);
  const joinedRoom = loggedInPlayer?.joinedRoom ? true : false;

  return (
    <div className="App">
      <ConnectedTab connected={server.connected} />
      {username === "" ? <RequestUsernameView setUsername={setUsername} players={server.players.players} /> : null}
      {username !== "" && joinedRoom ? <RoomView game={game} server={server} loggedInPlayer={loggedInPlayer} /> : null}
      {username !== "" && !joinedRoom ? <LobbyView rooms={server.rooms.rooms} players={server.players.players} loggedInPlayer={loggedInPlayer} /> : null}
    </div>
  );
}

export default App;
