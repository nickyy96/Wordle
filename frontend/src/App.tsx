import { useEffect, useState } from "react";
import "./styles/App.scss";
import Stream from "./Stream";
import KeyboardContainer from "./KeyboardContainer";
import Modal from "./Modal";
import Board from "./Board";
import Header from "./Header";

const loadInput = (): string[] => {
  let arr: string[] = [];
    if (localStorage.getItem('input') !== null)
        return JSON.parse(localStorage.getItem('input'))
    return arr;
}

const App = () => {
  const [input, setInput] = useState<string[]>(loadInput());
  const [win, setWin] = useState(false);
  const [modal, setModal] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [hard, setHard] = useState<boolean>(localStorage.getItem('hard') === 'true');

  useEffect(() => {
    let value = 'false';
    if (hard) value = 'true'
    localStorage.setItem('hard', value)
  }, [hard])

  useEffect(() => {
    localStorage.setItem('input', JSON.stringify(input))
  }, [input])

  useEffect(() => {
    let elt = document.getElementById('wordle-body')
    if (localStorage.getItem('theme') !== null) elt.setAttribute('theme', localStorage.getItem('theme'))
    else elt.setAttribute('theme', 'dark')

    if (localStorage.getItem('colorBlind') !== null) elt.setAttribute('colorblind', localStorage.getItem('colorBlind'))
    else elt.setAttribute('colorblind', 'off')
  }, [])

  return (
    <>
      <Header setModal={setModal} hard={hard}></Header>
      <Board
        messages={messages}
        setMessages={setMessages}
        input={input}
        setInput={setInput}
        win={win}
        setWin={setWin}
        hard={hard}
        setModal={setModal}
      ></Board>
      <Modal
        showModal={modal !== ""}
        toggle={modal}
        modal={modal}
        setModal={setModal}
        hard={hard}
        setHard={setHard}
      ></Modal>
      <Stream messages={messages}></Stream>
      <KeyboardContainer />
    </>
  );
};

export default App;
