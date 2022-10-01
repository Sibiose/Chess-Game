import { io } from "socket.io-client";
import { createContext, useState, useEffect, useContext } from 'react'
import { Message, Messages, Players, Room, Rooms, Server, ServerState } from "./Server.dto";

const PORT: string = "http://localhost:7000"
let globalSocket: any = undefined;

const ServerContext = createContext<Server>({ connected: false, rooms: { rooms: [] }, players: { players: [] } })

export const useServer = () => {
    return useContext(ServerContext);
}

export const ServerProvider = (props: any) => {
    const [state, setState] = useState({ connected: false, rooms: { rooms: [] }, players: { players: [] } });

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
            setState((prevState: Server) => {
                return { ...prevState, connected: true }
            });
        });

        globalSocket.on('receivedServerState', (serverState: ServerState) => {
            setState((prevState: Server) => {
                return { ...prevState, ...serverState }
            })
        })

        globalSocket.on("connect_error", (err: any) => {
            console.log(err);
            setState((prevState: Server) => {
                return { ...prevState, connected: false }
            });
        });

        globalSocket.on("receivedMessage", (messages: Messages) => {
            setState((prevState: Server) => {
                return { ...prevState, messages }
            });
        });

        globalSocket.on("receivedRooms", (rooms: Rooms) => {
            setState((prevState: Server) => {
                return { ...prevState, rooms }
            })
        })
        globalSocket.on("receivedPlayers", (players: Players) => {
            setState((prevState: Server) => {
                return { ...prevState, players }
            });
        });


    }
    return globalSocket;
}

const checkGlobalSocketExists = () => {
    if (!globalSocket)
        throw Error("INVALID USAGE!")
}

export const onSendMessage = async (message: Message) => {
    checkGlobalSocketExists();
    globalSocket.emit('sendMessage', message);
}

export const onCreateNewRoom = async (room: Room) => {
    checkGlobalSocketExists();
    globalSocket.emit('createNewRoom', room);
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