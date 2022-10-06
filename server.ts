import express from 'express';
const app = express();
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors'
import { ChessGame, createDefaultBoard } from './src/Model/Board';
import { PlayerColors } from './src/Model/PieceEnums';
import { canMove, move } from './src/Model/MovementLogic';
import { MessageDto, MessagesDto, PlayerDto, RoomDto, ServerState, UpdatePlayerDto } from './src/api/Server.dto';
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
    io.to(socket.id).emit('createdCurrentPlayer', addPlayer(socket.id));

    socket.on('updatePlayer', async (updatedPlayer: UpdatePlayerDto) => {
        try {
            io.to(socket.id).emit('updatedCurrentPlayer', updatePlayer(socket.id, { ...updatedPlayer }));
            io.emit('updatedPlayers', serverState.players);
        }
        catch (err) {
            console.log(err);
        }

    });

    socket.on('createNewRoom', (room: RoomDto) => {
        addRoom(room);
        io.emit('updatedRooms', serverState.rooms);
    });

    socket.on('joinRoom', (roomId: string) => {
        let room = getRoomById(roomId);
        let player = getPlayerBySocketId(socket.id);
        if (room && room.joinedPlayers.length < 2 && !player?.room) {
            socket.join(roomId);
            joinRoom(roomId, socket.id)
            io.to(socket.id).emit('updatedCurrentPlayer', updatePlayer(socket.id, { room }));
            io.emit('updatedRooms', serverState.rooms);
            io.emit('updatedPlayers', serverState.players);
        }

    });

});


//PLAYER METHODS

export const getPlayerBySocketId = (socketId: string) => {
    return getServerState().players.players.filter(player => player.socketId === socketId)[0];
}

export const getPlayerById = (id: string) => {
    return getServerState().players.players.filter(player => player.id === id)[0];
}

export const getPlayerIndexBySocketId = (socketId: String) => {
    return getServerState().players.players.map((player, i) => player.socketId === socketId ? i : null).filter(i => i)[0];
}

export const addPlayer = (socketId: string): PlayerDto => {
    let currentDate = getCurrentDateNumber();
    let serverState = getServerState();
    let id = uuid();
    let newPlayer: PlayerDto = { id, socketId, createdAt: currentDate, timestamp: currentDate }
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

export const addRoom = (room: RoomDto) => {
    let currentDate = getCurrentDateNumber();
    let serverState = getServerState();
    serverState.rooms.timestamp = currentDate;
    room.timestamp = currentDate;
    room.gameState = createNewGame(room.bottomPlayerColor);
    serverState.rooms.rooms.push(room);

    return room
}

export const joinRoom = (roomId: string, socketId: string) => {
    let index = getRoomIndexById(roomId);
    let room = getRoomById(roomId);
    let player = getPlayerBySocketId(socketId);
    if (index && room && player) {
        let currentDate = getCurrentDateNumber();
        let serverState = getServerState();
        serverState.rooms.rooms[index].timestamp = currentDate;
        serverState.rooms.rooms[index].joinedPlayers.push(player.id);
        room.bottomPlayer ? serverState.rooms.rooms[index].topPlayer = { ...player } : serverState.rooms.rooms[index].bottomPlayer = { ...player };
        console.log('bottom', serverState.rooms.rooms[index].bottomPlayer);
        console.log('top', serverState.rooms.rooms[index].topPlayer);
    };
}

//GAME METHODS

export const createNewGame = (bottomPlayer: PlayerColors) => {
    return createDefaultBoard(bottomPlayer);
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