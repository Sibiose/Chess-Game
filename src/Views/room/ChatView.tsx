import { useState } from "react";
import { useServer, onSendMessage } from "../../api/Server";
import { RoomDto } from "../../api/Server.dto";

export const ChatView = (props: { style: {} }) => {
    let room: RoomDto | undefined = useServer().currentPlayer?.room;
    let { style } = props;
    const [message, setMessage] = useState<string>("");

    const sendMessage = (roomId: string | undefined, message: string) => {
        if (message && message !== "" && roomId)
            onSendMessage(roomId, { message, author: '' });
    }

    return (
        <div className="chat-screen" style={style}>
            <ul className="messages-list">{room?.messages?.messages.map((message, i) => <li className="message-item" key={i}>{message.message}</li>)}</ul>

            <div className='chat-input-wrapper'>

                <input type="text" onChange={(e) => { setMessage(e.target.value ?? "") }} />
                <button onClick={() => { sendMessage(room?.id, message) }}>Send</button>
            </div>
        </div>
    )
}