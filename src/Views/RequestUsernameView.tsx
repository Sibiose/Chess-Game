import { useState } from "react"
import { onCreatePlayer } from "../api/Server";
import { PlayerDto } from "../api/Server.dto";

export const RequestUsernameView = (props: { players: PlayerDto[] }) => {
    let { players } = props;
    const [username, setUsername] = useState<string>('');
    const [wrongInput, setWrongInput] = useState<boolean>(false);
    let playerExists = players.find(player => player.username === username) ? true : false;

    const enterUsername = (username: string) => {
        if (username === '') setWrongInput(true);
        else {
            setWrongInput(false);
            onCreatePlayer(username);
        }
    }

    return (
        <div id="requestUsernameView">
            <h2 className="username-header">Please enter your username!</h2>
            <input className="username-input" onKeyDown={(e) => { if (e.key === "Enter" && !playerExists) enterUsername(username) }} type="text" onChange={(e) => { setUsername(e.target.value ?? "") }} />
            {wrongInput || playerExists ? <p className="input-error username-error">{wrongInput ? 'Please choose a correct username' : playerExists ? 'Username already taken' : null}</p> : null}
        </div>
    )
}