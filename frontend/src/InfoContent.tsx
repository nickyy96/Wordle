import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { WORD_LENGTH } from "./utils/globals";

interface InfoContentProps {
    toggleSlow: boolean
    setToggleSlow: Dispatch<SetStateAction<boolean>>
    toggleFast: boolean
    setToggleFast: Dispatch<SetStateAction<boolean>>
    modal: string
}

const timerUpdateSlow = (flipper: boolean) => {
    try {
        for (let idx = 0; idx < WORD_LENGTH; idx++) {
            if (flipper) document.getElementById(`red-shake-modal${idx}`).classList.add('error')
            else document.getElementById(`red-shake-modal${idx}`).classList.remove('error')
        }
    } catch(e) {}
}

const timerUpdateFast = (previous: number): number => {
    for (let idx = 0; idx < WORD_LENGTH; idx++) {
        document.getElementById(`red-fill-modal${idx}`).classList.remove('key-highlight')
    }
    let randomIdx = Math.floor(Math.random()*(WORD_LENGTH));
    while (randomIdx === previous) randomIdx = Math.floor(Math.random()*(WORD_LENGTH));
    document.getElementById(`red-fill-modal${randomIdx}`).classList.add('key-highlight')
    return randomIdx
}

const InfoContent = ({toggleSlow, setToggleSlow, toggleFast, setToggleFast, modal}: InfoContentProps) => {
    const errorWord = 'NICKY';
    const keyboardInput = 'QWERT';
    const keyboardIdxRef = useRef<number>(1);
    
    useEffect(() => {
        timerUpdateSlow(true)
        setTimeout(() => {
            timerUpdateSlow(false)
        }, 2000)
        setTimeout(() => {
            setToggleSlow(!toggleSlow)
        }, 3000)
    }, [toggleSlow])

    useEffect(() => {
        keyboardIdxRef.current = timerUpdateFast(keyboardIdxRef.current)
        setTimeout(() => setToggleFast(!toggleFast), 200)
    }, [toggleFast])

    return (
        <>
            <h1 className='modal-header'>
                NEW FEATURES
            </h1>
            <section>
                <p>You know the rules: guess the <strong>WORDLE</strong> in 6 tries.</p>
                <p>Enjoy some upgrades at the hands of a novice software engineer.</p>
                <div className="modal-examples">
                    <p><strong>Features</strong></p>
                    <div className="example-unit">
                        {errorWord.split("").map((letter, index) => {
                            return (
                                <div className="cell modal-cell" id={`red-shake-modal${index}`} key={index}>
                                    {letter}
                                </div>
                            )
                        })}
                    </div>
                    <p>New error handling makes <strong>errors</strong> clearer to the user.</p>
                    <div className="example-unit">
                        {keyboardInput.split("").map((letter, index) => {
                            return (
                                <div className="key modal-key" id={`red-fill-modal${index}`} key={index}>
                                    {letter}
                                </div>
                            )
                        })}
                    </div>
                    <p>New key highlighting makes <strong>typing</strong> more immersive.</p>
                </div>
            </section>
            <div className="modal-footer" id="info-content">
                <p>I hope you enjoy :</p>
            </div>
        </>
    )

}

export default InfoContent;