import { ALPHABET } from "./utils/globals"

export const HighlightPress = (elt: HTMLElement) => {
    elt.classList.add('key-highlight');
    setTimeout(() => elt.classList.remove('key-highlight'), 100)
}

const KeyboardContainer = () => {
    return (
        <div className="keyboard-container">
            <div className="keyboard-row">
                {
                    ALPHABET.substring(0, 10).split("").map(key => {
                        return (
                            <button className="key" id={key} key={key}>
                                {key}
                            </button>
                        )
                    })
                }
            </div>
            <div className="keyboard-row">
                <div className="key-half" id="spacer1"/>
                {
                    ALPHABET.substring(10,19).split("").map(key => {
                        return (
                            <button className="key" id={key} key={key}>
                                {key}
                            </button>
                        )
                    })
                }
                <div className="key-half" id="spacer2"/>
            </div>
            <div className="keyboard-row" key='bottom-row'>
                <button className="key key-one-and-a-half" id='enter'>ENTER</button>
                {
                    ALPHABET.substring(19).split("").map(key => {
                        return (
                            <button className="key" id={key} key={key}>
                                {key}
                            </button>
                        )
                    })
                }
                <button className="key key-one-and-a-half" id='backspace'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default KeyboardContainer
