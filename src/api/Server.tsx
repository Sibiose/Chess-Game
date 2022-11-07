import { io } from "socket.io-client";
import { createContext, useState, useEffect, useContext } from 'react'
import { MessageDto, MessagesDto, PlayerDto, PlayersDto, RoomDto, RoomRequest, RoomsDto, Server, ServerState, UpdatePlayerDto } from "./Server.dto";
import { BoardState } from "../Model/Board";
import { playSound } from "../Model/MovementLogic";
import { useCookies } from "react-cookie";

const PORT: string = "http://192.168.182.157:7000";
let globalSocket: any = undefined;

const ServerContext = createContext<Server>({ connected: false, rooms: { rooms: [] }, players: { players: [] } });

export const ServerProvider = (props: any) => {
    const [state, setState] = useState({ connected: false, rooms: { rooms: [] }, players: { players: [] } });
    const [cookies, setCookie] = useCookies(['player']);

    useEffect(() => {
        getSocket(setState, cookies, setCookie)
    }, [true]);

    return <ServerContext.Provider value={state}>
        {props.children}
    </ServerContext.Provider>
}

export const useServer = () => {
    return useContext(ServerContext);
}

export const getSocket = (setState: any, cookies: any, setCookie: any) => {

    if (!globalSocket) {
        globalSocket = io(PORT);
        globalSocket.on("connect", () => {
            console.log("Connected to Server");
            globalSocket.emit('checkPlayerCookies', cookies.player);
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
            setCookie('player', currentPlayer.id, {
                maxAge: 172800
            });
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

        globalSocket.on("updatedMessages", (messages: MessagesDto) => {
            setState((prevState: Server) => {
                let playerRoom = prevState.currentPlayer?.room;
                if (playerRoom) {
                    playerRoom.messages = { ...messages }
                    return { ...prevState, currentPlayer: { ...prevState.currentPlayer, room: playerRoom } }
                }
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
            let soundExtension: string | undefined;
            setState((prevState: Server) => {
                if (newGameState.isInMate) {
                    soundExtension = newGameState.currentPlayer === prevState.currentPlayer?.pieceColor ? '-lose' : '-win';
                }
                let playerRoom = prevState.currentPlayer?.room;
                if (playerRoom) {
                    playerRoom.gameState = { ...newGameState }
                }
                onAiMoveRequest(prevState.currentPlayer?.room?.id ?? "");
                return { ...prevState, currentPlayer: { ...prevState.currentPlayer, room: playerRoom } }
            });
            playSound(newGameState.currentSound ?? "Move", soundExtension);

        });

        globalSocket.on('aiUpdatedGameState', (newGameState: BoardState) => {
            let soundExtension: string | undefined;
            setState((prevState: Server) => {
                if (newGameState.isInMate) {
                    soundExtension = newGameState.currentPlayer === prevState.currentPlayer?.pieceColor ? '-win' : '-lose';
                }
                let playerRoom = prevState.currentPlayer?.room;
                if (playerRoom) {
                    playerRoom.gameState = { ...newGameState }
                }
                return { ...prevState, currentPlayer: { ...prevState.currentPlayer, room: playerRoom } }
            });
            playSound(newGameState.currentSound ?? "Move", soundExtension);

        });

    }
    return globalSocket;
}

const checkGlobalSocketExists = () => {
    if (!globalSocket)
        throw Error("INVALID USAGE!")
}

export const onSendMessage = async (roomId: string, message: MessageDto) => {
    checkGlobalSocketExists();
    globalSocket.emit('sendMessage', roomId, message);
}

export const onCreateNewRoom = async (playerdId: string, room: RoomRequest) => {
    checkGlobalSocketExists();
    globalSocket.emit('createNewRoom', playerdId, room);
}

export const onJoinRoom = async (roomId: string, playerId: string | undefined) => {
    checkGlobalSocketExists();
    globalSocket.emit('joinRoom', roomId, playerId)
}

export const onLeaveRoom = async (roomId: string, playerId: string | undefined) => {
    checkGlobalSocketExists();
    globalSocket.emit('leaveRoom', roomId, playerId);
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

export const onAiMoveRequest = async (roomId: string) => {
    checkGlobalSocketExists();
    globalSocket.emit('aiMoveRequest', roomId);
}


