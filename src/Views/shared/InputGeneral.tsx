import { useState } from 'react'

export const InputTextView = (props: { label: string, disabled?: boolean, setInput: (input: string) => void }) => {
    return (
        <div className="general-text-input">
            <label>{props.label}</label>
            <input disabled={props.disabled ? true : false} maxLength={40} placeholder={`Choose a ${props.label}`} type="text" onChange={(e) => props.setInput(e.target.value ?? "")} />
        </div>
    )
}

export const InputRadioView = (props: { label: string, value1: string, value2: string, inputState: boolean, setInputState: (state: boolean) => void }) => {
    let { inputState, setInputState } = props;

    return (
        <div className="general-radio-input">
            <label>{props.label}</label>
            <div className="radio-input-container">
                <div>
                    <label>{props.value1}</label>
                    <input type="radio" checked={!inputState} onChange={() => { setInputState(false) }} />
                </div>
                <div>
                    <label>{props.value2}</label>
                    <input type="radio" checked={inputState} onChange={() => { setInputState(true) }} />
                </div>
            </div>
        </div>
    )
}