import { useState } from "react";
import "./styles/App.scss";
import Stream from "./Stream";
import KeyboardContainer from "./KeyboardContainer";
import Modal from "./Modal";
import Board from "./Board";
import Header from "./Header";

const App = () => {
  const [input, setInput] = useState<string[]>([]);
  const [win, setWin] = useState(false);
  const [modal, setModal] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [hard, setHard] = useState(false);

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
