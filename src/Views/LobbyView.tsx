import { useState } from "react"

export const LobbyView = () => {
    const [openEditor, setopenEditor] = useState(false);
    return (
        <div id="lobby">
            <div className="lobby-header-wrapper">
                <h1 className="lobby-title">Welcome to Lobby</h1>
                <p className="lobby-desc">Join one of the existing rooms, or create a new room. Have fun!</p>
            </div>
            <button className="create-room-btn">Create a new Room</button>
            <RoomEditorView/>
            <div className="room-list">
                <RoomCardView />
                <RoomCardView />
                <RoomCardView />
                <RoomCardView />
                <RoomCardView />
                <RoomCardView />
                <RoomCardView />
                <RoomCardView />
                <RoomCardView />
                <RoomCardView />
                <RoomCardView />
                <RoomCardView />
                <RoomCardView />
                <RoomCardView />
                <RoomCardView />
                <RoomCardView />
                <RoomCardView />
                <RoomCardView />
                <RoomCardView />
                <RoomCardView />
            </div>
        </div>
    )
}

export const RoomCardView = () => {
    return (
        <div className="room-card">
            <h3 className="room-id">Room ID</h3>
            <div className="room-details">
                <p className="room-type">Type: Multiplayer</p>
                <p className="room-players"> Players: 2/2</p>
                <p className="room-password"> Password required</p>
            </div>
            <button className="join-room-btn">Join Room</button>
        </div>)
}

export const RoomEditorView = () => {
    

    return(
        <div className="room-editor">
            <button className="editor-create-room-btn">Create Room</button>
        </div>
    )
}

export const LobbyOverlayView = () => {

}