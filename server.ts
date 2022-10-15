import express from 'express';
const app = express();
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors'
import { ChessGame, createDefaultBoard, getOppositePlayer } from './src/Model/Board';
import { PlayerColors } from './src/Model/PieceEnums';
import { canMove, move } from './src/Model/MovementLogic';
import { MessageDto, MessagesDto, PlayerDto, RoomDto, RoomRequest, ServerState, UpdatePlayerDto, UpdateRoomDto } from './src/api/Server.dto';
app.use(cors());
import { v4 as uuid } from 'uuid';

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
                rooms: []
            },
            players: {
                players: []
            }
        }
    return serverState
}


// Socket connection handling
io.on('connection', socket => {

    //Sending the current serverState once the socket connects to the server
    io.emit('receivedServerState', serverState);
    //Creating the current session for a new socket
    socket.on('createPlayer', async (username: string) => {
        io.to(socket.id).emit('createdCurrentPlayer', addPlayer(socket.id, username));
        io.emit('updatedPlayers', serverState.players);
    });
    socket.on('updatePlayer', async (updatedPlayer: UpdatePlayerDto) => {
        io.to(socket.id).emit('updatedCurrentPlayer', updatePlayer(socket.id, { ...updatedPlayer }));
        io.emit('updatedPlayers', serverState.players);
    });

    socket.on('createNewRoom', (room: RoomRequest) => {
        let newRoom = addRoom(room);
        socket.join(newRoom.id);
        joinRoom(newRoom.id, socket.id);
        io.to(socket.id).emit('updatedCurrentPlayer', getPlayerBySocketId(socket.id));
        io.emit('updatedRooms', serverState.rooms);
        io.emit('updatedPlayers', serverState.players);
    });

    socket.on('joinRoom', (roomId: string) => {
        let room = getRoomById(roomId);
        let player = getPlayerBySocketId(socket.id);
        if (room && room.joinedPlayers.length < 2 && !player?.room) {
            socket.join(roomId);
            joinRoom(roomId, socket.id)
            io.to(socket.id).emit('updatedCurrentPlayer', getPlayerBySocketId(socket.id));
            io.emit('updatedRooms', serverState.rooms);
            io.emit('updatedPlayers', serverState.players);
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

export const getPlayerBySocketId = (socketId: string) => {
    return getServerState().players.players.filter(player => player.socketId === socketId)[0];
}

export const getPlayerRoomIndexBySocketId = (socketId: string) => {
    let playerRoom = getPlayerBySocketId(socketId).room;
    return getServerState().rooms.rooms.map((room, i) => room.id === playerRoom?.id ? i : null).filter(i => i)[0];
}

export const getPlayerById = (id: string) => {
    return getServerState().players.players.filter(player => player.id === id)[0];
}

export const getPlayerIndexBySocketId = (socketId: String) => {
    return getServerState().players.players.map((player, i) => player.socketId === socketId ? i : null).filter(i => i)[0];
}

export const addPlayer = (socketId: string, username: string): PlayerDto => {
    let currentDate = getCurrentDateNumber();
    let serverState = getServerState();
    let id = uuid();
    let newPlayer: PlayerDto = { id, socketId, username, createdAt: currentDate, timestamp: currentDate }
    serverState.players.timestamp = currentDate;
    serverState.players.players.push(newPlayer);
    return newPlayer;
}

export const updatePlayer = (socketId: string, updatedPlayer: UpdatePlayerDto) => {
    let index = getPlayerIndexBySocketId(socketId);
    let player = getPlayerBySocketId(socketId);
    if (index && player) {
        let currentDate = getCurrentDateNumber();
        let serverState = getServerState();
        serverState.players.players[index] = { ...player, ...updatedPlayer, timestamp: currentDate }
        serverState.players.timestamp = currentDate;

        return { ...serverState.players.players[index] }
    }
}

export const getCurrentDateNumber = () => {
    return new Date().getTime();
}

//ROOM METHODS

export const getRoomById = (roomId: string) => {
    return getServerState().rooms.rooms.find(room => room.id === roomId);
}

export const getRoomIndexById = (roomId: string) => {
    return getServerState().rooms.rooms.map((room, i) => room.id === roomId ? i : null).filter(i => i)[0];
}

export const addRoom = (room: RoomRequest) => {
    let currentDate = getCurrentDateNumber();
    let serverState = getServerState();
    let id = uuid();
    let gameState = createNewGame(room.bottomPlayerColor);
    gameState.timestamp = currentDate;
    let newRoom: RoomDto = { ...room, id, gameState, messages: { messages: [] }, joinedPlayers: [], isFull: false, timestamp: currentDate }
    serverState.rooms.timestamp = currentDate;
    serverState.rooms.rooms.push(newRoom);

    return newRoom
}

export const updateRoom = (roomId: string, updatedRoom: UpdateRoomDto) => {
    let index = getRoomIndexById(roomId);
    let room = getRoomById(roomId);
    if (index && room) {
        let currentDate = getCurrentDateNumber();
        let serverState = getServerState();
        serverState.rooms.rooms[index] = { ...room, ...updatedRoom, timestamp: currentDate }
        serverState.rooms.timestamp = currentDate;

        return { ...serverState.players.players[index] }
    }
}

export const joinRoom = (roomId: string, socketId: string) => {
    let roomIndex = getRoomIndexById(roomId);
    let playerIndex = getPlayerIndexBySocketId(socketId);
    if (roomIndex && playerIndex) {
        let serverState = getServerState();
        let player = serverState.players.players[playerIndex];
        let room = serverState.rooms.rooms[roomIndex]
        serverState.rooms.rooms[roomIndex].joinedPlayers.push(player.id);
        updateRoom(roomId, !room.bottomPlayer ? { bottomPlayer: { ...player } } : { topPlayer: { ...player } });
        updatePlayer(socketId, { room: serverState.rooms.rooms[roomIndex], pieceColor: !room.bottomPlayer ? room.bottomPlayerColor : getOppositePlayer(room.bottomPlayerColor) });
    };
}

//GAME METHODS

export const createNewGame = (bottomPlayer: PlayerColors) => {
    return createDefaultBoard(bottomPlayer);
}



export const movePiece = (roomId: string, from: number, to: number) => {

    let roomIndex = getRoomIndexById(roomId);
    if (roomIndex) {
        let currentDate = getCurrentDateNumber();
        let serverState = getServerState();
        if (canMove(serverState.rooms.rooms[roomIndex].gameState, from, to)) {
            move(serverState.rooms.rooms[roomIndex].gameState, from, to);
            serverState.rooms.rooms[roomIndex].gameState.timestamp = currentDate;
            serverState.rooms.rooms[roomIndex].timestamp = currentDate;
            serverState.rooms.timestamp = currentDate;
            return serverState.rooms.rooms[roomIndex].gameState;
        }
    }


}


// export const onCreateNewGame = (bottomPlayer: PlayerColors) => {
//     let boardState = createDefaultBoard(bottomPlayer);

//     return boardState;
// }