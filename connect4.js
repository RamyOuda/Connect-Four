/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;
let inProgress = true;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

const makeBoard = () => {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array

  // create empty arrays inside of the board array
  // fill each array with `null`

  for (let i = 0; i < HEIGHT; i++) {
    board.push([]);
    for (let j = 0; j < WIDTH; j++) {
      board[i].push(null);
    }
  }
  return board;
};

/** makeHtmlBoard: make HTML table and row of column tops. */

const makeHtmlBoard = () => {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector(`table`);

  // TODO: add comment for this code
  // setting `top` to create a <tr> element
  const top = document.createElement("tr");
  // giving the `column-top` ID to the new <tr>
  top.setAttribute("id", "column-top");
  // adding a click event listeneter to `top`
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    // have `headCell` create a new <td> when called
    const headCell = document.createElement("td");
    // give ID="x" to the new <td>
    headCell.setAttribute("id", x);
    // append `headCell` to `top`
    top.append(headCell);
  }
  // append `top` to the board
  htmlBoard.append(top);

  // TODO: add comment for this code
  for (let y = 0; y < HEIGHT; y++) {
    // create new <tr> when `row` is called
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      // create new <td> when `cell` is called
      const cell = document.createElement("td");
      // give new cell <td>'s the ID="x-y" (string coordinates)
      cell.setAttribute("id", `${y}-${x}`);
      // append the cell <td> to the row <tr>
      row.append(cell);
    }
    // append the row <tr> to the board
    htmlBoard.append(row);
  }
};

/** findSpotForCol: given column x, return top empty y (null if filled) */

const findSpotForCol = (x) => {
  // TODO: write the real version of this, rather than always returning 0

  // checks the rows, starting from the bottom
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      // if board[y][x] === null
      return y; // fill that cell
    }
  }
  return null; // if clicking on the dotted row, and all the cells below are filled, return null to keep the dotted row null. It'll throw an error otherwise.
};

/** placeInTable: update DOM to place piece into HTML table of board */

const placeInTable = (y, x) => {
  // TODO: make a div and insert into correct table cell

  // create <div> element
  const piece = document.createElement(`div`);
  piece.classList.add(`piece`);
  piece.classList.add(`fall`);
  piece.classList.add(`p${currPlayer}`);

  const location = document.getElementById(`${y}-${x}`);
  location.append(piece);
};

/** endGame: announce game end */

const endGame = (msg) => {
  if (inProgress) alert(msg);
  inProgress = false;
};

/** handleClick: handle click of column top to play piece */

const handleClick = (evt) => {
  if (inProgress) {
    // get x from ID of clicked cell
    let x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    let y = findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    // TODO: add line to update in-memory board
    placeInTable(y, x);

    // updates the board array with the player number
    board[y][x] = currPlayer;

    // check for win
    if (checkForWin()) {
      setTimeout(() => {
        currPlayer = currPlayer === 1 ? 2 : 1;
        return endGame(`Player ${currPlayer} won!`);
      }, 100);
    }

    // check for tie
    // TODO: check if all cells in board are filled; if so call, call endGame

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every

    // https://stackoverflow.com/questions/60837804/better-way-to-check-if-every-value-in-a-nested-array-is-true-or-false

    if (board.every((row) => row.every((cell) => cell))) return endGame(`Tie!`);

    // switch players
    // TODO: switch currPlayer 1 <-> 2

    // if (currPlayer === 1) currPlayer = 2;
    // else currPlayer = 1;

    currPlayer = currPlayer === 1 ? 2 : 1;
  }
};

/** checkForWin: check board cell-by-cell for "does a win start here?" */

const checkForWin = () => {
  const _win = (cells) => {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  };

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      let vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      let diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      let diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
};

makeBoard();
makeHtmlBoard();

// bonus - reset button

const resetBoard = () => {
  // https://bobbyhadz.com/blog/javascript-add-class-to-multiple-elements
  const TDs = document.querySelectorAll(`.piece`);
  for (let each of TDs) {
    each.classList.add(`lift`);
  }

  setTimeout(() => {
    board.length = 0;
    currPlayer = 1;
    inProgress = true;

    document.querySelector(`table`).innerHTML = ``;

    makeBoard();
    makeHtmlBoard();
  }, 400);
};

document.querySelector(`button`).addEventListener(`click`, () => resetBoard());
