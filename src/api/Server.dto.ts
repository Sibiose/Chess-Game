import { ChessGame } from "../Model/Board";
import { PlayerColors } from "../Model/PieceEnums";

export interface ServerState {
    rooms: RoomsDto
    players: PlayersDto
}

export interface Server {
    connected: boolean,
    currentPlayer?: PlayerDto
    rooms: { timestamp?: number, rooms: RoomDto[] }
    players: { timestamp?: number, players: PlayerDto[] }
}

export interface RoomsDto {
    timestamp?: number,
    roomsMap: Map<string, RoomDto>
}

export interface RoomDto {
    id: string,
    timestamp?: number,
    name: string,
    password?: string,
    isLocked: boolean,
    isMultiplayer: boolean,
    bottomPlayerColor: PlayerColors,
    bottomPlayer?: PlayerDto,
    topPlayer?: PlayerDto,
    messages: MessagesDto,
    gameState: any,
    isFull: boolean,
    joinedPlayers: string[],
    difficulty: number
}

export interface UpdateRoomDto {
    timestamp?: number;
    joinedPlayers?: string[];
    isFull?: boolean;
    gameState?: any;
    messages?: MessagesDto;
    bottomPlayer?: PlayerDto;
    topPlayer?: PlayerDto;
}

export interface PlayersDto {
    timestamp?: number,
    playersMap: Map<string, PlayerDto>
}

export interface PlayerDto {
    id: string,
    createdAt: number,
    timestamp?: number,
    username?: string,
    socketId: string,
    room?: RoomDto,
    pieceColor?: PlayerColors,
}

export interface UpdatePlayerDto {
    timestamp?: number,
    username?: string,
    socketId?: string,
    room?: RoomDto
    pieceColor?: PlayerColors,
}

export interface MessagesDto {
    timestamp?: number,
    messages: MessageDto[]
}

export interface MessageDto {
    timestamp?: number;
    message: string;
    author?: string;
}

export interface RoomRequest {
    name: string,
    isLocked: boolean,
    isMultiplayer: boolean,
    password?: string,
    bottomPlayerColor: PlayerColors,
    difficulty: number
}
