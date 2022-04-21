import { King, Queen, Bishop, Rook, Pawn, Knight } from "./Piece.js";

class Board {
  constructor(board) {
    this.drawBoard(board);
    // Create white pieces
    this.wRook = new Rook("wRook", "white", [0, 0], "./assets/wR.svg");
    this.wRook2 = new Rook("wRook2", "white", [7,0], "./assets/wR.svg");
    this.wKnight = new Knight("wKnight", "white", [1,0], "./assets/wN.svg");
    this.wKnight2 = new Knight("wKnight2", "white", [6,0], "./assets/wN.svg");
    this.wBishop = new Bishop("wBishop", "white", [2,0], "./assets/wB.svg");
    this.wBishop2 = new Bishop("wBishop2", "white", [5,0], "./assets/wB.svg");
    this.wQueen = new Queen("wQueen", "white", [3,0], "./assets/wQ.svg");
    this.wKing = new King("wKing", "white", [4,0], "./assets/wK.svg");
    this.wPawn = [];
    for (let i = 0; i < 8; i++) {
      this.wPawn[i] = new Pawn("wPawn" + i, "white", [i, 1], "./assets/wP.svg");
    }

    // Create black
    this.bRook = new Rook("bRook", "black", [0,7], "./assets/bR.svg");
    this.bRook2 = new Rook("bRook2", "black", [7, 7], "./assets/bR.svg");
    this.bKnight = new Knight("bKnight", "black", [1,7], "./assets/bN.svg");
    this.bKnight2 = new Knight("bKnight2", "black", [6,7], "./assets/bN.svg");
    this.bBishop = new Bishop("bBishop", "black", [2,7], "./assets/bB.svg");
    this.bBishop2 = new Bishop("bBishop2", "black", [5,7], "./assets/bB.svg");
    this.bQueen = new Queen("bQueen", "black", [3,7], "./assets/bQ.svg");
    this.bKing = new King("bKing", "black", [4,7], "./assets/bK.svg");
    this.bPawn = [];
    for (let i = 0; i < 8; i++) {
      this.bPawn[i] = new Pawn("bPawn" + i, "black", [i, 6], "./assets/bP.svg");
    }
  }



  drawBoard(board) {
    console.log("New board created");
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        var el = document.createElement("div");
        board.appendChild(el);

        // Color them
        if (i % 2 == 0) {
          j % 2 == 0 && (el.style.backgroundColor = "burlywood");
        } else {
          j % 2 == 1 && (el.style.backgroundColor = "burlywood");
        }
        // Set Pos
        el.setAttribute("x", j);
        el.setAttribute("y", i);
      }
    }
  }
}

export default Board;
