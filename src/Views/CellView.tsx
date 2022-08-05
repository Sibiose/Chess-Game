import { ChessGame } from "../Model/Board";
import { Cell, indexToPosition } from "../Model/Cell";
import { PieceView } from "./PieceView";
import { useDrop } from "react-dnd";

export const CellView = (props: { index: number, game: ChessGame }) => {
    let { game, index } = props;
    let cell: Cell = game.cells[props.index]
    let [x, y] = indexToPosition(index);
    let imgSrc = `../../Pieces/${cell.pieceType}-${cell.pieceColor}.svg`

    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: 'piece',
        drop: (item: { index: number }) => {
            game.move(item.index, index);
            game.switchPlayer()
        },
        canDrop: (item: { index: number }) => game.canMove(item.index, index),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop()
        }),

    }), [game])

    return (
        <div style={isOver ? { backgroundColor: 'yellow' } : {}} ref={drop} className={(x + y) % 2 === 0 ? "chess-cell dark-chess-cell" : "chess-cell"}>
            {cell.pieceType && <PieceView index={index} src={imgSrc} />}
            {isOver && !canDrop && <CellOverlay color={'red'} />}
            {!isOver && canDrop && <CellOverlay color={'yellow'} />}
            {isOver && canDrop && <CellOverlay color={'green'} />}
        </div>

    )
}

export const CellOverlay = (props: { color: string }) => {
    let color = props.color;
    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                zIndex: 1,
                opacity: 0.6,
                backgroundColor: `${color}`,
            }}
        />
    )
}





