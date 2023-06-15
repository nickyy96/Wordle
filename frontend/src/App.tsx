import { useEffect, useState } from "react";
import "./styles/App.scss";
import Stream from "./Stream";
import KeyboardContainer from "./KeyboardContainer";
import Modal from "./Modal";
import Board from "./Board";
import Header from "./Header";
import { ALPHABET, NUM_ROWS, URL, WORD_LENGTH } from "./utils/globals";

const loadInput = (): string[] => {
  let arr: string[] = [];
    if (localStorage.getItem('input') !== null)
        return JSON.parse(localStorage.getItem('input'))
    return arr;
}

const makeMap = (word: string) => {
  let tempWordMap = new Map();

  for (let idx = 0; idx < WORD_LENGTH; idx++) {
    let count = 1;
    let char = word.charAt(idx).toLocaleUpperCase()
    if (tempWordMap.has(char)) count = tempWordMap.get(char) + 1;
    tempWordMap.set(char, count);
  }

  return tempWordMap;
}

const App = () => {
  const [input, setInput] = useState<string[]>(loadInput());
  const [win, setWin] = useState(false);
  const [modal, setModal] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [word, setWord] = useState<string>("");
  const [wordMap, setWordMap] = useState<Map<string, number>>(new Map());
  const [hard, setHard] = useState<boolean>(localStorage.getItem('hard') === 'true');

  useEffect(() => {

    let check = localStorage.getItem('newUser');
    let toggle = localStorage.getItem('toggle');
    fetch(URL + "/api")
          .then((res) => {
              return res.json();
          }).then(data => {
              if (data.word === localStorage.getItem('wordle-word')) {
                if (localStorage.getItem('result') !== null) {
                  setWin(true)
                  if (toggle !== null) setModal(toggle)
                }
              } else {
                for(let idx = 0; idx < ALPHABET.length; idx++) {
                  localStorage.removeItem(ALPHABET.charAt(idx));
                }
                localStorage.removeItem('result')
                localStorage.removeItem('previous')
                localStorage.removeItem('previousColors')
                localStorage.removeItem('input')
                setInput([])
                localStorage.removeItem('knowledge')
              }

              if (check === null) {
                setModal('info')
                localStorage.setItem('newUser', 'no')
              }
          
              for (let idx = 0; idx <= NUM_ROWS; idx++) {
                if (idx == 0) {
                  let result = localStorage.getItem('losses');
                  if (result === null) {
                    localStorage.setItem('losses', JSON.stringify({num: 0}))
                  }
                } else {
                  let result = localStorage.getItem(`win${idx}`)
                  if (result === null) {
                    localStorage.setItem(`win${idx}`, JSON.stringify({num: 0}))
                  }
                }
              }
          
              let result = localStorage.getItem('streak');
              if (result === null) localStorage.setItem('streak', JSON.stringify({num: 0}))
          
              let previous = localStorage.getItem('previous');
              let input = localStorage.getItem('input');
              let breakout = true;
              if (previous !== null) {
                if (JSON.parse(previous).length > 0) {
                  let tempWord = localStorage.getItem('wordle-word')
                  setWord(tempWord)
                  setWordMap(makeMap(tempWord))
                  breakout = false;
                }
              } else if (input !== null) {
                if (JSON.parse(input).length > 0) {
                  let tempWord = localStorage.getItem('wordle-word')
                  setWord(tempWord)
                  setWordMap(makeMap(tempWord))
                  breakout = false;
                }
              }
              if (breakout) {
                setWord(data.word);
                setWordMap(makeMap(data.word));
                localStorage.setItem('wordle-word', data.word)
              }
          })

  }, [])

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

  if (word === "") return <div className="failed-fetch"></div>
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
        word={word}
        wordMap={wordMap}
      ></Board>
      <Modal
        showModal={modal !== ""}
        toggle={modal}
        modal={modal}
        setModal={setModal}
        hard={hard}
        setHard={setHard}
        win={win}
      ></Modal>
      <Stream messages={messages}></Stream>
      <KeyboardContainer />
    </>
  );
};

export default App;
