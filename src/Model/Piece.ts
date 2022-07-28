import { createDefaultPositionsMap, PieceType, PlayerColors } from "./PieceEnums";
import { Coordonate } from './Cell'

export interface Piece {
    position: Coordonate;
    pieceType: PieceType;
    pieceColor: PlayerColors;
}

export const createDefaultPieces = (bottomPlayer: PlayerColors): Piece[] => {
    let pieces: Piece[] = [];
    let topPlayer: PlayerColors = bottomPlayer === PlayerColors.LIGHT ? PlayerColors.DARK : PlayerColors.LIGHT;

    const positionMap: Map<string, Coordonate[]> = createDefaultPositionsMap();

    positionMap.get('Pawn')?.forEach(el => {
        pieces.push({ position: el, pieceColor: bottomPlayer, pieceType: PieceType.PAWN })
    });
    positionMap.get('Pawn')?.map(el => { return { ...el, y: 7 } }).forEach(el => {
        pieces.push({ position: el, pieceColor: topPlayer, pieceType: PieceType.PAWN })
    });
    positionMap.get('Rook')?.forEach(el => {
        pieces.push({ position: el, pieceColor: bottomPlayer, pieceType: PieceType.ROOK })
    });
    positionMap.get('Rook')?.map(el => { return { ...el, y: 8 } }).forEach(el => {
        pieces.push({ position: el, pieceColor: topPlayer, pieceType: PieceType.ROOK })
    });
    positionMap.get('Knight')?.forEach(el => {
        pieces.push({ position: el, pieceColor: bottomPlayer, pieceType: PieceType.KNIGHT })
    });
    positionMap.get('Knight')?.map(el => { return { ...el, y: 8 } }).forEach(el => {
        pieces.push({ position: el, pieceColor: topPlayer, pieceType: PieceType.KNIGHT })
    });
    positionMap.get('Bishop')?.forEach(el => {
        pieces.push({ position: el, pieceColor: bottomPlayer, pieceType: PieceType.BISHOP })
    });
    positionMap.get('Bishop')?.map(el => { return { ...el, y: 8 } }).forEach(el => {
        pieces.push({ position: el, pieceColor: topPlayer, pieceType: PieceType.BISHOP })
    });
    positionMap.get('Queen')?.forEach(el => {
        pieces.push({ position: el, pieceColor: bottomPlayer, pieceType: PieceType.QUEEN })
    });
    positionMap.get('Queen')?.map(el => { return { ...el, y: 8 } }).forEach(el => {
        pieces.push({ position: el, pieceColor: topPlayer, pieceType: PieceType.QUEEN })
    });
    positionMap.get('King')?.forEach(el => {
        pieces.push({ position: el, pieceColor: bottomPlayer, pieceType: PieceType.KING })
    });
    positionMap.get('King')?.map(el => { return { ...el, y: 8 } }).forEach(el => {
        pieces.push({ position: el, pieceColor: topPlayer, pieceType: PieceType.KING })
    });

    return pieces;
}