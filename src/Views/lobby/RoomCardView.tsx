import { useServer, onJoinRoom } from "../../api/Server";
import { RoomDto } from "../../api/Server.dto";

export const RoomCardView = (props: { room: RoomDto }) => {
    let currentPlayer = useServer().currentPlayer
    let { room } = props;
    let joinedDisabled = room.isFull;
    return (
        <div className="room-card">
            <h3 title={room.name} className="room-name text-overflow-ellipsis">{room.name}</h3>
            <div className="room-details">
                <p className="room-type">{room.isMultiplayer ? 'PvP' : 'PvAi'}</p>
                <p className="room-password">{room.isLocked ? 'Password Required' : 'Open Room'}</p>
            </div>
            <button disabled={joinedDisabled} className={joinedDisabled ? "disabled-btn join-room-btn" : "join-room-btn"} onClick={() => {
                onJoinRoom(room.id, currentPlayer?.id);
            }}>Join Room</button>
        </div>)
}