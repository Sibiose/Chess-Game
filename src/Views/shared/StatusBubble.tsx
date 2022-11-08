export const StatusBubble = ({ isConnected, hasRoom }: { isConnected: boolean, hasRoom:boolean }) => {

    let status:string = isConnected === true ? hasRoom ? 'In a game': 'Connected' : 'Player offline';
    return (
        <div className="status-bubble" title={status} style={{
            backgroundColor: isConnected === true ? hasRoom ? 'yellow' : 'green': 'red'
        }}></div>
    )
}