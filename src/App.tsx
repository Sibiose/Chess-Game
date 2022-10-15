import { BoardView } from "./Views/BoardView";
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { useState } from "react";
import { PlayerColors } from "./Model/PieceEnums";
import { ChessGame, createDefaultBoard, useBoard } from "./Model/Board";
import { PlayerDetailsView } from "./Views/PlayerDetailsView";
import { BoardSideView } from "./Views/BoardSideView";
import { RequestUsernameView } from "./Views/RequestUsernameView";
import { useServer } from "./api/Server";
import { PlayerDto, RoomDto, Server } from "./api/Server.dto"
import { LobbyView } from "./Views/LobbyView";
import { ConnectedTab } from "./Views/shared/ConnectedTab";
import { RoomView } from "./Views/RoomView";


function App() {
  const [username, setUsername] = useState<string>('');

  const server: Server = useServer();
  const currentPlayer: PlayerDto | undefined = server.currentPlayer;
  const currentRoom: RoomDto | undefined = currentPlayer?.room;
  
  return (
    <div className="App">
      <ConnectedTab connected={server.connected} />
      {username === "" ? <RequestUsernameView setUsername={setUsername} players={server.players.players} /> : null}
      {username !== "" && currentRoom ? <RoomView currentRoom={currentRoom} /> : null}
      {username !== "" && !currentRoom ? <LobbyView rooms={server.rooms.rooms} players={server.players.players} currentPlayer={currentPlayer} /> : null}
    </div>
  );
}

export default App;
