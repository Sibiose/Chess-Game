import { io } from "socket.io-client";
import { createContext, useState, useEffect, useContext } from 'react'
import { MessageDto, MessagesDto, PlayerDto, PlayersDto, RoomDto, RoomRequest, RoomsDto, Server, ServerState, UpdatePlayerDto } from "./Server.dto";
import { BoardState } from "../Model/Board";
import { playSound } from "../Model/MovementLogic";

const PORT: string = "http://localhost:7000"
let globalSocket: any = undefined;

const ServerContext = createContext<Server>({ connected: false, rooms: { rooms: [] }, players: { players: [] } });

export const ServerProvider = (props: any) => {
    const [state, setState] = useState({ connected: false, rooms: { rooms: [] }, players: { players: [] } });

    useEffect(() => {
        getSocket(setState)
    }, [true]);

    return <ServerContext.Provider value={state}>
        {props.children}
    </ServerContext.Provider>
}

export const useServer = () => {
    return useContext(ServerContext);
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

        globalSocket.on('updatedServerState', (serverState: ServerState) => {
            setState((prevState: Server) => {
                return { ...prevState, ...serverState }
            });
        });

        globalSocket.on('createdCurrentPlayer', (currentPlayer: PlayerDto) => {
            setState((prevState: Server) => {
                return { ...prevState, currentPlayer }
            });
        });

        globalSocket.on('updatedCurrentPlayer', (updatedCurrentPlayer: PlayerDto) => {
            setState((prevState: Server) => {
                return { ...prevState, currentPlayer: { ...updatedCurrentPlayer } }
            });
        });

        globalSocket.on('updatedCurrentRoom', (updatedCurrentRoom: RoomDto) => {
            setState((prevState: Server) => {
                return { ...prevState, currentPlayer: { ...prevState.currentPlayer, room: updatedCurrentRoom } }
            });
        });

        globalSocket.on("connect_error", (err: any) => {
            console.log(err);
            setState((prevState: Server) => {
                return { ...prevState, connected: false }
            });
        });

        globalSocket.on("receivedMessage", (messages: MessagesDto) => {
            setState((prevState: Server) => {
                return { ...prevState, messages }
            });
        });

        globalSocket.on("updatedRooms", (rooms: RoomsDto) => {
            setState((prevState: Server) => {
                return { ...prevState, rooms: { ...rooms } }
            })
        })
        globalSocket.on("updatedPlayers", (players: PlayersDto) => {
            setState((prevState: Server) => {
                return { ...prevState, players }
            });
        });

        globalSocket.on('updatedGameState', (newGameState: BoardState) => {
            setState((prevState: Server) => {
                let playerRoom = prevState.currentPlayer?.room;
                if (playerRoom) {
                    playerRoom.gameState = { ...newGameState }
                }
                return { ...prevState, currentPlayer: { ...prevState.currentPlayer, room: playerRoom } }
            });
            console.log(newGameState.currentSound)
            playSound(newGameState.currentSound ?? "Move");
        });

    }
    return globalSocket;
}

const checkGlobalSocketExists = () => {
    if (!globalSocket)
        throw Error("INVALID USAGE!")
}

export const onSendMessage = async (message: MessageDto) => {
    checkGlobalSocketExists();
    globalSocket.emit('sendMessage', message);
}

export const onCreateNewRoom = async (playerdId: string, room: RoomRequest) => {
    checkGlobalSocketExists();
    globalSocket.emit('createNewRoom', playerdId, room);
}

export const onJoinRoom = async (roomId: string, playerId: string | undefined) => {
    checkGlobalSocketExists();
    globalSocket.emit('joinRoom', roomId, playerId)
}

export const onCreatePlayer = async (username: string) => {
    checkGlobalSocketExists();
    globalSocket.emit('createPlayer', username);
}

export const onUpdatePlayer = async (playerId: string, updatedPlayer: UpdatePlayerDto) => {
    checkGlobalSocketExists();
    globalSocket.emit('updatePlayer', updatedPlayer)
}

export const onPlayerMove = async (roomId: string, from: number, to: number) => {
    checkGlobalSocketExists();
    globalSocket.emit('playerMove', roomId, from, to);
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