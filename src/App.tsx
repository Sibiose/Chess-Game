import { useState } from "react";
import { RequestUsernameView } from "./Views/RequestUsernameView";
import { useServer } from "./api/Server";
import { PlayerDto, RoomDto, Server } from "./api/Server.dto"
import { LobbyView } from "./Views/lobby/LobbyView";
import { ConnectedTab } from "./Views/shared/ConnectedTab";
import { RoomView } from "./Views/room/RoomView";
import { CookiesProvider } from "react-cookie";


function App() {

  const server: Server = useServer();
  const currentPlayer: PlayerDto | undefined = server.currentPlayer;
  const currentRoom: RoomDto | undefined = currentPlayer?.room;

  return (
    <CookiesProvider>
      <div className="App">
        <ConnectedTab connected={server.connected} />
        {!currentPlayer?.username ? <RequestUsernameView players={server.players.players} /> : null}
        {currentPlayer?.username && currentRoom ? <RoomView /> : null}
        {currentPlayer?.username && !currentRoom ? <LobbyView rooms={server.rooms.rooms} players={server.players.players} currentPlayer={currentPlayer} /> : null}
      </div>
    </CookiesProvider>
  );
}

export default App;
