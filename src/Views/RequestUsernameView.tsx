import { useState } from "react"
import { onCreatePlayer, onUpdatePlayer } from "../api/Server";
import { PlayerDto } from "../api/Server.dto";

export const RequestUsernameView = (props: { players: PlayerDto[], setUsername: (username: string) => void }) => {
    let { setUsername, players } = props;
    const [usernameInput, setUsernameInput] = useState('');
    const [playerExists, setplayerExists] = useState<boolean>(false);
    const [wrongInput, setWrongInput] = useState<boolean>(false);

    const enterUsername = (username: string) => {
        let existingPlayer = players.find(player => player.username === username);
        if (username === "") {
            setWrongInput(true);
            return
        } else if (existingPlayer) {
            setplayerExists(true);
            return
        } else {
            setUsername(username);
            onCreatePlayer(username);
        }
    }


    return (
        <div id="requestUsernameView">
            <h2 className="username-header">Please enter your username!</h2>
            <input className="username-input" onKeyDown={(e) => { if (e.key === "Enter") enterUsername(usernameInput) }} type="text" onChange={(e) => { setUsernameInput(e.target.value ?? "") }} />
            {wrongInput || playerExists ? <p className="input-error username-error">{wrongInput ? 'Please choose a correct username' : playerExists ? 'Username already taken' : null}</p> : null}
        </div>
    )
}