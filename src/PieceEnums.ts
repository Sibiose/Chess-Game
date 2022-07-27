import { Coordonate } from "./Cell";

export enum PlayerColors {
    DARK = 'Dark',
    LIGHT = 'Light'
}

export enum PieceType {
    PAWN = 'Pawn',
    KING = 'King',
    QUEEN = 'Queen',
    ROOK = 'Rook',
    KNIGHT = 'Knight',
    BISHOP = 'Bishop',
}

export const createImgSrcMap = (): Map<string, string> => {

    const imgSrcMap: Map<string, string> = new Map<string, string>()
    imgSrcMap.set('LightPawn', `../../Pieces/pawn-light.svg`);
    imgSrcMap.set('DarkPawn', `../../Pieces/pawn-dark.svg`);
    imgSrcMap.set('LightRook', '../../Pieces/rook-light.svg');
    imgSrcMap.set('DarkRook', '../../Pieces/rook-dark.svg');
    imgSrcMap.set('LightKnight', '../../Pieces/knight-light.svg');
    imgSrcMap.set('DarkKnight', '../../Pieces/knight-dark.svg');
    imgSrcMap.set('LightBishop', '../../Pieces/bishop-light.svg');
    imgSrcMap.set('DarkBishop', '../../Pieces/bishop-dark.svg');
    imgSrcMap.set('LightQueen', '../../Pieces/queen-light.svg');
    imgSrcMap.set('DarkQueen', '../../Pieces/queen-dark.svg');
    imgSrcMap.set('LightKing', '../../Pieces/king-light.svg');
    imgSrcMap.set('DarkKing', '../../Pieces/king-dark.svg');

    return imgSrcMap;
}

export const createDefaultPositionsMap = (): Map<string, Coordonate[]> => {
    let starterPositionMap = new Map<string, Coordonate[]>()
    starterPositionMap.set('Pawn', [{ x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 6, y: 2 }, { x: 7, y: 2 }, { x: 8, y: 2 }]);
    starterPositionMap.set('Rook', [{ x: 1, y: 1 }, { x: 8, y: 1 }]);
    starterPositionMap.set('Knight', [{ x: 2, y: 1 }, { x: 7, y: 1 }]);
    starterPositionMap.set('Bishop', [{ x: 3, y: 1 }, { x: 6, y: 1 }]);
    starterPositionMap.set('Queen', [{ x: 4, y: 1 }]);
    starterPositionMap.set('King', [{ x: 5, y: 1 }]);

    return starterPositionMap;
}

