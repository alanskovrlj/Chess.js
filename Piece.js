import Game from "./Chess.js";
import Board from "./Board.js";

class Piece {
  constructor(name, team, pos, img) {
    this.name = name;
    this.team = team;
    this.pos = pos;
    this.img = img;
    this.el = this.createElement();
    this.move = this.move;
    this.el.addEventListener("contextmenu", (e) => {
      this.getAvailablePositions(this.pos);
    });
  }

  createElement() {
    let square = document.querySelector(
      `[x="${this.pos[0]}"][y="${this.pos[1]}"]`
    );
    square.setAttribute("piece", this.name);
    let imgEl = document.createElement("img");
    imgEl.setAttribute("draggable", "true");
    imgEl.setAttribute("src", this.img);
    imgEl.setAttribute("name", this.name);
    imgEl.setAttribute("team", this.team);
    square.appendChild(imgEl);
    return imgEl;
  }

  stillCheck(from, to) {
    if (!Game.board.wKing.check && !Game.board.bKing.check) return false;

    // Try make move and return false if invalid
    this.pos = this.getPosition(to);
    to.appendChild(this.el);
    // Invalid move
    if (Game.board.wKing.underCheck() || Game.board.bKing.underCheck()) {
      this.pos = this.getPosition(from);
      from.appendChild(this.el);
      if (val.length > 0) val[0].appendChild(val[1]);
      return true;
    }
  }

  asignPiece(from, to) {
    from.removeAttribute("piece");
    to.appendChild(this.el);
    to.setAttribute("piece", this.name);
    this.pos = this.getPosition(to);
    this.changeTurn();
  }

  changeTurn() {
    if (Game.playerTurn == "white") {
      Game.playerTurn = "black";
    } else {
      Game.playerTurn = "white";
    }
  }

  leadsToCheck(from, to,val) {
    this.pos = this.getPosition(to);
    to.appendChild(this.el);
    if (
      (this.team == "white" && Game.board.wKing.underCheck()) ||
      (this.team == "black" && Game.board.bKing.underCheck())
    ) {
      this.pos = this.getPosition(from);
      from.appendChild(this.el);
      if (val.length > 0) val[0].appendChild(val[1]);
      return true;
    }
  }

  validateCheck(from, to,val) {
    if (this.stillCheck(from, to)) return false;
    if (this.leadsToCheck(from, to,val)) return false;
    return true;
  }


  gameOver(wCheck,bCheck) {
   let b =  Game.board.bKing.checkmate();
   if(!b) b = Game.board.wKing.checkmate();
   if(b) {
    console.log(" Checkmated");
    Game.playerTurn = "whiteWon";
     setTimeout(() => {
       alert("whiteWon");
     }, 100);
   } 

  }

  // MAIN MOVE
  move(from, to) {
    var val = this.validateMove(from, to);
    if (val === false) return false;
    if (this.stillCheck(from, to)) return false;
    if (!this.validateCheck(from, to,val)) return false;
    this.asignPiece(from, to);

    let w = Game.board.wKing.underCheck();
    let b = Game.board.bKing.underCheck();
    if(b || w) this.gameOver(); 

  }


  validateMove(fromSquare, toSquare) {
    let toPosition = this.getPosition(toSquare);
    let fromPosition = this.getPosition(fromSquare);
    var validMoves = this.getAvailablePositions(fromPosition);
    if (
      validMoves.find((p) => {
        return p[0] == toPosition[0] && p[1] == toPosition[1];
      })
    ) {
      var a = document.querySelector(
        `[x="${toPosition[0]}"][y="${toPosition[1]}"]`
      );
      if (
        a.hasChildNodes() &&
        a.childNodes[0].getAttribute("team") != this.team
      ) {
        let a = this.capture(toSquare);
        return a;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  capture(square) {
    let child = square.childNodes[0];
    child.remove();
    return [square, child];
  }

  formatPawnName(pawn) {
    if (pawn.includes("Pawn")) {
      let index = pawn.slice(-1);
      let name = pawn.slice(0, -1);
      return [name, index];
    } else return pawn;
  }

  // Get start end positions
  getPosition(square) {
    var pos = [
      parseInt(square.getAttribute("x")),
      parseInt(square.getAttribute("y")),
    ];
    return pos;
  }

  delete() {
    this.el.remove();
  }
}

export { Piece };

class Knight extends Piece {
  constructor(name, team, pos, img) {
    super(name, team, pos, img);
  }

  getAvailablePositions(my) {
    let x = parseInt(my[0]);
    let y = parseInt(my[1]);
    var pos = [
      [x - 2, y - 1],
      [x - 2, y + 1],
      [x - 1, y - 2],
      [x - 1, y + 2],
      [x + 1, y - 2],
      [x + 1, y + 2],
      [x + 2, y - 1],
      [x + 2, y + 1],
    ];
    pos = pos.filter((it) => {
      var a = document.querySelector(`[x="${it[0]}"][y="${it[1]}"]`);
      if (!a) return false;
      if (
        a.hasChildNodes() &&
        a.childNodes[0].getAttribute("team") == this.team
      ) {
        return false;
      }

      if (it[0] >= 0 && it[0] < 8 && it[1] >= 0 && it[1] < 8) {
        return it;
      }
    });
    return pos;
  }
}

class Pawn extends Piece {
  constructor(name, team, pos, img) {
    super(name, team, pos, img);
  }
  getAvailablePositions(my) {
    let x = parseInt(my[0]);
    let y = parseInt(my[1]);
    if (this.team == "black") {
      if (y == 6) {
        var pos = [
          [x, y - 1],
          [x, y - 2],
        ];
      } else {
        var pos = [[x, y - 1]];
      }
    } else {
      if (y == 1) {
        var pos = [
          [x, y + 1],
          [x, y + 2],
        ];
      } else {
        var pos = [[x, y + 1]];
      }
    }

    let prevent = false;
    pos = pos.filter((it) => {
      if (prevent) return false;
      var a = document.querySelector(`[x="${it[0]}"][y="${it[1]}"]`);
      if (!a) return false;
      if (a.hasChildNodes()) {
        prevent = true;
        return false;
      }

      if (it[0] >= 0 && it[0] < 8 && it[1] >= 0 && it[1] < 8) {
        return it;
      }
    });

    // EATING MECHANISM
    if (this.team == "black") {
      var eatPos1 = [x + 1, y - 1];
      var eatPos2 = [x - 1, y - 1];
    } else {
      var eatPos1 = [x + 1, y + 1];
      var eatPos2 = [x - 1, y + 1];
    }
    var e1 = document.querySelector(`[x="${eatPos1[0]}"][y="${eatPos1[1]}"]`);
    var e2 = document.querySelector(`[x="${eatPos2[0]}"][y="${eatPos2[1]}"]`);

    if (
      e1 &&
      e1.hasChildNodes() &&
      e1.childNodes[0].getAttribute("team") != this.team
    )
      pos.push([eatPos1[0], eatPos1[1]]);
    if (
      e2 &&
      e2.hasChildNodes() &&
      e2.childNodes[0].getAttribute("team") != this.team
    )
      pos.push([eatPos2[0], eatPos2[1]]);

    return pos;
  }
}

class Rook extends Piece {
  constructor(name, team, pos, img) {
    super(name, team, pos, img);
  }
  getAvailablePositions(my) {
    let x = parseInt(my[0]);
    let y = parseInt(my[1]);
    var pos = [];

    for (let i = x + 1; i < 8; i++) {
      pos.push([i, y]);
      if (document.querySelector(`[x="${i}"][y="${y}"]`).hasChildNodes()) {
        break;
      }
    }
    for (let j = y + 1; j < 8; j++) {
      pos.push([x, j]);
      if (document.querySelector(`[x="${x}"][y="${j}"]`).hasChildNodes()) {
        break;
      }
    }
    for (let i = x - 1; i >= 0; i--) {
      pos.push([i, y]);
      if (document.querySelector(`[x="${i}"][y="${y}"]`).hasChildNodes()) {
        break;
      }
    }
    for (let j = y - 1; j >= 0; j--) {
      pos.push([x, j]);
      if (document.querySelector(`[x="${x}"][y="${j}"]`).hasChildNodes()) {
        break;
      }
    }

    pos = pos.filter((it) => {
      var a = document.querySelector(`[x="${it[0]}"][y="${it[1]}"]`);
      if (!a) return false;
      if (
        a.hasChildNodes() &&
        a.childNodes[0].getAttribute("team") == this.team
      ) {
        return false;
      }
      if (it[0] >= 0 && it[0] < 8 && it[1] >= 0 && it[1] < 8) {
        return it;
      }
    });
    return pos;
  }
}

class Bishop extends Piece {
  constructor(name, team, pos, img) {
    super(name, team, pos, img);
  }
  getAvailablePositions(my) {
    let x = parseInt(my[0]);
    let y = parseInt(my[1]);
    var pos = [];
    var z = y;
    for (let i = x + 1; i < 8; i++) {
      if (z > 7) {
        break;
      }
      z++;
      pos.push([i, z]);
      let square = document.querySelector(`[x="${i}"][y="${z}"]`);
      if (square && square.hasChildNodes()) {
        break;
      }
    }

    z = y;
    for (let i = x - 1; i >= 0; i--) {
      if (z < 0) {
        break;
      }
      z--;
      pos.push([i, z]);
      let square = document.querySelector(`[x="${i}"][y="${z}"]`);
      if (square && square.hasChildNodes()) {
        break;
      }
    }

    z = x;
    for (let j = y + 1; j < 8; j++) {
      if (z < 0) {
        break;
      }
      z--;
      pos.push([z, j]);
      let square = document.querySelector(`[x="${z}"][y="${j}"]`);
      if (square && square.hasChildNodes()) {
        break;
      }
    }

    z = x;
    for (let j = y - 1; j >= 0; j--) {
      if (z > 7) {
        break;
      }
      z++;
      pos.push([z, j]);
      let square = document.querySelector(`[x="${z}"][y="${j}"]`);
      if (square && square.hasChildNodes()) {
        break;
      }
    }

    pos = pos.filter((it) => {
      var a = document.querySelector(`[x="${it[0]}"][y="${it[1]}"]`);
      if (!a) return false;
      if (
        a.hasChildNodes() &&
        a.childNodes[0].getAttribute("team") == this.team
      ) {
        return false;
      }
      if (it[0] >= 0 && it[0] < 8 && it[1] >= 0 && it[1] < 8) {
        return it;
      }
    });
    return pos;
  }
}

class Queen extends Piece {
  constructor(name, team, pos, img) {
    super(name, team, pos, img);
  }
  getAvailablePositions(my) {
    let y = parseInt(my[1]);
    let x = parseInt(my[0]);
    var pos = [];

    // CHECK STRAIGHT
    for (let i = x + 1; i < 8; i++) {
      pos.push([i, y]);
      if (document.querySelector(`[x="${i}"][y="${y}"]`).hasChildNodes()) {
        break;
      }
    }
    for (let j = y + 1; j < 8; j++) {
      pos.push([x, j]);
      if (document.querySelector(`[x="${x}"][y="${j}"]`).hasChildNodes()) {
        break;
      }
    }
    for (let i = x - 1; i >= 0; i--) {
      pos.push([i, y]);
      if (document.querySelector(`[x="${i}"][y="${y}"]`).hasChildNodes()) {
        break;
      }
    }
    for (let j = y - 1; j >= 0; j--) {
      pos.push([x, j]);
      if (document.querySelector(`[x="${x}"][y="${j}"]`).hasChildNodes()) {
        break;
      }
    }

    // CHECK DIAGONAL
    var z = y;
    for (let i = x + 1; i < 8; i++) {
      if (z > 7) {
        break;
      }
      z++;
      pos.push([i, z]);
      let square = document.querySelector(`[x="${i}"][y="${z}"]`);
      if (square && square.hasChildNodes()) {
        break;
      }
    }

    z = y;
    for (let i = x - 1; i >= 0; i--) {
      if (z < 0) {
        break;
      }
      z--;
      pos.push([i, z]);
      let square = document.querySelector(`[x="${i}"][y="${z}"]`);
      if (square && square.hasChildNodes()) {
        break;
      }
    }

    z = x;
    for (let j = y + 1; j < 8; j++) {
      if (z < 0) {
        break;
      }
      z--;
      pos.push([z, j]);
      let square = document.querySelector(`[x="${z}"][y="${j}"]`);
      if (square && square.hasChildNodes()) {
        break;
      }
    }

    z = x;
    for (let j = y - 1; j >= 0; j--) {
      if (z > 7) {
        break;
      }
      z++;
      pos.push([z, j]);
      let square = document.querySelector(`[x="${z}"][y="${j}"]`);
      if (square && square.hasChildNodes()) {
        break;
      }
    }

    pos = pos.filter((it) => {
      var a = document.querySelector(`[x="${it[0]}"][y="${it[1]}"]`);
      if (!a) return false;
      if (
        a.hasChildNodes() &&
        a.childNodes[0].getAttribute("team") == this.team
      ) {
        return false;
      }
      if (it[0] >= 0 && it[0] < 8 && it[1] >= 0 && it[1] < 8) {
        return it;
      }
    });
    return pos;
  }
}

class King extends Piece {
  constructor(name, team, pos, img) {
    super(name, team, pos, img);
  }
  getAvailablePositions(my) {
    let x = parseInt(my[0]);
    let y = parseInt(my[1]);
    var pos = [
      [x, y + 1],
      [x, y - 1],
      [x + 1, y],
      [x - 1, y],
      [x + 1, y + 1],
      [x + 1, y - 1],
      [x - 1, y + 1],
      [x - 1, y - 1],
    ];

    pos = pos.filter((it) => {
      var a = document.querySelector(`[x="${it[0]}"][y="${it[1]}"]`);
      if (!a) return false;
      if (
        a.hasChildNodes() &&
        a.childNodes[0].getAttribute("team") == this.team
      ) {
        return false;
      }

      if (it[0] >= 0 && it[0] < 8 && it[1] >= 0 && it[1] < 8) {
        return it;
      }
    });
    return pos;
  }

  upDownRightLeft(x,y){
    //UP DOWN LEFT RIGHT CHECKKKKK
    for (let i = x + 1; i < 8; i++) {
      let a = document.querySelector(`[x="${i}"][y="${y}"]`);
      if (a && a.hasChildNodes()) {
        let child = a.childNodes[0].name;
        let team = a.childNodes[0].getAttribute("team");
        if(team == this.team) break;
        if (child.includes("Rook") || child.includes("Queen")) return true;
        break;
      }
    }

    for (let j = y + 1; j < 8; j++) {
      let a = document.querySelector(`[x="${x}"][y="${j}"]`);
      if (a && a.hasChildNodes()) {
        let child = a.childNodes[0].name;
        let team = a.childNodes[0].getAttribute("team");
        if(team == this.team) break;
        if (child.includes("Rook") || child.includes("Queen")) return true;
        break;
      }
    }

    for (let i = x - 1; i >= 0; i--) {
      let a = document.querySelector(`[x="${i}"][y="${y}"]`);
      if (a && a.hasChildNodes()) {
        let child = a.childNodes[0].name;
        let team = a.childNodes[0].getAttribute("team");
        if(team == this.team) break;
        if (child.includes("Rook") || child.includes("Queen")) return true;
        break;
      }
    }
    for (let j = y - 1; j >= 0; j--) {
      let a = document.querySelector(`[x="${x}"][y="${j}"]`);
      if (a && a.hasChildNodes()) {
        let child = a.childNodes[0].name;
        let team = a.childNodes[0].getAttribute("team");
        if(team == this.team) break;
        if (child.includes("Rook") || child.includes("Queen")) return true;
        break;
      }
    }
    return false;
  }

  diagonalCheck(x,y){
    // DIAGONAL BABY
    var z = y;
    for (let i = x + 1; i < 8; i++) {
      if (z > 7) {
        break;
      }
      z++;
      let a = document.querySelector(`[x="${i}"][y="${z}"]`);
      if (a && a.hasChildNodes()) {
        let child = a.childNodes[0].name;
        let team = a.childNodes[0].getAttribute("team");
        if(team == this.team) break;
        if (child.includes("Bishop") || child.includes("Queen")) return true;
        break;
      }
    }

    z = y;
    for (let i = x - 1; i >= 0; i--) {
      if (z < 0) {
        break;
      }
      z--;

      let a = document.querySelector(`[x="${i}"][y="${z}"]`);
      if (a && a.hasChildNodes()) {
        let child = a.childNodes[0].name;
        let team = a.childNodes[0].getAttribute("team");
        if(team == this.team) break;
        if (child.includes("Bishop") || child.includes("Queen")) return true;
        break;
      }
    }

    z = x;
    for (let j = y + 1; j < 8; j++) {
      if (z < 0) break;
      z--;
      let a = document.querySelector(`[x="${z}"][y="${j}"]`);
      if (a && a.hasChildNodes()) {
        let child = a.childNodes[0].name;
        let team = a.childNodes[0].getAttribute("team");
        if(team == this.team) break;
        if (child.includes("Bishop") || child.includes("Queen")
        ) return true;
        break;
      }
    }

    z = x;
    for (let j = y - 1; j >= 0; j--) {
      if (z > 7) {
        break;
      }
      z++;
      let a = document.querySelector(`[x="${z}"][y="${j}"]`);
      if (a && a.hasChildNodes()) {
        let child = a.childNodes[0].name;
        let team = a.childNodes[0].getAttribute("team");
        if(team == this.team) break;
        if (child.includes("Bishop") || child.includes("Queen")) return true;
        break;
      }
    }
    return false;
  }

  knightCheck(x,y){
    // CHECK KNIGHT MOVES
    var knightPos = [
      [x - 2, y - 1],
      [x - 2, y + 1],
      [x - 1, y - 2],
      [x - 1, y + 2],
      [x + 1, y - 2],
      [x + 1, y + 2],
      [x + 2, y - 1],
      [x + 2, y + 1],
    ];

    let knight = knightPos.find((it) => {
      var a = document.querySelector(`[x="${it[0]}"][y="${it[1]}"]`);
      if (
        a &&
        a.hasChildNodes() &&
        a.childNodes[0].getAttribute("team") != this.team &&
        a.childNodes[0].name.includes("Knight")
      ) {
        return true;
      }
    });
    if(knight) return true;
    return false;
  }

  pawnCheck(x,y){
    // CHECK PAWN
    // EATING MECHANISM
    if (this.team == "black") {
      var eatPos1 = [x + 1, y - 1];
      var eatPos2 = [x - 1, y - 1];
    } else {
      var eatPos1 = [x + 1, y + 1];
      var eatPos2 = [x - 1, y + 1];
    }
    var e1 = document.querySelector(`[x="${eatPos1[0]}"][y="${eatPos1[1]}"]`);
    var e2 = document.querySelector(`[x="${eatPos2[0]}"][y="${eatPos2[1]}"]`);

    if (
      e1 &&
      e1.hasChildNodes() &&
      e1.childNodes[0].getAttribute("team") != this.team &&
      e1.childNodes[0].name.includes("Pawn")
    ) {
      return true;
    }
    if (
      e2 &&
      e2.hasChildNodes() &&
      e2.childNodes[0].getAttribute("team") != this.team &&
      e2.childNodes[0].name.includes("Pawn")
    ) {
      return true;
    }
    return false
  }
  kingCheck(x,y){
    var enemyKingPos = [
      [x, y + 1],
      [x, y - 1],
      [x + 1, y],
      [x - 1, y],
      [x + 1, y + 1],
      [x + 1, y - 1],
      [x - 1, y + 1],
      [x - 1, y - 1],
    ];

    let king = enemyKingPos.find((it) => {
      var a = document.querySelector(`[x="${it[0]}"][y="${it[1]}"]`);
      if (
        a &&
        a.hasChildNodes() &&
        a.childNodes[0].getAttribute("team") != this.team &&
        a.childNodes[0].name.includes("King")
      ) {
        return true;
      }
    });
    if (king) return true;
    return false
  }

  underCheck(my) {
    let x = parseInt(this.pos[0]);
    let y = parseInt(this.pos[1]);
    if(this.upDownRightLeft(x,y)) return true;
    if(this.diagonalCheck(x,y)) return true;
    if(this.knightCheck(x,y)) return true;
    if(this.pawnCheck(x,y)) return true;
    if(this.kingCheck(x,y)) return true;
    return false;
  }

  checkmate() {

    const kingMoves = this.getAvailablePositions(this.pos);
    var prevKing = this.el.parentElement;
    var prevPos = this.pos;

    var squares = kingMoves.filter((it) => {
      let a = document.querySelector(`[x="${it[0]}"][y="${it[1]}"]`);
      let val = null;
      if (a.hasChildNodes()) {
        val = this.capture(a);
      }
      a.appendChild(this.el);
      this.pos = this.getPosition(a);
      // Make move and see if it stops check
      if (this.underCheck()) {
        prevKing.appendChild(this.el);
        this.pos = prevPos;
        if (val != null) val[0].appendChild(val[1]);
      } else {
        // Valid
        prevKing.appendChild(this.el);
        this.pos = prevPos;
        if (val != null) val[0].appendChild(val[1]);
        return a;
      }
    });
    console.log(squares);
    if (squares.length > 0) return false;

    var itsCheckmate = true;
    for (let property in Game.board) {
      let obj = Game.board[property];
      obj;
      if (!obj[0] && obj.name.includes("King")) continue;
      if (obj[0] && obj[0].team != this.team) continue;
      else if (!obj[0] && obj.team != this.team) continue;

      if (obj[0]) {
        for (let i = 0; i < obj.length; i++) {
          let pawnMoves = obj[i].getAvailablePositions(obj[i].pos);
          let prev = obj[i].el.parentElement;

          if (!prev) continue;
          let pawnSquares = pawnMoves.filter((it) => {
            let a = document.querySelector(`[x="${it[0]}"][y="${it[1]}"]`);
            let val = null;
            if (a.hasChildNodes()) {
              val = this.capture(a);
            }
            a.appendChild(obj[i].el);
            obj[i].pos = obj[i].getPosition(a);

            if (this.underCheck()) {
              prev.appendChild(obj[i].el);
              obj[i].pos = obj[i].getPosition(a);
              if (val != null) val[0].appendChild(val[1]);
            } else {
              prev.appendChild(obj[i].el);
              obj[i].pos = obj[i].getPosition(a);
              if (val != null) val[0].appendChild(val[1]);
              return a;
            }
          });
          console.log(pawnSquares);

          if (pawnSquares.length > 0) return false;
        }
      } else {
        const objMoves = obj.getAvailablePositions(obj.pos);

        var prev = obj.el.parentElement;
        if (!prev) return false;
        var objSquares = objMoves.filter((it) => {
          let a = document.querySelector(`[x="${it[0]}"][y="${it[1]}"]`);
          let val = null;
          if (a.hasChildNodes()) {
            val = this.capture(a);
          }
          a.appendChild(obj.el);
          obj.pos = obj.getPosition(a);

          if (this.underCheck()) {
            prev.appendChild(obj.el);
            obj.pos = obj.getPosition(a);
            if (val != null) val[0].appendChild(val[1]);
          } else {
            prev.appendChild(obj.el);
            obj.pos = obj.getPosition(a);
            if (val != null) val[0].appendChild(val[1]);

            return a;
          }
        });
        console.log("objsquars",objSquares);

        if (objSquares.length > 0) {
          itsCheckmate = false;
          return false;
        }
      }
    }
    return true;
  }
}

export { King, Queen, Bishop, Rook, Pawn, Knight };
