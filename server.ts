import express from 'express';
const app = express();
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors'
import { ChessGame, createDefaultBoard } from './src/Model/Board';
import { PlayerColors } from './src/Model/PieceEnums';
import { canMove, move } from './src/Model/MovementLogic';
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3004"]
    }
})

server.listen(7000, () => {
    console.log('Server is running')
});

//CHESS GAME SERVICES

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

// CHAT SERVICES
io.on('connection', socket => {

    socket.on('sendMessage', (message) => {
        socket.broadcast.emit("receivedMessage", message);
    });

    socket.on('playerMove', (boardState, from, to) => {
        let newBoardState = onPlayerMove(boardState, from, to)

        socket.to('1').emit("receivedState", newBoardState);
    });

})
