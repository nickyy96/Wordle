import express from 'express';
import cors from 'cors';
import { WORD_LIST } from '../utils/words.js';

const app = express();

const d = new Date();
let hour = d.getHours();
let word = WORD_LIST[Math.floor(Math.random()*WORD_LIST.length)];

app.use(cors({
  origin: '*'
}));

const PORT = 8080;

app.get("/api", (req, res) => {
  const newDate = new Date();
  if (newDate.getHours() != hour) {
    hour = newDate.getMinutes();
    word = WORD_LIST[Math.floor(Math.random()*WORD_LIST.length)];
  }
  console.log(word);
  res.json({ word: word });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});