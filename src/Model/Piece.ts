import { createDefaultPositionsMap, PieceType, PlayerColors } from "./PieceEnums";
import { Coordonate } from './Cell'

export interface Piece {
    id: number;
    position: Coordonate;
    pieceType: PieceType;
    pieceColor: PlayerColors;
}

export const createDefaultPieces = (bottomPlayer: PlayerColors): Piece[] => {
    let pieces: Piece[] = [];
    let topPlayer: PlayerColors = bottomPlayer === PlayerColors.LIGHT ? PlayerColors.DARK : PlayerColors.LIGHT;
    let i = 1;
    const positionMap: Map<string, Coordonate[]> = createDefaultPositionsMap();

    positionMap.get('Pawn')?.forEach(el => {
        pieces.push({ id: i, position: el, pieceColor: bottomPlayer, pieceType: PieceType.PAWN });
        i++;
    });
    positionMap.get('Pawn')?.map(el => { return { ...el, y: 7 } }).forEach(el => {
        pieces.push({ id: i, position: el, pieceColor: topPlayer, pieceType: PieceType.PAWN });
        i++;
    });
    positionMap.get('Rook')?.forEach(el => {
        pieces.push({ id: i, position: el, pieceColor: bottomPlayer, pieceType: PieceType.ROOK });
        i++;
    });
    positionMap.get('Rook')?.map(el => { return { ...el, y: 8 } }).forEach(el => {
        pieces.push({ id: i, position: el, pieceColor: topPlayer, pieceType: PieceType.ROOK });
        i++;
    });
    positionMap.get('Knight')?.forEach(el => {
        pieces.push({ id: i, position: el, pieceColor: bottomPlayer, pieceType: PieceType.KNIGHT });
        i++;
    });
    positionMap.get('Knight')?.map(el => { return { ...el, y: 8 } }).forEach(el => {
        pieces.push({ id: i, position: el, pieceColor: topPlayer, pieceType: PieceType.KNIGHT });
        i++;
    });
    positionMap.get('Bishop')?.forEach(el => {
        pieces.push({ id: i, position: el, pieceColor: bottomPlayer, pieceType: PieceType.BISHOP });
        i++;
    });
    positionMap.get('Bishop')?.map(el => { return { ...el, y: 8 } }).forEach(el => {
        pieces.push({ id: i, position: el, pieceColor: topPlayer, pieceType: PieceType.BISHOP });
        i++;
    });
    positionMap.get('Queen')?.forEach(el => {
        pieces.push({ id: i, position: el, pieceColor: bottomPlayer, pieceType: PieceType.QUEEN });
        i++;
    });
    positionMap.get('Queen')?.map(el => { return { ...el, y: 8 } }).forEach(el => {
        pieces.push({ id: i, position: el, pieceColor: topPlayer, pieceType: PieceType.QUEEN });
        i++;
    });
    positionMap.get('King')?.forEach(el => {
        pieces.push({ id: i, position: el, pieceColor: bottomPlayer, pieceType: PieceType.KING });
        i++;
    });
    positionMap.get('King')?.map(el => { return { ...el, y: 8 } }).forEach(el => {
        pieces.push({ id: i, position: el, pieceColor: topPlayer, pieceType: PieceType.KING });
        i++;
    });
    return pieces;
}