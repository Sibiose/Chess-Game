import { ChessGame } from "../Model/Board";
import { } from 'uuid'
import { PlayerColors } from "../Model/PieceEnums";

export interface ServerState {
    rooms: Rooms
    players: Players
}

export interface Server extends ServerState {
    connected: boolean
}

export interface Rooms {
    timestamp?: number,
    rooms: Room[],
}

export interface Room {
    id: string,
    timestamp?: number,
    name: string,
    password?: string,
    isLocked: boolean,
    isMultiplayer: boolean,
    bottomPlayer: PlayerColors,
    messages: Messages,
    gameState: any,
    joinedPlayers: string[];
}
export interface Players {
    timestamp?: number,
    players: Player[]
}

export interface Player {
    id: string,
    timestamp?: number,
    username: string,
    socketId: string,
    joinedRoom: boolean,
    roomId?:string
}

export interface Messages {
    timestamp?: number,
    messages: Message[]
}

export interface Message {
    timestamp?: number;
    message: string;
    author?: string;
    
}