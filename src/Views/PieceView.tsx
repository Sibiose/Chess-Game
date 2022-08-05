import { useDrag, DragPreviewImage } from "react-dnd";
import { ChessGame } from "../Model/Board";

export const PieceView = (props: { src: string, index: number }) => {
    let { src, index } = props;
    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: 'piece', item: { index },

        collect: (monitor) => {
            return {
                isDragging: !!monitor.isDragging(),
            }
        }

    }))

    let pieceStyle = { opacity: isDragging ? 0.2 : 1 }



    return (
        <>
            <DragPreviewImage connect={preview} src={src} />
            <img  ref={drag} style={pieceStyle} className="piece-img" src={src} alt="" />
        </>)

}

