import { useState } from "react";
import { useServer, onCreateNewRoom } from "../../api/Server";
import { PlayerColors } from "../../Model/PieceEnums";
import { displayNone } from "../room/BoardSideView";
import { InputTextView, InputRadioView } from "../shared/InputGeneral";

export const RoomEditorView = (props: { setopenEditor: (openEditor: boolean) => void }) => {
    let currentPlayer = useServer().currentPlayer;
    let { setopenEditor } = props;

    const [isLocked, setIsLocked] = useState<boolean>(false);
    const [isMultiplayer, setisMultiplayer] = useState<boolean>(true);
    const [isBottomPlayerDark, setisBottomPlayerDark] = useState<boolean>(false);
    const [roomName, setRoomName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<boolean>(false);

    return (
        <div className="room-editor">
            <h3 className="room-editor-title">Create a new room to play with your friends or against a computer</h3>
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
                let isError = createRoom(isLocked, isMultiplayer, roomName, isBottomPlayerDark ? PlayerColors.DARK : PlayerColors.LIGHT, isLocked ? password : undefined, currentPlayer?.id);
                setError(isError);
                if (!isError)
                    setopenEditor(false);
            }}>Create Room</button>
        </div >
    )
}

export const createRoom = (isLocked: boolean, isMultiplayer: boolean, roomName: string, bottomPlayerColor: PlayerColors, password?: string, playerId?: string,) => {
    if (roomName === "")
        return true
    if (isLocked && password === "")
        return true
    if (playerId) {
        onCreateNewRoom(playerId, { name: roomName, isLocked, isMultiplayer, password, bottomPlayerColor });
    }
    return false

}