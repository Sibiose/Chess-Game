import { useEffect, useRef, useState } from "react";
import { useServer, onSendMessage } from "../../api/Server";
import { RoomDto } from "../../api/Server.dto";

export const ChatView = (props: { style: {} }) => {
    let username = useServer().currentPlayer?.username ?? "";
    let room: RoomDto | undefined = useServer().currentPlayer?.room;
    let { style } = props;
    const [message, setMessage] = useState<string>("");

    const sendMessage = (author: string, roomId: string | undefined, message: string) => {
        if (message && message !== "" && roomId) {
            onSendMessage(roomId, { message, author });
            setMessage('');
        }

    }
    let messageList = useRef<HTMLUListElement>(null)

    useEffect(() => {
        messageList.current?.children[messageList.current.children.length - 1]?.scrollIntoView({ behavior: "smooth" });
    }, [room?.messages]);

    return (
        <div className="chat-screen" style={style}>
            <ul ref={messageList} className="messages-list">{room?.messages?.messages.reverse()?.map((message, i) => <li style={
                message.author === username ? { marginLeft: 'auto' } : { marginRight: 'auto' }
            } className="message-item" key={i}>{message.message}</li>)}</ul>

            <div className='chat-input-wrapper'>

                <input value={message} type="text" onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        sendMessage(username, room?.id, message)
                    }
                }} onChange={(e) => { setMessage(e.target.value ?? "") }
                } />
                <button onClick={() => { sendMessage(username, room?.id, message) }}>Send</button>
            </div>
        </div>
    )
}