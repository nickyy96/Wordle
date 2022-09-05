import { Dispatch, SetStateAction } from "react";

interface SettingsProps {
    hard: boolean
    setHard: Dispatch<SetStateAction<boolean>>
    light: boolean
    setLight: Dispatch<SetStateAction<boolean>>
    blind: boolean
    setBlind: Dispatch<SetStateAction<boolean>>
}

const Settings = ({hard, setHard, light, setLight, blind, setBlind}: SettingsProps) => {
    const toggleHard = () => {
        setHard(!hard)
    }
    
    const toggleDark = () => {
        let elt = document.getElementById('wordle-body')
        if (!light) elt.setAttribute('theme', 'light')
        else elt.setAttribute('theme', 'dark')
        setLight(!light)
    }
    const toggleColorblind = () => {
        let elt = document.getElementById('wordle-body')
        if (blind) elt.setAttribute('colorblind', 'off')
        else elt.setAttribute('colorblind', 'on')
        setBlind(!blind)
    }

    return (
        <>
            <h1 className='modal-header'>
                SETTINGS
            </h1>
            <section className='modal-section'>
                <div className="modal-examples">
                    <div className="socials-container">
                        <div className="settings-unit">
                            <div className="settings-module">
                                <div className="settings-large">Hard Mode</div>
                                <div className="settings-small">Any revealed hints must be used in subsequent guesses</div>
                            </div>
                            <label className="switch">
                                <input type="checkbox" onChange={toggleHard} checked={hard}/>
                                <span className="slider round"/>
                            </label>
                        </div>
                        <div className="settings-unit">
                            <div className="settings-module">
                                <div className="settings-large">Light Theme</div>
                            </div>
                            <label className="switch">
                                <input type="checkbox" onChange={toggleDark} checked={light}/>
                                <span className="slider round"/>
                            </label>
                        </div>
                        <div className="settings-unit">
                            <div className="settings-module">
                                <div className="settings-large">High Contrast Mode</div>
                                <div className="settings-small">For improved color vision</div>
                            </div>
                            <label className="switch">
                                <input type="checkbox" onChange={toggleColorblind} checked={blind}/>
                                <span className="slider round"/>
                            </label>
                        </div>
                    </div>
                </div>
            </section>
            <div className="modal-footer">
                <p></p>
            </div>
        </>
    )
}

export default Settings;
