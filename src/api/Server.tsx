import { io } from "socket.io-client";
import { createContext, useState, useEffect, useContext } from 'react'

const PORT: string = "http://localhost:7000"
let globalSocket: any = undefined;

export interface Message {
    message: string;
    author?: string;
    timestamp?: number;
}

export interface Messages {
    timestamp?: number,
    messages: Message[]
}

export interface Server {
    connected: boolean
    messages: Messages
}

const ServerContext = createContext<Server>({ connected: false, messages: { messages: [] } })

export const useServer = () => {
    return useContext(ServerContext);
}

export const ServerProvider = (props: any) => {
    const [state, setState] = useState({ connected: false, messages: { messages: [] } });

    useEffect(() => {
        getSocket(setState)
    }, [true]);

    return <ServerContext.Provider value={state}>
        {props.children}
    </ServerContext.Provider>
}

export const getSocket = (setState: any) => {
    if (!globalSocket) {
        globalSocket = io(PORT);
        globalSocket.on("connect", () => {
            console.log("Connected to Server");
            setState({ connected: true })
        })

        globalSocket.on("connect_error", (err: any) => {
            console.log(err);
            setState({ connected: false })
        })

        globalSocket.on("receivedMessage", (messages: Messages) => {
            setState({ messages: messages });
        })
    }
    return globalSocket;
}

const checkGlobalSocketExists = () => {
    if (!globalSocket)
        throw Error("INVALID USAGE!")
}

export const onSendMessage = async (message: Message) => {
    checkGlobalSocketExists();
    globalSocket.emit('sendMessage', message)
}



















// export const onReceivedMessage = (socket:Socket, message:string) => {
//     socket.on('receivedMessage', (message)=>{

//     })
// }

//SendMessage

//Add context - Nope


//TODO:Multiplayer sockets
// Manage Connections to server from here

// Allow verifying moves and validation for front-end
//Send move information to backend
//Store state in backend
//Make validation canMove && move in backend
//Send new State back and update the state with the game.move function in relation to the response got from backend
//change game.move, game.switchPlayer

//Change BoardState to BoardStateSnapshot

//Add stateHistory:BoardStateSnapshot[] to BoardState


//    socket.on("receivedState", (boardState) => {
//    console.log(boardState)
//});