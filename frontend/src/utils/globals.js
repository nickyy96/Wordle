import { WORD_LIST } from "./words";

export const NUM_ROWS = 6;
export const WORD_LENGTH = 5;
export const WORD = WORD_LIST[Math.floor(Math.random()*WORD_LIST.length)];
// export const WORD = 'cacao'
export const ALPHABET = "QWERTYUIOPASDFGHJKLZXCVBNM"
export const FLIP_LENGTH = 250;

let WORD_MAP_TEMP = new Map();
for (let idx = 0; idx < WORD.length; idx++) {
    let count = 1;
    let char = WORD.charAt(idx).toLocaleUpperCase()
    if (WORD_MAP_TEMP.has(char)) count = WORD_MAP_TEMP.get(char) + 1;
    WORD_MAP_TEMP.set(char, count)
}

export const WORD_MAP = WORD_MAP_TEMP;
