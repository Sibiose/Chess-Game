import { useState } from "react"

export const RequestUsernameView = (props: { setUsername: (username: string) => void }) => {
    let { setUsername } = props;
    const [usernameInput, setUsernameInput] = useState('');

    const enterUsername = (username: string) => {
        if (username !== "") {
            setUsername(username);
        }
    }


    return (
        <div id="requestUsernameView">
            <h2 className="username-header">Please enter your username!</h2>
            <input className="username-input" onKeyDown={(e) => { if (e.key === "Enter") enterUsername(usernameInput) }} type="text" onChange={(e) => { setUsernameInput(e.target.value ?? "") }} />
        </div>
    )
}