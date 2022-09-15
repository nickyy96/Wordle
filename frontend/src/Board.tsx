import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { HighlightPress } from "./KeyboardContainer";
import Row from "./Row";
import { ALPHABET, FLIP_LENGTH, NUM_ROWS, WORD, WORD_LENGTH, WORD_MAP } from "./utils/globals";
import { rowProps } from "./utils/types";
import { WORD_LIST } from "./utils/words";

interface BoardProps {
    messages: string[],
    setMessages: Dispatch<SetStateAction<string[]>>,
    input: string[],
    setInput: Dispatch<SetStateAction<string[]>>,
    win: boolean,
    setWin: Dispatch<SetStateAction<boolean>>,
    hard: boolean,
    setModal: Dispatch<SetStateAction<string>>,
}

const clearCache = () => {
    for(let idx = 0; idx < ALPHABET.length; idx++) {
        localStorage.removeItem(ALPHABET.charAt(idx));
    }
    localStorage.removeItem('previous')
    localStorage.removeItem('previousColors')
    localStorage.removeItem('input')
}

const loadKeys = (): Map<string, number> => {
    let baseMap = new Map<string, number>();
    for (let i = 0; i < ALPHABET.length; i++) {
        let currentChar = ALPHABET.charAt(i);
        let keyColor = localStorage.getItem(currentChar);

        if (keyColor !== 'unknown' && keyColor !== null) {
            let idx = 2;
            if (keyColor === 'absent') idx = 0
            else if (keyColor === 'present') idx = 1
            baseMap.set(currentChar, idx)
        }
    }
    return baseMap;
}

const loadPrevious = (): rowProps[] => {
    let arr: rowProps[] = [];
    if (localStorage.getItem('previous') !== null)
        return JSON.parse(localStorage.getItem('previous'))
    return arr;
}

const loadColors = (): number[][] => {
    let arr: number[][] = [];
    if (localStorage.getItem('previousColors') !== null) 
        return JSON.parse(localStorage.getItem('previousColors'))
    return arr
}

const Board = ({messages, setMessages, input, setInput, win, setWin, hard, setModal}: BoardProps) => {
    const previous = useRef<rowProps[]>(loadPrevious());
    const previousColors = useRef<number[][]>(loadColors());
    const curRowRef = useRef<number>(previous.current.length);
    const lock = useRef<boolean>(false);
    const keys = useRef<Map<string, number>>(loadKeys());
    const colors = ['absent', 'present', 'correct'];

    useEffect(() => {
        for (let i = 0; i < ALPHABET.length; i++) {
            let color = keys.current.get(ALPHABET.charAt(i))
            document.getElementById(ALPHABET.charAt(i)).setAttribute("data-state", `${colors[color]}`)
        }
        for (let rowIdx = 0; rowIdx < previous.current.length; rowIdx++) {
            for (let cellIndex = rowIdx * WORD_LENGTH, iterator = 0; 
                iterator < WORD_LENGTH; 
                cellIndex++, iterator++) {
                    let elt = document.getElementsByClassName('cell')[cellIndex];
                    elt.setAttribute("flip-wait", `${iterator}`);
                    setTimeout(() => elt.classList.add('flip-in'));

                    setTimeout(() => {
                        elt.setAttribute("flip-wait", '0');
                        elt.classList.add('flip-out');
                        elt.setAttribute("data-state", `${colors[previousColors.current[rowIdx][iterator]]}`)
                        setTimeout(() => {
                            elt.classList.remove('flip-in');
                            elt.classList.remove('flip-out');
                            elt.removeAttribute("flip-wait");
                        }, FLIP_LENGTH + 50);
                    }, FLIP_LENGTH * (iterator + 1))
            }
        }
        for (let idx = curRowRef.current * WORD_LENGTH; idx < curRowRef.current * WORD_LENGTH + input.length; idx++) {
            let elt = document.getElementsByClassName('cell')[idx];
            elt.classList.add('after-bubble');
        }
    }, [])

    const handleWin = (matches: number[]) => {
        if (matches.includes(0) || matches.includes(1)) return
        let waitIndex = 1;
        for (let i = (curRowRef.current - 1) * WORD_LENGTH; i < curRowRef.current * WORD_LENGTH; i++) {
            setTimeout(() => {
                let elt = document.getElementsByClassName('cell')[i];
                elt.setAttribute("bounce-wait", `${waitIndex}`);
                elt.setAttribute("animation-state", "win");

                waitIndex++;
            }, FLIP_LENGTH)
        }

        setTimeout(() => {
            let options = ['Spectacular!', 'Amazing!', 'Wonderful!', 'Genius!', 'Splendid!']
            setMessages([...messages, options[Math.floor(Math.random()*5)]])
            setTimeout(() => {
                let elt = document.getElementById('result-message');
                elt.classList.add('deleting');
                setTimeout(() => {
                    elt.remove()
                    setWin(true)
                    clearCache();
                    setModal('win')
                }, 195)
            }, 1500)
        }, 500)
    }

    const getColors = (key: string): string => {
        if (keys.current.has(key)) return colors[keys.current.get(key)];
        else return "unknown";
    }

    const updateKeys = (input: string[], colorsNew: number[]) => {
        for (let i = 0; i < WORD_LENGTH; i++) updateKey(input[i], colorsNew[i]);
        for (let i = 0; i < ALPHABET.length; i++) {
            let color = getColors(ALPHABET.charAt(i))
            document.getElementById(ALPHABET.charAt(i)).setAttribute("data-state", `${color}`)
        }

        handleWin(colorsNew);

        for (let i = 0; i < ALPHABET.length; i++) {
            let currentChar = ALPHABET.charAt(i)
            if (keys.current.get(currentChar) === undefined) localStorage.setItem(currentChar, 'unknown')
            else localStorage.setItem(currentChar, colors[keys.current.get(currentChar)])
        }
    }

    const updateKey = (key: string, value: number) => {
        if (keys.current.has(key) && keys.current.get(key) > value) return;
        keys.current = new Map([...keys.current, [key, value]]);
    }

    const setLock = () => {
        lock.current = true;
    }

    const getBefore = (map: Map<string, number[]>, char: string) => {
        if (map.has(char)) return map.get(char).length;
        else return 0;
    }

    const getAfter = (cellIndex: number, index: number, char: string) => {
        let count = 0;
        for (let idx = index + 1, cellIdx = cellIndex + 1; idx < WORD_LENGTH; idx++, cellIdx++) {
            if (WORD.charAt(idx).toLocaleUpperCase() === document.getElementsByClassName('cell')[cellIdx].textContent) {
                if (WORD.charAt(idx).toLocaleUpperCase() === char) count++;
            }
        }

        return count;
    }

    const handleInput = (e: KeyboardEvent) => {
        if (lock.current) return
        if (e.key === 'Enter') {
            HighlightPress(document.getElementById('enter'));
            if (previous.current.length > NUM_ROWS - 1) return
            if (input.length < WORD_LENGTH) return

            let inputWord = input.join("").toLocaleLowerCase();
            if (!WORD_LIST.includes(inputWord)) {
                handleWrongWord();
                return;
            }
            
            let keysInWord: string[] = [];
            let colorsInWord: number[] = [];
            let colors: string[] = ['absent', 'present', 'correct']
            let dictForWord: Map<string, number[]> = new Map<string, number[]>();
            let guess: string = "";
 
            for (let cellIndex = curRowRef.current * WORD_LENGTH, iterator = 0; 
                cellIndex < (curRowRef.current + 1) * WORD_LENGTH, iterator < WORD_LENGTH; 
                cellIndex++, iterator++) {
                    let elt = document.getElementsByClassName('cell')[cellIndex];
                    let color = 0;
                    let char = elt.textContent.toLocaleUpperCase();
                    if (char === WORD.toLocaleUpperCase().charAt(iterator)) color = 2;
                    else  if (WORD.toLocaleUpperCase().includes(char!)) {
                        if (getBefore(dictForWord, char) + getAfter(cellIndex, iterator, char) < WORD_MAP.get(char)) color = 1;
                        else color = 0;
                    }

                    colorsInWord.push(color)
                    keysInWord.push(char);

                    let numArr: number[] = [];
                    if (dictForWord.has(char)) numArr = dictForWord.get(char)
                    dictForWord.set(char, [...numArr, color])

                    if (hard) if (color < keys.current.get(elt.textContent) || (color === 0 && color === keys.current.get(elt.textContent))) {
                        handleWrongWord();
                        return;
                    }

                    guess += char;

                    if (iterator === WORD_LENGTH - 1) {
                        for (let idx = 0; idx < WORD_LENGTH; idx++) {
                            if (!(keys.current.has(keysInWord[idx]) && keys.current.get(keysInWord[idx]) > colorsInWord[idx])) 
                            keys.current = new Map([...keys.current, [keysInWord[idx], colorsInWord[idx]]]);
                        } 
                    }
            }

            if (hard) {
                for (let key of Array.from(keys.current.keys()).filter(key => keys.current.get(key) > 0)) {
                    if (!guess.includes(key)) 
                    {
                        handleWrongWord();
                        return;
                    }
                } 
            }

            for (let cellIndex = curRowRef.current * WORD_LENGTH, iterator = 0; 
                cellIndex < (curRowRef.current + 1) * WORD_LENGTH, iterator < WORD_LENGTH; 
                cellIndex++, iterator++) {
                    let elt = document.getElementsByClassName('cell')[cellIndex];
                    elt.setAttribute("flip-wait", `${iterator}`);
                    setTimeout(() => elt.classList.add('flip-in'));

                    setTimeout(() => {
                        elt.setAttribute("flip-wait", '0');
                        elt.classList.add('flip-out');
                        elt.setAttribute("data-state", `${colors[colorsInWord[iterator]]}`)
                        setTimeout(() => {
                            elt.classList.remove('flip-in');
                            elt.classList.remove('flip-out');
                            elt.removeAttribute("flip-wait");
                        }, FLIP_LENGTH + 50);
                    }, FLIP_LENGTH * (iterator + 1))
            }
            setTimeout(() => updateKeys(keysInWord, colorsInWord), FLIP_LENGTH * 5);

            if (previous.current.length === NUM_ROWS -1 ) {
                setMessages([...messages, WORD.toLocaleUpperCase()])
                setTimeout(() => {
                    let elt = document.getElementById('result-message');
                    elt.classList.add('deleting');
                    setTimeout(() => {
                        elt.remove()
                        setWin(true)
                        clearCache()
                        setModal('lose')
                    }, 195)
                }, 1500)
                return
            }

            previous.current = [...previous.current, {row: input, active: true}];
            previousColors.current = [...previousColors.current, colorsInWord]
            setInput([]);

            localStorage.setItem('previousColors', JSON.stringify(previousColors.current))
            localStorage.setItem('previous', JSON.stringify(previous.current));

            if (curRowRef.current === NUM_ROWS) curRowRef.current = 0;
            else curRowRef.current = curRowRef.current + 1;
        } else if (e.keyCode >= 65 && e.keyCode <= 90) {
            HighlightPress(document.getElementById(e.key.toLocaleUpperCase()));
            if (previous.current.length > NUM_ROWS - 1) return
            if (input.length === WORD_LENGTH) return

            setInput([...input, e.key])

            let eltIndex = curRowRef.current * WORD_LENGTH + input.length;
            let elt = document.getElementsByClassName('cell')[eltIndex];
            setTimeout(() => elt.classList.add('bubble', 'after-bubble'))
            setTimeout(() => elt.classList.remove('bubble'), 100)
        } else if (e.keyCode === 8) {
            HighlightPress(document.getElementById('backspace'));
            if (input.length === 0) return

            let eltIndex = curRowRef.current * WORD_LENGTH + input.length;
            let elt = document.getElementsByClassName('cell')[eltIndex - 1];
            setTimeout(() => elt.classList.remove('after-bubble'))
            
            let temp: string[] = input;
            temp.pop();
            setInput([...temp]);
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", handleInput)

        return () => {
            window.removeEventListener("keydown", handleInput)
        }
    }, [input, win, messages, hard])

    const process = (): rowProps[] => {
        const rows: rowProps[] = [...previous.current, {row: input, active: false}];
        for (let i = 0; i < NUM_ROWS - (previous.current.length + 1); i++) {
            rows.push({row: [], active: false});
        }
        return rows;
    }

    const handleWrongWord = () => {
        let row = document.getElementsByClassName("row")[curRowRef.current]
        
        for (let idx = 0; idx < WORD_LENGTH; idx++) {
            row.children[idx].classList.add('error')
            setTimeout(() => row.children[idx].classList.remove('error'), 700)
        }

        setMessages(['', ...messages])

        setTimeout(() => {
            let errors = document.getElementsByClassName('stream')[0];
            
            setTimeout(() => {
                errors.children[errors.children.length - 1].classList.add('deleting');
                setTimeout(() => errors.removeChild(errors.children[errors.children.length - 1]), 195)
            }
            , 1000)
        })
    }

    return (
        <div className='board-container'>
            <div className='board'>
                {
                    process().map((row, index) => {
                        return <Row row={row} key={index} setLock={setLock}></Row>
                    })
                }
            </div>
        </div>
    )
}

export default Board
