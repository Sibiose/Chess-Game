import { useState } from "react"
import { onCreateNewRoom, onJoinRoom } from "../api/Server";
import { Player, Room } from "../api/Server.dto";
import { InputRadioView, InputTextView } from "./shared/InputGeneral";
import { v4 as uuid } from 'uuid';
import { displayNone } from "./BoardSideView";
import { PlayerColors } from "../Model/PieceEnums";
import { createDefaultBoard } from "../Model/Board";
import { StatusBubble } from "./shared/StatusBubble";

//TODO: Add ONLINE PLAYERS ASIDE

export const LobbyView = (props: { rooms: Room[], players: Player[], loggedInPlayer: Player | undefined }) => {
    let { rooms, players, loggedInPlayer } = props;
    const [openEditor, setopenEditor] = useState(false);
    return (
        <div
            style={{
                overflow: openEditor ? 'hidden' : 'auto'
            }}
            id="lobby" >
            <div className="lobby-header-wrapper">
                <h1 className="lobby-title">Welcome to Lobby</h1>
                <p className="lobby-desc">Join one of the existing rooms, or create a new room. Have fun!</p>
            </div>
            <button onClick={() => { setopenEditor(true) }} className="open-editor-btn">Create a new Room</button>
            {openEditor ? <LobbyOverlayView setopenEditor={setopenEditor} /> : null}
            {openEditor ? <RoomEditorView setopenEditor={setopenEditor} /> : null}
            <section className="lobby-main-section">
                <main className="room-list">
                    {rooms.map((room, i) => <RoomCardView key={i} room={room} />)}
                </main>
                <aside className="players-wrapper">
                    <h2 className="players-list-title">Online Players</h2>
                    <ul className="players-list">
                        {players.map(player => <li className="player-list-item">
                            <StatusBubble status={player.joinedRoom} />
                            {player.username}
                        </li>)}
                    </ul>
                </aside>
            </section>
        </div >
    )
}

export const createRoom = (isLocked: boolean, isMultiplayer: boolean, roomName: string, password: string, bottomPlayer: PlayerColors) => {
    let roomId = uuid();
    if (roomName === "")
        return true
    if (isLocked && password === "")
        return true

    let gameState = createDefaultBoard(bottomPlayer);

    onCreateNewRoom({ id: roomId, name: roomName, isLocked, isMultiplayer, password, joinedPlayers: [], bottomPlayer, gameState, messages: { messages: [] } });
    return false

}

export const RoomEditorView = (props: { setopenEditor: (openEditor: boolean) => void }) => {

    let { setopenEditor } = props;

    const [isLocked, setIsLocked] = useState<boolean>(false);
    const [isMultiplayer, setisMultiplayer] = useState<boolean>(true);
    const [isBottomPlayerDark, setisBottomPlayerDark] = useState<boolean>(false);
    const [roomName, setRoomName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<boolean>(false);

    return (
        <div className="room-editor">
            <h3>Create a new room to play with your friends or against a computer</h3>
            <div className="input-container">
                <InputTextView label="Room Name" setInput={setRoomName} />
                <InputRadioView label="Lock room" value1="Open" value2="Locked" inputState={isLocked} setInputState={setIsLocked} />
                <InputTextView label="Password" disabled={!isLocked} setInput={setPassword} />
                <InputRadioView label="Game type" value1="PvAI" value2="PvP" inputState={isMultiplayer} setInputState={setisMultiplayer} />
                <InputRadioView label="Pick color" value1="Light" value2="Dark" inputState={isBottomPlayerDark} setInputState={setisBottomPlayerDark} />
                <br />
                <p style={error ? {} : displayNone} className="input-error">Please check that all fields are corect!</p>
            </div>
            <button className="create-room-btn" onClick={async () => {
                let isError = await createRoom(isLocked, isMultiplayer, roomName, password, isBottomPlayerDark ? PlayerColors.DARK : PlayerColors.LIGHT);
                setError(isError);
                if (!isError)
                    setopenEditor(false);
            }}>Create Room</button>
        </div>
    )
}

export const LobbyOverlayView = (props: { setopenEditor: (openEditor: boolean) => void }) => {
    let { setopenEditor } = props;
    return (
        <div onClick={() => { setopenEditor(false) }} className="lobby-overlay"></div>
    )
}

export const RoomCardView = (props: { room: Room }) => {

    let { room } = props;
    let joinedDisabled = room.isMultiplayer && room.joinedPlayers.length > 1 || !room.isMultiplayer && room.joinedPlayers.length > 0
    return (
        <div className="room-card">
            <h3 className="room-name">{room.name}</h3>
            <div className="room-details">
                <p className="room-type">{room.isMultiplayer ? 'PvP' : 'PvAi'}</p>
                <p className="room-password">{room.isLocked ? 'Password Required' : 'Open Room'}</p>
            </div>
            <button disabled={joinedDisabled} className={joinedDisabled ? "disabled-btn join-room-btn" : "join-room-btn"} onClick={() => {
                onJoinRoom(room.id);
            }}>Join Room</button>
        </div>)
}