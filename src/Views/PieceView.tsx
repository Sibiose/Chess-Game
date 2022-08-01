import { useDrag, DragPreviewImage } from "react-dnd";
import { Piece } from "../Model/Piece";




export const PieceView = (props: { src: string, piece: Piece|undefined }) => {
    let piece = props.piece
    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: 'piece', item: { piece },

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

