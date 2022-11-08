import { useState } from "react"
import { onJoinRoom, useServer } from "../../api/Server";
import { PlayerDto, RoomDto } from "../../api/Server.dto";
import { StatusBubble } from "../shared/StatusBubble";
import { RoomCardView } from "./RoomCardView";
import { RoomEditorView } from "./RoomEditorView";

export const LobbyView = (props: { rooms: RoomDto[], players: PlayerDto[], currentPlayer: PlayerDto | undefined }) => {
    let { rooms, players, currentPlayer } = props;
    const [openEditor, setopenEditor] = useState(false);
    const [openPasswordModal, setopenPasswordModal] = useState(false);
    const [roomSelected, setRoomSelected] = useState<RoomDto | null>(null);

    return (
        <div
            style={{
                overflow: openEditor ? 'hidden' : 'auto'
            }}
            id="lobby" >
            <div className="lobby-header-wrapper">
                <h1 className="lobby-title">Welcome to Lobby, <span className="no-word-break">{currentPlayer?.username ?? 'Guest'}</span> </h1>
                <p className="lobby-desc">Join one of the existing rooms, or create a new room. Have fun!</p>
            </div>
            <button onClick={() => { setopenEditor(true) }} className="open-editor-btn">Create a new Room</button>

            {openEditor || openPasswordModal ? <LobbyOverlayView setopenEditor={setopenEditor} setopenPasswordModal={setopenPasswordModal} /> : null}
            {openEditor ? <RoomEditorView setopenEditor={setopenEditor} /> : null}
            {openPasswordModal ? <PasswordModalView room={roomSelected} /> : null}
            <section className="lobby-main-section">
                <main className="room-list">
                    {rooms.map((room, i) => <RoomCardView setopenPasswordModal={setopenPasswordModal} setRoomSelected={setRoomSelected} key={i} room={room} />)}
                </main>
                <aside className="players-wrapper">
                    <h2 className="players-list-title">Online Players</h2>
                    <ul className="players-list">
                        {players.map((player, i) => {
                            if (player.username) {
                                return <li title={player.username} key={i} className="player-list-item">
                                    <StatusBubble hasRoom = {player.room ? true: false} isConnected={player.isConnected ? true:false} />
                                    <span className="text-overflow-ellipsis">{player.username}</span></li>
                            }
                            return null
                        }
                        )}
                    </ul>
                </aside>
            </section>
        </div >
    )
}



export const LobbyOverlayView = (props: { setopenPasswordModal: (openPasswordModal: boolean) => void, setopenEditor: (openEditor: boolean) => void }) => {
    let { setopenEditor, setopenPasswordModal } = props;
    return (
        <div onClick={() => {
            setopenEditor(false);
            setopenPasswordModal(false)
        }} className="lobby-overlay"></div>
    )
}

export const PasswordModalView = (props: { room: RoomDto | null }) => {
    const currentPlayer = useServer()?.currentPlayer;
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    let { room } = props;

    const handlePassword = (password: string, roomPassword?: string, roomId?: string, playerId?: string) => {
        if (roomId && playerId && roomPassword) {
            if (password === roomPassword) {
                onJoinRoom(roomId, playerId);
            } else {
                setError(true);
            }
        }
    }

    return (
        <div className="password-modal">
            <h3 className="password-modal-title">Please enter the room password</h3>
            <input onKeyDown={(e) => {
                if (e.key === "Enter") {
                    handlePassword(password, room?.password, room?.id, currentPlayer?.id)
                }
            }} value={password} className="password-modal-input" type="text" name="" onChange={(e) => { setPassword(e.currentTarget.value ?? "") }} />
            {error ? <p className="wrong-password-error">Incorrect password!</p> : null}
        </div>
    )
}