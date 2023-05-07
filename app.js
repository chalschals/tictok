const overallCells = document.querySelectorAll(".each_cell");
const container = document.querySelector(".tictok");

const playerScoreCard = document.querySelector("#point-o");
const pilotScoreCard = document.querySelector("#point-x");
const drawScoreCard = document.querySelector("#point-draw");
const pilotPointer = "X";
const playerPointer = "O";

let pilotScore = 0;
let playerScore = 0;
let draw = 0;

const board = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];
const firstMovePriority = ["1-1", "0-0", "0-2", "2-0", "2-2"];

for (cell of overallCells) {
  cell.addEventListener("click", (event) => {
    const clickedCell = event.target;
    if (
      clickedCell.getAttribute("data-already-clicked") ||
      container.getAttribute("data-pilot-turn")
    ) {
      handleInvalidMove();
    } else {
      const gemeOver = doMarking(clickedCell, playerPointer);
      if (!gemeOver) waitForPiolot();
      else anounceWinner(playerPointer);
    }
  });
}

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

const anounceWinner = (winner) => {
  alertify.success(`${winner} Wont the match`, 2);
  if (winner === pilotPointer) pilotScore++;
  if (winner === playerPointer) playerScore++;
  pilotScoreCard.innerHTML = pilotScore;
  playerScoreCard.innerHTML = playerScore;
};

const anounceDraw = () => {
  alertify.error(`Match Draw`, 2);
  draw++;
  drawScoreCard.innerHTML = draw;
};

const updateBoardArray = (x, y, pointer) => {
  board[x][y] = pointer;
  console.table(board);
  let gameOver = checkForWinner(pointer);
  return gameOver;
};

const doMarking = (cell, pointer) => {
  cell.classList.add(pointer.toLowerCase());
  cell.innerHTML = pointer;
  cell.setAttribute("data-already-clicked", "true");
  return updateBoardArray(
    parseInt(cell.getAttribute("data-x")),
    parseInt(cell.getAttribute("data-y")),
    pointer
  );
};

const updateWinnerRow = (clsList) => {
  for (cls of clsList) {
    document.querySelector(`.${cls}`).classList.add("won");
  }
};

const checkForWinner = (pointer, dummyCheck = false) => {
  // Check rows for a win
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] === pointer &&
      board[i][1] === pointer &&
      board[i][2] === pointer
    ) {
      if (!dummyCheck) updateWinnerRow([`x${i}-y0`, `x${i}-y1`, `x${i}-y2`]);
      return true;
    }
  }

  // Check columns for a win
  for (let j = 0; j < 3; j++) {
    if (
      board[0][j] === pointer &&
      board[1][j] === pointer &&
      board[2][j] === pointer
    ) {
      if (!dummyCheck) updateWinnerRow([`x0-y${j}`, `x1-y${j}`, `x2-y${j}`]);
      return true;
    }
  }

  // Check diagonals for a win
  if (
    board[0][0] === pointer &&
    board[1][1] === pointer &&
    board[2][2] === pointer
  ) {
    if (!dummyCheck) updateWinnerRow([`x0-y0`, `x1-y1`, `x2-y2`]);
    return true;
  }
  if (
    board[0][2] === pointer &&
    board[1][1] === pointer &&
    board[2][0] === pointer
  ) {
    if (!dummyCheck) updateWinnerRow([`x0-y2`, `x1-y2`, `x2-y0`]);
    return true;
  }

  // No win found
  return false;
};

const check2CellMatch = (pointer, opponent) => {
  // Check rows for a win
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] === opponent ||
      board[i][1] === opponent ||
      board[i][2] === opponent
    ) {
      continue;
    } else if (
      (board[i][0] === pointer && board[i][1] === pointer) ||
      (board[i][1] === pointer && board[i][2] === pointer) ||
      (board[i][2] === pointer && board[i][0] === pointer)
    ) {
      return [
        [i, 0],
        [i, 1],
        [i, 2],
      ];
    }
  }

  // Check columns for a win
  for (let j = 0; j < 3; j++) {
    if (
      board[0][j] === opponent ||
      board[1][j] === opponent ||
      board[2][j] === opponent
    ) {
      continue;
    } else if (
      (board[0][j] === pointer && board[1][j] === pointer) ||
      (board[1][j] === pointer && board[2][j] === pointer) ||
      (board[2][j] === pointer && board[0][j] === pointer)
    ) {
      return [
        [0, j],
        [1, j],
        [2, j],
      ];
    }
  }

  // Check diagonals for a win
  if (
    board[0][0] !== opponent &&
    board[1][1] !== opponent &&
    board[2][2] !== opponent
  ) {
    if (
      (board[0][0] === pointer && board[1][1] === pointer) ||
      (board[1][1] === pointer && board[2][2] === pointer) ||
      (board[2][2] === pointer && board[0][0] === pointer)
    ) {
      return [
        [0, 0],
        [1, 1],
        [2, 2],
      ];
    }
  }

  if (
    board[0][2] !== opponent &&
    board[1][1] !== opponent &&
    board[2][0] !== opponent
  ) {
    if (
      (board[0][2] === pointer && board[1][1] === pointer) ||
      (board[1][1] === pointer && board[2][0] === pointer) ||
      (board[2][0] === pointer && board[0][2] === pointer)
    ) {
      return [
        [0, 2],
        [1, 1],
        [2, 0],
      ];
    }
  }

  // No 2 match found
  return [];
};

const doDiagnosisOnBoard = () => {
  let emptySlotCount = 9;
  let availableSlots = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j]) {
        emptySlotCount--;
      } else {
        availableSlots.push(`${i}-${j}`);
      }
    }
  }
  return [emptySlotCount, availableSlots];
};

const getXY = (str) => {
  const xtList = str.split("-");
  return [xtList[0], xtList[1]];
};

const predictNextStep = () => {
  let predicted = false;
  let predictedCell = [];

  const [emptySlotCount, availableSlots] = doDiagnosisOnBoard();

  if (availableSlots.length === 0) {
    anounceDraw();
    return;
  }

  console.log("availableSlots", availableSlots);
  if (emptySlotCount >= 8) {
    //firstStep
    const shuffledArray = shuffle(firstMovePriority);
    for (priority of shuffledArray) {
      if (availableSlots.includes(priority)) {
        predicted = true;
        predictedCell = getXY(priority);
        break;
      }
    }
  } else {
    const Cell2Match = check2CellMatch(pilotPointer, playerPointer);
    if (Cell2Match.length > 0) {
      //got winning strike
      console.log("got winning strike");
      predicted = true;
      for (cell of Cell2Match) {
        if (!board[cell[0]][cell[1]]) {
          predictedCell = [cell[0], cell[1]];
        }
      }
    } else {
      const Cell2MatchOppo = check2CellMatch(playerPointer, pilotPointer);

      if (Cell2MatchOppo.length > 0) {
        console.log("NOSE CUT", Cell2MatchOppo);
        predicted = true;
        for (cell of Cell2MatchOppo) {
          if (!board[cell[0]][cell[1]]) {
            predictedCell = [cell[0], cell[1]];
          }
        }
      } else {
        console.log("INDIED ELSE");
        for (avail of availableSlots) {
          const [x, y] = getXY(avail);
          board[x][y] = pilotPointer;
          const Cell2MatchPilot = check2CellMatch(pilotPointer, playerPointer);
          console.log("INDIED ELSE1", x, y, Cell2MatchPilot);
          if (Cell2MatchPilot.length > 0) {
            console.log("Preditcted", "true");
            predicted = true;
            board[x][y] = null;
            if (!board[x][y]) {
              predictedCell = [x, y];
              console.log("DRAW1", [x, y]);
            } else {
              for (cell of Cell2MatchPilot) {
                if (!board[cell[0]][cell[1]]) {
                  console.log("DRAW2", [cell[0], cell[1]]);
                  predictedCell = [cell[0], cell[1]];
                }
              }
            }
            break;
          } else {
            board[x][y] = null;
          }
        }

        if (!predicted) {
          //Random Slot if cant predict
          console.log("Random Slot if cant predict");
          const randomSlot =
            availableSlots[
              Math.round(Math.random() * (availableSlots.length - 1) - 0)
            ];
          console.log(randomSlot);
          predicted = true;
          predictedCell = [randomSlot[0], randomSlot[1]];
        }
      }
    }
  }

  if (predicted) {
    console.table(predictedCell);
    const gameOver = doMarking(
      document.querySelector(`.x${predictedCell[0]}-y${predictedCell[1]}`),
      pilotPointer
    );
    if (!gameOver) container.removeAttribute("data-pilot-turn");
    else anounceWinner(pilotPointer);
  } else {
    alertify.error(`unable to predict`, 2);
  }
};

const waitForPiolot = () => {
  container.setAttribute("data-pilot-turn", "true");
  setTimeout(() => {
    predictNextStep();
  }, 400);
};

const resetGame = () => {
  for (cell of overallCells) {
    cell.innerHTML = "";
    cell.removeAttribute("data-already-clicked");
    cell.classList.remove("won");
    cell.classList.remove("o");
    cell.classList.remove("x");
    container.removeAttribute("data-pilot-turn");
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board[i][j] = null;
      }
    }
  }
};

const handleInvalidMove = () => {
  container.classList.add("invalid");
  setTimeout(() => {
    container.classList.remove("invalid");
  }, 300);
};
