import express from 'express';
import http from 'http';
import cors from 'cors'
import { Server } from 'socket.io';
import { BoardState, createDefaultBoard, getBoardFEN, getOppositePlayer } from './src/Model/Board';
import { PieceType, PlayerColors } from './src/Model/PieceEnums';
import { canMove, move } from './src/Model/MovementLogic';
import { MessageDto, MessagesDto, PlayerDto, PlayersDto, RoomDto, RoomRequest, RoomsDto, ServerState, UpdatePlayerDto, UpdateRoomDto } from './src/api/Server.dto';
import { v4 as uuid } from 'uuid';
import { AIstringToIndex, Cell, emptyCell } from './src/Model/Cell';
const jsChessEngine: any = require('js-chess-engine');
const { aiMove } = jsChessEngine;
import CronJob from "node-cron";

//Clearing players from database every 10 minutes if disconnected
CronJob.schedule('0 */10 * * * *', () => {
    clearDisconnectedPlayers();
});


const app = express();
app.use(cors());

const server = http.createServer(app);
let serverState: ServerState;
const io = new Server(server, {
    cors: {

    }
})

server.listen(7000, () => {
    console.log('Server is running')
});

export const getServerState = () => {
    if (!serverState)
        serverState = {
            rooms: {
                roomsMap: new Map<string, RoomDto>()
            },
            players: {
                playersMap: new Map<string, PlayerDto>()
            }
        }
    return serverState
}

export const parseRoomsObject = (rooms: RoomsDto) => {
    let roomsArray = [...Array.from(rooms.roomsMap.values())];
    return { ...rooms, rooms: roomsArray.length ? roomsArray : [] }
}

export const parsePlayersObject = (players: PlayersDto) => {
    let playersArray = [...Array.from(players.playersMap.values())];
    return { ...players, players: playersArray.length ? playersArray : [] }
}

export const parseStateObject = () => {
    let serverState = getServerState();
    return { players: parsePlayersObject(serverState.players), rooms: parseRoomsObject(serverState.rooms) };
}

export const setPlayers = (playerId: string, playerLoad: PlayerDto) => {
    getServerState().players.playersMap.set(playerId, { ...playerLoad, timestamp: getCurrentDateNumber() });
    setPlayersTimestamp();
    return getServerState().players.playersMap.get(playerId);
}

export const setRooms = (roomId: string, roomLoad: RoomDto) => {
    getServerState().rooms.roomsMap.set(roomId, { ...roomLoad, timestamp: getCurrentDateNumber() });
    setRoomsTimestamp();
    return getServerState().rooms.roomsMap.get(roomId);
}

export const getCurrentDateNumber = () => {
    return new Date().getTime();
}

export const setPlayersTimestamp = () => {
    getServerState().players.timestamp = new Date().getTime();
}

export const setRoomsTimestamp = () => {
    getServerState().rooms.timestamp = new Date().getTime();
}

// Socket connection handling
io.on('connection', socket => {
    //Sending the current serverState once the socket connects to the server
    io.emit('updatedServerState', parseStateObject());
    socket.on('checkPlayerCookies', (playerId: string) => {
        if (getServerState().players.playersMap.has(playerId)) {
            updatePlayer(playerId, { socketId: socket.id, isConnected: true });
            socket.join(playerId);
            let roomId = getPlayerById(playerId)?.room?.id;
            if (roomId && !socket.rooms.has(roomId)) {
                socket.join(roomId);
            }
            io.to(playerId).emit('updatedCurrentPlayer', getPlayerById(playerId));
            io.emit('updatedPlayers', parsePlayersObject(serverState.players));
        }
    })

    socket.on('disconnect', (reason: string) => {
        let playerId = getPlayerIdBySocketId(socket.id);
        if (getPlayerById(playerId)) {
            updatePlayer(playerId, { isConnected: false });
            io.emit('updatedPlayers', parsePlayersObject(serverState.players));
        }

    })

    //Creating the current session for a new socket
    socket.on('createPlayer', async (username: string) => {
        let newPlayer = addPlayer(socket.id, username);
        socket.join(newPlayer.id);
        io.to(newPlayer.id).emit('createdCurrentPlayer', newPlayer);
        io.emit('updatedPlayers', parsePlayersObject(serverState.players));
    });

    socket.on('updatePlayer', async (playerId: string, updatedPlayer: UpdatePlayerDto) => {
        io.to(playerId).emit('updatedCurrentPlayer', updatePlayer(playerId, updatedPlayer));
        io.emit('updatedPlayers', parsePlayersObject(serverState.players));
    });

    socket.on('createNewRoom', (playerId: string, room: RoomRequest) => {
        let newRoom = addRoom(room);
        socket.join(newRoom.id);
        joinRoom(newRoom.id, playerId);
        io.to(playerId).emit('updatedCurrentPlayer', getPlayerById(playerId));
        io.emit('updatedServerState', parseStateObject());
    });

    socket.on('joinRoom', (roomId: string, playerId: string) => {
        let room = getRoomById(roomId);
        let player = getPlayerById(playerId);
        if (room && room.isFull === false && !player?.room) {
            socket.join(roomId);
            joinRoom(roomId, playerId);
            io.to(playerId).emit('updatedCurrentPlayer', getPlayerById(playerId));
            io.to(roomId).emit('updatedCurrentRoom', getRoomById(roomId));
            io.emit('updatedServerState', parseStateObject());
        }
    });

    socket.on('leaveRoom', (roomId: string, playerId: string) => {
        let room = getRoomById(roomId);
        let player = getPlayerById(playerId);
        if (room && player && player.room?.id === roomId) {
            socket.leave(roomId);
            leaveRoom(roomId, playerId);
            io.to(playerId).emit('updatedCurrentPlayer', getPlayerById(playerId));
            io.to(roomId).emit('updatedCurrentRoom', getRoomById(roomId));
            io.emit('updatedServerState', parseStateObject());
        }
    });

    socket.on('playerMove', (roomId: string, from: number, to: number) => {
        let gameHasStartedYet: boolean = getRoomById(roomId)?.gameHasStarted ?? false;
        let newState = movePiece(roomId, from, to);
        let gameHasEnded = getRoomById(roomId)?.gameHasEnded ?? false;

        if (newState) {
            io.to(roomId).emit('updatedGameState', newState);
        }
        if (!gameHasStartedYet || gameHasEnded) {
            io.to(roomId).emit('updatedCurrentRoom', getRoomById(roomId));
        }
    });

    socket.on('aiMoveRequest', (roomId: string) => {
        let room = getRoomById(roomId);
        if (room && room.gameState && !room.isMultiplayer) {
            let difficulty: number = room.difficulty ?? 1
            let timeout: number = room.difficulty > 2 ? 0 : 1500;
            setTimeout(() => {
                let [from, to] = computeAIMove(room?.gameState, difficulty);
                let aiMoveState = movePiece(roomId, from, to);
                if (aiMoveState) {
                    io.to(roomId).emit('aiUpdatedGameState', aiMoveState);
                }
            }, timeout);

        }
    })

    socket.on('sendMessage', (roomId: string, message: MessageDto) => {
        let messages = updateRoomMessages(roomId, message);
        if (messages) {
            io.to(roomId).emit('updatedMessages', messages);
        }
    });

});


//PLAYER METHODS

export const getPlayerById = (playerId: string) => {
    return getServerState().players.playersMap.get(playerId);
}
export const getPlayerIdBySocketId = (socketId: string) => {
    return Array.from(getServerState().players.playersMap.values()).filter(player => player.socketId === socketId).map(player => player.id)[0];
}

export const addPlayer = (socketId: string, username: string) => {
    let id = uuid();
    let newPlayer: PlayerDto = { id, socketId, username, createdAt: getCurrentDateNumber(), isConnected: true };
    setPlayers(id, newPlayer);
    return newPlayer;
}

export const updatePlayer = (playerId: string, updatedPlayer: UpdatePlayerDto) => {
    let player = getPlayerById(playerId)
    if (player) {
        return setPlayers(playerId, { ...player, ...updatedPlayer })
    }
}

export const deletePlayer = (playerId: string) => {
    let player = getPlayerById(playerId);
    if (player) {
        getServerState().players.playersMap.delete(playerId);
    }
}

export const clearDisconnectedPlayers = () => {
    let players = Array.from(getServerState().players.playersMap.values());
    players.forEach(player => {
        if (!player.isConnected && (player?.timestamp ?? 0 + 600000 > Date.now())) {
            deletePlayer(player.id);
        }
    })
}

//ROOM METHODS

export const getRoomById = (roomId: string) => {
    return getServerState().rooms.roomsMap.get(roomId);
}

export const addRoom = (room: RoomRequest) => {
    let id = uuid();
    let gameState = createNewGame(room.bottomPlayerColor);
    let newRoom: RoomDto = { ...room, id, gameState, messages: { messages: [] }, isFull: false, joinedPlayers: [], gameHasStarted: false, gameHasEnded: false }
    setRooms(id, newRoom);

    return newRoom
}

export const updateRoom = (roomId: string, updatedRoom: UpdateRoomDto) => {
    let room = getRoomById(roomId);
    if (room) {
        setRooms(roomId, { ...room, ...updatedRoom });
        return { ...getRoomById(roomId) }
    }
}

export const joinRoom = (roomId: string, playerId: string) => {
    let player = getPlayerById(playerId);
    let room = getRoomById(roomId)
    if (player && room && room.isFull === false) {
        let isFull = room.isMultiplayer ? room.joinedPlayers.length >= 1 : true;
        let roomLoad: UpdateRoomDto = { bottomPlayer: player, joinedPlayers: room.joinedPlayers.concat(playerId), isFull };
        let playerLoad: UpdatePlayerDto = { pieceColor: room.bottomPlayerColor };
        if (room.bottomPlayer) {
            delete roomLoad.bottomPlayer;
            roomLoad = { ...roomLoad, topPlayer: player }
            playerLoad = { pieceColor: getOppositePlayer(room.bottomPlayerColor) };
        }
        updateRoom(roomId, roomLoad);
        updatePlayer(playerId, { room: getRoomById(roomId), ...playerLoad });
    };
}

export const leaveRoom = (roomId: string, playerId: string) => {
    let player = getPlayerById(playerId);
    let room = getRoomById(roomId);
    if (player && room && player?.room?.id === roomId) {
        setPlayers(playerId, { ...player, room: undefined });
        let leavingPlayer = room?.bottomPlayer?.id === playerId ? { bottomPlayer: undefined } : { topPlayer: undefined };
        let remainingPlayers = room?.joinedPlayers.filter(id => id !== playerId);
        if (remainingPlayers.length) {
            setRooms(roomId, { ...room, joinedPlayers: remainingPlayers, ...leavingPlayer, gameHasEnded: room.gameHasStarted ? true : false, isFull: room.gameHasStarted ? true : false });
        } else {
            deleteRoom(roomId);
        }
    }
}

export const deleteRoom = (roomId: string) => {
    let room = getRoomById(roomId);
    if (room) {
        getServerState().rooms.roomsMap.delete(roomId);
    }
}

export const updateRoomMessages = (roomId: string, message: MessageDto) => {
    let room = getRoomById(roomId);
    if (room) {
        room.messages.messages = room.messages.messages.concat(message);
        setRooms(roomId, room);
        return getRoomById(roomId)?.messages;
    }
}

//GAME METHODS

export const createNewGame = (bottomPlayer: PlayerColors) => {
    return createDefaultBoard(bottomPlayer);
}

export const movePiece = (roomId: string, from: number, to: number) => {
    let room = getRoomById(roomId);
    if (room) {

        if (canMove(room.gameState, from, to)) {
            let gameState = move(room.gameState, from, to);
            setRooms(roomId, { ...room, gameState, gameHasStarted: true, gameHasEnded: gameState.isInMate || gameState.isInStaleMate ? true : false });
            room.joinedPlayers.forEach(playerId => {
                updatePlayer(playerId, { room: getRoomById(roomId) });
            });
            return getRoomById(roomId)?.gameState;
        }
    }
}

export const computeAIMove = (boardState: BoardState, difficulty: number): [number, number] => {
    let aiMoveObject = aiMove(getBoardFEN(boardState), difficulty);
    let aiFrom = AIstringToIndex(Object.keys(aiMoveObject)[0]);
    let aiTo = AIstringToIndex(String((Object.values(aiMoveObject)[0])));

    return [aiFrom, aiTo];
}

export const seedRooms = (n: number) => {
    for (let i = 0; i < n; i++) {
        let id = uuid();
        let room: RoomDto = { id, name: `Room ${i}`, isLocked: false, isMultiplayer: true, bottomPlayerColor: PlayerColors.LIGHT, messages: { messages: [] }, isFull: false, gameState: createNewGame(PlayerColors.LIGHT), joinedPlayers: [], difficulty: 1, gameHasStarted: false, gameHasEnded: false }
        getServerState().rooms.roomsMap.set(id, room);
    }
}
export const seedStalemateRoom = (n: number) => {
    for (let i = 0; i < n; i++) {
        let bottomPlayer = PlayerColors.LIGHT;
        let topPlayer = PlayerColors.DARK;
        let cells: Cell[] = [
            emptyCell, emptyCell, emptyCell, { pieceType: PieceType.QUEEN, pieceColor: topPlayer, id: 28 }, { pieceType: PieceType.KING, pieceColor: topPlayer, id: 29 }, { pieceType: PieceType.BISHOP, pieceColor: topPlayer, id: 30 }, { pieceType: PieceType.KNIGHT, pieceColor: topPlayer, id: 31 }, { pieceType: PieceType.ROOK, pieceColor: topPlayer, id: 32 },
            emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell,
            emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell,
            emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell,
            emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell,
            emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell,
            { pieceType: PieceType.ROOK, pieceColor: topPlayer, id: 25 }, emptyCell, emptyCell, emptyCell, { pieceType: PieceType.BISHOP, pieceColor: bottomPlayer, id: 30 }, emptyCell, emptyCell, emptyCell,
            emptyCell, { pieceType: PieceType.KNIGHT, pieceColor: bottomPlayer, id: 26 }, emptyCell, emptyCell, { pieceType: PieceType.KING, pieceColor: bottomPlayer, id: 5 }, emptyCell, emptyCell, emptyCell,
        ]
        let id = uuid()
        let room: RoomDto = { id, name: `Room Stalemate`, isLocked: false, isMultiplayer: true, bottomPlayerColor: PlayerColors.LIGHT, messages: { messages: [] }, isFull: false, gameState: { ...createNewGame(PlayerColors.LIGHT), cells }, joinedPlayers: [], difficulty: 1, gameHasStarted: false, gameHasEnded: false }
        getServerState().rooms.roomsMap.set(id, room);
    }
}

export const seedPlayers = (n: number) => {
    for (let i = 0; i < n; i++) {
        let id = uuid();
        let player: PlayerDto = { id, createdAt: Date.now(), socketId: "", username: `Player ${i}` }
        getServerState().players.playersMap.set(id, player);
    }
}



// seedRooms(100);
// seedStalemateRoom(5);
// seedPlayers(36);