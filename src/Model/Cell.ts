import { Piece } from "./Piece";

export interface Coordonate {
    x: number;
    y: number;
}

export interface Cell {
    position: Coordonate;
    piece?: Piece | undefined;
}
