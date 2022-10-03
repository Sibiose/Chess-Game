export const StatusBubble = (props: { status: boolean }) => {
    return (
        <div className="status-bubble" title={props.status ? 'In a game' : 'Connected'} style={{
            backgroundColor: props.status ? 'yellow' : 'green'
        }}></div>
    )
}