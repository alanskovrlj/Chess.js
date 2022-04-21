import Board from "./board.js";
import Game from "./game.js";

export function listenEvents(root, callBack) {
  var movedPiece;
  root.addEventListener("dragstart", (e) => {
    if (e.target.tagName != "IMG") {
      e.preventDefault();
      return;
    }
    movedPiece = e.target;
    root.style.cursor = "pointer";
  });

  root.addEventListener("dragover", (e) => {
    root.style.cursor = "pointer";
    e.preventDefault();
  });


  root.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    if(e.target.tagName == "IMG") {
    } else {
      if (e.target.className == "greenCircle") {
        e.target.classList.remove("greenCircle");
      } else {
        e.target.className = "greenCircle";
      }
    }
  });
  

  root.addEventListener("drop", (e) => {
     let movedTo = e.target.tagName == "DIV" ? e.target : e.target.parentElement;

      callBack(movedTo, movedPiece);
  
  });
}

