import { useDrag, DragPreviewImage } from "react-dnd";
import { Cell } from "../Model/Cell";

export const PieceView = (props: { src: string, cell: Cell }) => {
    let cell = props.cell
    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: 'piece', item: { lastCell: cell },

        collect: (monitor) => {
            return {
                isDragging: !!monitor.isDragging(),
            }
        }

    }))
    let pieceStyle = { opacity: isDragging ? 0 : 1 }



    return (
        <>
            <DragPreviewImage connect={preview} src={props.src} />
            <img ref={drag} style={pieceStyle} className="piece-img" src={props.src} alt="" />
        </>)

}

