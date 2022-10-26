import { useState } from "react"
import { PlayerDto, RoomDto } from "../../api/Server.dto";
import { StatusBubble } from "../shared/StatusBubble";
import { RoomCardView } from "./RoomCardView";
import { RoomEditorView } from "./RoomEditorView";

export const LobbyView = (props: { rooms: RoomDto[], players: PlayerDto[], currentPlayer: PlayerDto | undefined }) => {
    let { rooms, players, currentPlayer } = props;
    const [openEditor, setopenEditor] = useState(false);
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

            {openEditor ? <LobbyOverlayView setopenEditor={setopenEditor} /> : null}
            {openEditor ? <RoomEditorView setopenEditor={setopenEditor} /> : null}

            <section className="lobby-main-section">
                <main className="room-list">
                    {rooms.map((room, i) => <RoomCardView key={i} room={room} />)}
                </main>
                <aside className="players-wrapper">
                    <h2 className="players-list-title">Online Players</h2>
                    <ul className="players-list">
                        {players.map((player, i) => {
                            if (player.username) {
                                return <li key={i} className="player-list-item">
                                    <StatusBubble status={player.room ? true : false} />
                                    {player.username}</li>
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



export const LobbyOverlayView = (props: { setopenEditor: (openEditor: boolean) => void }) => {
    let { setopenEditor } = props;
    return (
        <div onClick={() => { setopenEditor(false) }} className="lobby-overlay"></div>
    )
}

