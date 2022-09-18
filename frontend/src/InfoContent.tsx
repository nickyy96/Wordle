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

const spinner = () => {
    document.getElementById('middle-small').classList.add('middle-rotate')
    document.getElementById('slices-small').classList.add('pie-chart-rotate')
    setTimeout(() => {
        document.getElementById('middle-small').classList.remove('middle-rotate')
        document.getElementById('slices-small').classList.remove('pie-chart-rotate')
    }, 1000)
}

const InfoContent = ({toggleSlow, setToggleSlow, toggleFast, setToggleFast, modal}: InfoContentProps) => {
    const errorWord = 'NICKY';
    const keyboardInput = 'QWERT';
    const keyboardIdxRef = useRef<number>(1);
    
    useEffect(() => {
        timerUpdateSlow(true)
        spinner();
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
                    <div className="example-unit">
                        <div className="pie-chart">
                            <svg className="pie-svg-small" viewBox="-1 -1 2 2" id="slices-small">
                                <path d="M 1 0 A 1 1 0 0 1 6.123233995736766e-17 1 L 0 0" className="path-1"></path>
                                <path d="M 6.123233995736766e-17 1 A 1 1 0 0 1 -0.9510565162951535 0.3090169943749475 L 0 0" className="path-2"></path>
                                <path d="M -0.9510565162951535 0.3090169943749475 A 1 1 0 0 1 -1 1.2246467991473532e-16 L 0 0" className="path-3"></path>
                                <path d="M -1 1.2246467991473532e-16 A 1 1 0 0 1 -0.8090169943749475 -0.587785252292473 L 0 0" className="path-4"></path>
                                <path d="M -0.8090169943749475 -0.587785252292473 A 1 1 0 0 1 0.8090169943749468 -0.587785252292474 L 0 0" className="path-5"></path>
                                <path d="M 0.8090169943749468 -0.587785252292474 A 1 1 0 0 1 1 -1.133107779529596e-15 L 0 0" className="path-6"></path>
                            </svg>
                            <div className="pie-middle-small" id="middle-small">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-trophy-fill" viewBox="0 0 16 16">
                                        <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p>New statistics display enhances user <strong>experience</strong>.</p>
                </div>
            </section>
            <div className="modal-footer" id="info-content">
                <p>I hope you enjoy :</p>
            </div>
        </>
    )

}

export default InfoContent;