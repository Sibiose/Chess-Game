import { useMemo } from 'react';
import io, { Socket } from 'socket.io-client';

export const useChessServer = () => {
    const PORT: string = "http://localhost:7000"
    const socket = io(PORT);

    let chessServer = useMemo(() => {
        return {
            onPlayerMove: (from: number, to: number) => onPlayerMove(socket, from, to),
        }
    }, [socket])
    return chessServer;
}

export const onPlayerMove = (socket: Socket, from: number, to: number) => {
    socket.emit('playerMove', { from, to })
}

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