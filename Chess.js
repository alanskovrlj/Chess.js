import Game from "./Game.js";
var myGame1;
function StartNewGame(root) {
  myGame1 = new Game(root);
  console.log(myGame1.playerTurn);
}
StartNewGame(document.querySelector("#board"));
export default myGame1;
