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

    socket.on('chooseUsername', (username: string) => {
        updatePlayers(username, socket.id)
        io.emit('receivedPlayers', serverState.players);
    })

    socket.on('createNewRoom', (room: Room) => {
        updateRooms(room);
        io.emit('receivedRooms', serverState.rooms);
    });

    // socket.on('joinRoom',)

})



// socket.on('sendMessage', (message) => {
//     updateMessages(message);
//     io.emit("receivedMessage", messages);
// });

// /export const updateMessages = (message: Message) => {
//     messages.messages.push(message);
//     message.timestamp = new Date().getDate();
// }

export const updateRooms = (room: Room) => {
    let currentDate = getCurrentDateNumber();
    let serverState = getServerState();
    serverState.rooms.timestamp = currentDate;
    room.timestamp = currentDate;
    serverState.rooms.rooms.push(room);
}

export const updatePlayers = (username: string, socketId: string) => {
    let currentDate = getCurrentDateNumber();
    let serverState = getServerState();
    let id = uuid();
    let newPlayer: Player = { id, username, socketId }
    serverState.players.timestamp = currentDate;
    serverState.players.players.push(newPlayer);
}

export const getCurrentDateNumber = () => {
    return new Date().getDate();
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