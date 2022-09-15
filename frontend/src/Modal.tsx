import { Dispatch, SetStateAction, useState } from "react";
import InfoContent from "./InfoContent";
import PersonalContent from "./PersonalContent";
import Settings from "./Settings";
import Result from "./Result";

interface ModalProps {
  showModal: boolean;
  toggle: string;
  modal: string;
  setModal: Dispatch<SetStateAction<string>>;
  hard: boolean;
  setHard: Dispatch<SetStateAction<boolean>>;
}

const loadBlind = () => {
  let stored = localStorage.getItem('colorBlind')
  if (stored === 'on') return true
  return false
}

const loadLight = () => {
  let stored = localStorage.getItem('theme')
  if (stored === 'light') return true
  return false
}

const Modal = ({ showModal, toggle, modal, setModal, hard, setHard }: ModalProps) => {
  const [toggleSlow, setToggleSlow] = useState(false);
  const [toggleFast, setToggleFast] = useState(false);
  const [light, setLight] = useState(loadLight());
  const [blind, setBlind] = useState(loadBlind());

  const close = () => setModal("");
  return (
    <>
      {showModal && (
        <div className="modal-background" onClick={close}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
                {
                    toggle === 'info' && 
                    <InfoContent
                        toggleSlow={toggleSlow}
                        setToggleSlow={setToggleSlow}
                        toggleFast={toggleFast}
                        setToggleFast={setToggleFast}
                        modal={modal}
                    />
                }
                {
                    toggle === 'personal' &&
                    <PersonalContent/>
                }
                {
                    toggle === 'settings' &&
                    <Settings hard={hard} setHard={setHard} light={light} setLight={setLight} blind={blind} setBlind={setBlind}></Settings>
                }
                {
                    toggle === 'win' &&
                    <Result win={true}/>
                }
                {
                    toggle === 'lose' &&
                    <Result win={false}/>
                }
            </div>
            {(modal !== 'win' && modal !== 'lose') &&
                <button className="close-modal" onClick={close}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                    </svg>
                </button>
            }
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
