import React, { useState } from "react";
import Table from "./Chess-Table/Table";
import "./index.css";
import { PiecesMain } from "./PiecesModules/PiecesMain";

function App() {
  const [boardState, setBoardState] = useState(PiecesMain.piecesArr);

  return (
    <div className="App">
      <Table boardState={boardState} setBoardState={setBoardState} />
      <button
        onClick={() => {
          setBoardState([...PiecesMain.piecesArr]);
        }}
      >
        Move random piece
      </button>
    </div>
  );
}

export default App;
