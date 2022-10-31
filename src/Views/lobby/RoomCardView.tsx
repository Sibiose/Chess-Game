import { useServer, onJoinRoom } from "../../api/Server";
import { RoomDto } from "../../api/Server.dto";

export const RoomCardView = (props: { room: RoomDto, setRoomSelected: (roomSelected: RoomDto | null) => void, setopenPasswordModal: (openPasswordModal: boolean) => void }) => {
    let currentPlayer = useServer().currentPlayer
    let { room, setopenPasswordModal, setRoomSelected } = props;
    let joinedDisabled = room.isFull;

    return (
        <div className="room-card">
            <h3 title={room.name} className="room-name text-overflow-ellipsis">{room.name}</h3>
            <div className="room-details">
                <p className="room-type">{room.isMultiplayer ? 'PvP' : 'PvAi'}</p>
                <p className="room-password">{room.isLocked ? 'Password Required' : 'Open Room'}</p>
            </div>
            <button disabled={joinedDisabled} className={joinedDisabled ? "disabled-btn join-room-btn" : "join-room-btn"} onClick={() => {
                if (room.password) {
                    setRoomSelected(room);
                    setopenPasswordModal(true)
                } else {
                    onJoinRoom(room.id, currentPlayer?.id);
                }
            }}>Join Room</button>
        </div>)
}

