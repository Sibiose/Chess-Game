import { useState } from "react"
import { onCreateNewRoom } from "../api/Server";
import { Room } from "../api/Server.dto";
import { InputRadioView, InputTextView } from "./shared/InputGeneral";
import { v4 as uuid } from 'uuid';
import { displayNone } from "./BoardSideView";

//TODO: Add ONLINE PLAYERS ASIDE

export const LobbyView = (props: { rooms: Room[] }) => {
    let { rooms } = props;
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
            <div className="room-list">
                {rooms.map((room, i) => <RoomCardView room={room} />)}
            </div>
        </div >
    )
}

export const createRoom = (isLocked: boolean, isMultiplayer: boolean, roomName: string, password: string) => {
    let roomId = uuid();
    if (roomName === "")
        return true
    if (isLocked && password === "")
        return true

    onCreateNewRoom({ id: roomId, name: roomName, isLocked, isMultiplayer, password, gameState: {}, messages: { messages: [] } })
    return false

}

export const RoomEditorView = (props: { setopenEditor: (openEditor: boolean) => void }) => {

    let { setopenEditor } = props;

    const [isLocked, setIsLocked] = useState<boolean>(false);
    const [isMultiplayer, setisMultiplayer] = useState<boolean>(true);
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
                <br />
                <p style={error ? {} : displayNone} className="input-error">Please check that all fields are corect!</p>
            </div>
            <button className="create-room-btn" onClick={() => {
                let isError = createRoom(isLocked, isMultiplayer, roomName, password);
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
    return (
        <div className="room-card">
            <h3 className="room-name">{room.name}</h3>
            <div className="room-details">
                <p className="room-type">{room.isMultiplayer ? 'PvP' : 'PvAi'}</p>
                <p className="room-password">{room.isLocked ? 'Password Required' : 'Open Room'}</p>
            </div>
            <button className="join-room-btn">Join Room</button>
        </div>)
}