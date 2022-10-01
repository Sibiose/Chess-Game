import { ChessGame } from "../Model/Board";
import { } from 'uuid'

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
    messages: Messages,
    gameState: any,
}
export interface Players {
    timestamp?: number,
    players: Player[]
}

export interface Player {
    id: string,
    username: string,
    socketId: string,
}

export interface Messages {
    timestamp?: number,
    messages: Message[]
}

export interface Message {
    message: string;
    author?: string;
    timestamp?: number;
}