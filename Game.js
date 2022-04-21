import Board from "./Board.js";
import { listenEvents } from "./eventHandler.js";

class Game {
  constructor(root) {
    this.board = new Board(root);
    this.playerTurn = "white";
    // Start listening on Game Start
     listenEvents(root, (targetSquare, pieceMoved) => {
      this.handleDrag(pieceMoved, targetSquare);
    });
  }

  

  handleDrag(pieceMoved, toSquare) {
    console.log(this.playerTurn);
    if(pieceMoved.getAttribute("team") != this.playerTurn) return false;
    const fromSquare = pieceMoved.parentElement;
    if (pieceMoved.getAttribute("name").includes("Pawn")) {
      const [name, index] = this.formatPawnName(pieceMoved);
      this.board[name][index].move(fromSquare, toSquare);
    } else {
      pieceMoved = this.board[pieceMoved["name"]];
    console.log("handle");
      pieceMoved.move(fromSquare, toSquare);
    }
    
  }

  formatPawnName(pawn) {
    if (pawn["name"].includes("Pawn")) {
      let index = pawn["name"].slice(-1);
      let name = pawn["name"].slice(0, -1);
      return [name, index];
    }
  }
}

export default Game;
