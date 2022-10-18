import express from 'express';
const app = express();
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors'
import { ChessGame, createDefaultBoard, getOppositePlayer } from './src/Model/Board';
import { PlayerColors } from './src/Model/PieceEnums';
import { canMove, move } from './src/Model/MovementLogic';
import { MessageDto, MessagesDto, PlayerDto, PlayersDto, RoomDto, RoomRequest, RoomsDto, ServerState, UpdatePlayerDto, UpdateRoomDto } from './src/api/Server.dto';
app.use(cors());
import { v4 as uuid } from 'uuid';
import { timeStamp } from 'console';

const server = http.createServer(app);
let serverState: ServerState;
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"]
    }
})

server.listen(7000, () => {
    console.log('Server is running')
});

export const getServerState = () => {
    if (!serverState)
        serverState = {
            rooms: {
                rooms: new Map<string, RoomDto>()
            },
            players: {
                players: new Map<string, PlayerDto>()
            }
        }
    return serverState
}

export const parseRoomsObject = (rooms: RoomsDto) => {
    let roomsArray = [...Array.from(rooms.rooms.values())];
    return { ...rooms, rooms: roomsArray.length ? roomsArray : [] }
}

export const parsePlayersObject = (players: PlayersDto) => {
    let playersArray = [...Array.from(players.players.values())];
    return { ...players, players: playersArray.length ? playersArray : [] }
}

// Socket connection handling
io.on('connection', socket => {

    //Sending the current serverState once the socket connects to the server
    io.emit('receivedServerState', { players: parsePlayersObject(getServerState().players), rooms: parseRoomsObject(getServerState().rooms) });
    //Creating the current session for a new socket
    socket.on('createPlayer', async (username: string) => {
        io.to(socket.id).emit('createdCurrentPlayer', addPlayer(socket.id, username));
        io.emit('updatedPlayers', parsePlayersObject(serverState.players));
    });
    socket.on('updatePlayer', async (updatedPlayer: UpdatePlayerDto) => {
        io.to(socket.id).emit('updatedCurrentPlayer', updatePlayer(socket.id, { ...updatedPlayer }));
        io.emit('updatedPlayers', parsePlayersObject(serverState.players));
    });

    socket.on('createNewRoom', (playerId: string, room: RoomRequest) => {
        let newRoom = addRoom(room);
        socket.join(newRoom.id);
        joinRoom(newRoom.id, playerId);
        io.to(socket.id).emit('updatedCurrentPlayer', getPlayerById(playerId));
        io.emit('updatedRooms', parseRoomsObject(serverState.rooms));
        io.emit('updatedPlayers', parsePlayersObject(serverState.players));
    });

    socket.on('joinRoom', (roomId: string, playerId: string) => {
        let room = getRoomById(roomId);
        let player = getPlayerById(playerId);
        if (room && room.isFull === false && !player?.room) {
            socket.join(roomId);
            joinRoom(roomId, playerId)
            io.to(socket.id).emit('updatedCurrentPlayer', getPlayerById(playerId));
            io.emit('updatedRooms', parseRoomsObject(serverState.rooms));
            io.emit('updatedPlayers', parsePlayersObject(serverState.players));
        }
    });

    socket.on('playerMove', (roomId: string, from: number, to: number) => {
        let newState = movePiece(roomId, from, to);
        if (newState) {
            io.to(roomId).emit('updatedGameState', newState);
        }
    })

});


//PLAYER METHODS

export const getPlayerById = (playerId: string) => {
    return getServerState().players.players.get(playerId);
}

export const addPlayer = (socketId: string, username: string): PlayerDto => {
    let currentDate = getCurrentDateNumber();
    let serverState = getServerState();
    let id = uuid();
    let newPlayer: PlayerDto = { id, socketId, username, createdAt: currentDate, timestamp: currentDate }
    serverState.players.timestamp = currentDate;
    serverState.players.players.set(id, newPlayer);
    return newPlayer;
}

export const updatePlayer = (playerId: string, updatedPlayer: UpdatePlayerDto) => {
    let player = getPlayerById(playerId)
    if (player) {
        let currentDate = getCurrentDateNumber();
        let serverState = getServerState();
        serverState.players.players.set(playerId, { ...player, ...updatedPlayer, timestamp: currentDate })
        serverState.players.timestamp = currentDate;

        return { ...player }
    }
}

export const getCurrentDateNumber = () => {
    return new Date().getTime();
}

//ROOM METHODS

export const getRoomById = (roomId: string) => {
    return getServerState().rooms.rooms.get(roomId);
}

export const addRoom = (room: RoomRequest) => {
    let currentDate = getCurrentDateNumber();
    let serverState = getServerState();
    let id = uuid();
    let gameState = createNewGame(room.bottomPlayerColor);
    gameState.timestamp = currentDate;
    let newRoom: RoomDto = { ...room, id, gameState, messages: { messages: [] }, isFull: false, timestamp: currentDate }
    serverState.rooms.timestamp = currentDate;
    serverState.rooms.rooms.set(id, newRoom);

    return newRoom
}

export const updateRoom = (roomId: string, updatedRoom: UpdateRoomDto) => {
    let room = getRoomById(roomId);
    if (room) {
        let currentDate = getCurrentDateNumber();
        let serverState = getServerState();
        serverState.rooms.rooms.set(roomId, { ...room, ...updatedRoom, timestamp: currentDate });
        serverState.rooms.timestamp = currentDate;

        return { ...serverState.rooms.rooms.get(roomId) }
    }
}

export const joinRoom = (roomId: string, playerId: string) => {
    let player = getPlayerById(playerId);
    let room = getRoomById(roomId)
    if (player && room) {
        updateRoom(roomId, !room.bottomPlayer ? { bottomPlayer: { ...player }, isFull: !room.isMultiplayer } : { topPlayer: { ...player }, isFull: true });
        console.log(room);
        updatePlayer(playerId, { room, pieceColor: !room.bottomPlayer ? room.bottomPlayerColor : getOppositePlayer(room.bottomPlayerColor) });
    };
}

//GAME METHODS

export const createNewGame = (bottomPlayer: PlayerColors) => {
    return createDefaultBoard(bottomPlayer);
}

export const movePiece = (roomId: string, from: number, to: number) => {

    let room = getRoomById(roomId);
    if (room) {
        let currentDate = getCurrentDateNumber();
        let serverState = getServerState();
        if (canMove(room.gameState, from, to)) {
            serverState.rooms.rooms.set(roomId, { ...room, timestamp: currentDate, gameState: { ...move(room.gameState, from, to), timeStamp: currentDate } });
            serverState.rooms.timestamp = currentDate;
            return serverState.rooms.rooms.get(roomId)?.gameState;
        }
    }


}
