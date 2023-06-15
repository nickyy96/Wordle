import { useEffect, useState } from "react";
import { WORD_LENGTH } from "./utils/globals";

interface ShareButtonProps {
  win: boolean;
}

const generateMessage = () => {
  const mapString = localStorage.getItem("previousColors");
  if (!mapString) return;

  let elt = document.getElementById("wordle-body");
  let theme = elt.getAttribute("theme");
  let colorblind = elt.getAttribute("colorblind");

  let blocks = ["⬜"];
  if (theme === "dark") blocks = ["⬛"];

  if (colorblind === "on") {
    blocks = blocks.concat(["🟦", "🟧"]);
  } else {
    blocks = blocks.concat(["🟨", "🟩"]);
  }

  const map: [][] = Array.from(JSON.parse(mapString));
  let message = ``;

  let i = 0;
  for (i; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      message += blocks[map[i][j]];
    }
    if (i < map.length - 1) message += "\n";
  }

  let loss = false;
  for (let k = 0; k < WORD_LENGTH; k++) {
    if (map[i - 1][k] != 2) loss = true;
  }

  let win = "🔥";
  if (i <= 4) win = win.concat("🔥");
  if (i <= 2) win = win.concat("🔥");
  if (i === 1) win = "💯💯💯";

  const now = new Date();
  const hour = now.getHours();
  const title = `Wordle ${hour + 1} of 24\n${loss ? "❌" : i}/6 ${
    loss ? "😢😢😢" : win
  }\n`;

  return title.concat(message);
};

const handleShare = () => {
  const message = generateMessage();
  if (!message) return;

  if (navigator.share) {
    navigator
      .share({
        title: "Nicky's Wordle Share",
        text: message,
      })
      .then(() => console.log("Shared successfully."))
      .catch((error) => console.error("Error sharing:", error));
  } else {
    console.log("Web Share API not supported.");
  }

  //   const url = `sms:&body=${encodeURIComponent(message)}`;
  //   window.location.href = url;
};

const ShareButton = ({ win }: ShareButtonProps) => {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  return (
    <>
      {isSafari && win && (
        <button className="share-button" onClick={handleShare}>
          <p>SHARE</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-share"
            viewBox="0 0 16 16"
          >
            <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
          </svg>
        </button>
      )}
    </>
  );
};

export default ShareButton;
