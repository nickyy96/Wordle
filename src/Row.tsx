import { Dispatch, SetStateAction, useRef } from "react";
import { WORD, WORD_LENGTH } from "./utils/globals";
import { rowProps } from "./utils/types";

interface inputRowProps {
  row: rowProps
  setLock: () => void
}

const Row = ({ row, setLock }: inputRowProps) => {
  const lockRef = useRef(true);
  
  const padding = (input: string[]) => {
    let ret: string[] = input;

    for (let i = 0; i < WORD_LENGTH - input.length; i++) {
      ret = [...ret, ""];
    }

    return ret;
  };

  const empty: string[] = [];
  for (let i = 0; i < WORD_LENGTH; i++) {
    empty.push("");
  }

  return (
    <div className="row">
      {row.row.length === 0
        ? empty.map((letter, index) => {
            return (
              <div className="cell" key={index}>
                {letter}
              </div>
            );
          })
        : padding(row.row).map((letter, index) => {
            if (row.active) {
              if (letter === WORD.charAt(index)) {
                if (index + 1 === WORD_LENGTH && lockRef.current) setLock()
              } 
              else lockRef.current = false;
            } 
            return (
              <div className="cell" key={index}>
                {letter.toLocaleUpperCase()}
              </div>
            );
          })}
    </div>
  );
};

export default Row;
