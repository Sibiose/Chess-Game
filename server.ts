import express from 'express';
import http from 'http';
import cors from 'cors'
import { Server } from 'socket.io';
import { createDefaultBoard, getOppositePlayer } from './src/Model/Board';
import { PlayerColors } from './src/Model/PieceEnums';
import { canMove, move } from './src/Model/MovementLogic';
import { MessageDto, MessagesDto, PlayerDto, PlayersDto, RoomDto, RoomRequest, RoomsDto, ServerState, UpdatePlayerDto, UpdateRoomDto } from './src/api/Server.dto';
import { v4 as uuid } from 'uuid';

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
            updatePlayer(playerId, { socketId: socket.id });
            socket.join(playerId);
            let roomId = getPlayerById(playerId)?.room?.id;
            if (roomId && !socket.rooms.has(roomId)) {
                socket.join(roomId);
            }
            io.to(playerId).emit('updatedCurrentPlayer', getPlayerById(playerId));
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

    socket.on('playerMove', (roomId: string, from: number, to: number) => {
        let newState = movePiece(roomId, from, to);
        if (newState) {
            io.to(roomId).emit('updatedGameState', newState);
        }
    });

    socket.on('sendMessage', (roomId: string, message: MessageDto) => {
        let messages = updateRoomMessages(roomId, message);
        if (messages) {
            io.to(roomId).emit('updatedMessages', messages);
        }
    })

});


//PLAYER METHODS

export const getPlayerById = (playerId: string) => {
    return getServerState().players.playersMap.get(playerId);
}

export const addPlayer = (socketId: string, username: string) => {
    let id = uuid();
    let newPlayer: PlayerDto = { id, socketId, username, createdAt: getCurrentDateNumber() };
    setPlayers(id, newPlayer);
    return newPlayer;
}

export const updatePlayer = (playerId: string, updatedPlayer: UpdatePlayerDto) => {
    let player = getPlayerById(playerId)
    if (player) {
        return setPlayers(playerId, { ...player, ...updatedPlayer })
    }
}

//ROOM METHODS

export const getRoomById = (roomId: string) => {
    return getServerState().rooms.roomsMap.get(roomId);
}

export const addRoom = (room: RoomRequest) => {
    let id = uuid();
    let gameState = createNewGame(room.bottomPlayerColor);
    let newRoom: RoomDto = { ...room, id, gameState, messages: { messages: [] }, isFull: false, joinedPlayers: [] }
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
    if (player && room) {
        let roomLoad: UpdateRoomDto = { bottomPlayer: player, isFull: !room.isMultiplayer, joinedPlayers: room.joinedPlayers.concat(playerId) }
        let playerLoad: UpdatePlayerDto = { pieceColor: room.bottomPlayerColor };
        if (room.bottomPlayer) {
            roomLoad = { topPlayer: player, isFull: true, joinedPlayers: room.joinedPlayers.concat(playerId) }
            playerLoad = { pieceColor: getOppositePlayer(room.bottomPlayerColor) };
        }
        updateRoom(roomId, roomLoad);
        updatePlayer(playerId, { room: getRoomById(roomId), ...playerLoad });
    };
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
            setRooms(roomId, { ...room, gameState });
            room.joinedPlayers.forEach(playerId => {
                updatePlayer(playerId, { room: getRoomById(roomId) });
            });
            return getRoomById(roomId)?.gameState;
        }
    }


}
