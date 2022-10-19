
export const ConnectedTab = (props: { connected: boolean }) => {

    return (
        < div className='connected-tab' style={{ color: props.connected ? 'green' : 'red' }}>{props.connected ? 'CONNECTED' : 'NOT CONNECTED'}</div >
    )
}