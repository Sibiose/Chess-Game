import express from 'express';
const app = express();
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors'
import { ChessGame, createDefaultBoard } from './src/Model/Board';
import { PlayerColors } from './src/Model/PieceEnums';
import { canMove, move } from './src/Model/MovementLogic';
import { Message, Messages, Player, Room, ServerState } from './src/api/Server.dto';
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

    socket.on('createNewPlayer', (username: string) => {
        addPlayer(username, socket.id)
        io.emit('updatedPlayers', serverState.players);
    })

    socket.on('createNewRoom', (room: Room) => {
        addRoom(room);
        io.emit('updatedRooms', serverState.rooms);
    });

    socket.on('joinRoom', (roomId: string) => {
        let room = getRoomById(roomId);
        let player = getPlayerBySocketId(socket.id);
        if (room && room.joinedPlayers.length < 2 && player?.joinedRoom === false) {
            updateRoomPlayers(room, socket.id);
            socket.join(roomId);
            io.emit('updatedRooms', serverState.rooms);
            io.emit('updatedPlayers', serverState.players);
        }

    });

});

//PLAYER METHODS

export const getPlayerBySocketId = (socketId: string) => {
    return getServerState().players.players.find(player => player.socketId === socketId);
}

export const getPlayerById = (id: string) => {
    return getServerState().players.players.find(player => player.id === id);
}

export const addPlayer = (username: string, socketId: string) => {
    let currentDate = getCurrentDateNumber();
    let serverState = getServerState();
    let id = uuid();
    let newPlayer: Player = { id, username, socketId, timestamp: currentDate, joinedRoom: false }
    serverState.players.timestamp = currentDate;
    serverState.players.players.push(newPlayer);
}

export const getCurrentDateNumber = () => {
    return new Date().getDate();
}

//ROOM METHODS

export const getRoomById = (roomId: string) => {
    return getServerState().rooms.rooms.find(room => room.id === roomId);
}

export const addRoom = (room: Room) => {
    let currentDate = getCurrentDateNumber();
    let serverState = getServerState();
    serverState.rooms.timestamp = currentDate;
    room.timestamp = currentDate;
    serverState.rooms.rooms.push(room);
}

export const updateRoomPlayers = (room: Room, socketId: string) => {
    let currentDate = getCurrentDateNumber();
    let player = getPlayerBySocketId(socketId);
    if (player) {
        room.joinedPlayers.push(player.id);
        room.timestamp = currentDate;
        player.joinedRoom = true;
        player.roomId = room.id;
    }
}





export const onPlayerMove = (boardState: ChessGame, from: number, to: number): ChessGame => {
    if (canMove(boardState, from, to)) {
        move(boardState, from, to);
    }
    return boardState;
}


// export const onCreateNewGame = (bottomPlayer: PlayerColors) => {
//     let boardState = createDefaultBoard(bottomPlayer);

//     return boardState;
// }