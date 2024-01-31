const GameModule = (() => {
  let startBoard = [],
    solvedBoard = null;
  const subGridLookup = {
    '00': ['00', '01', '02', '10', '11', '12', '20', '21', '22'],
    '01': ['03', '04', '05', '13', '14', '15', '23', '24', '25'],
    '02': ['06', '07', '08', '16', '17', '18', '26', '27', '28'],
    10: ['30', '31', '32', '40', '41', '42', '50', '51', '52'],
    11: ['33', '34', '35', '43', '44', '45', '53', '54', '55'],
    12: ['36', '37', '38', '46', '47', '48', '56', '57', '58'],
    20: ['60', '61', '62', '70', '71', '72', '80', '81', '82'],
    21: ['63', '64', '65', '73', '74', '75', '83', '84', '85'],
    22: ['66', '67', '68', '76', '77', '78', '86', '87', '88'],
  };
  const difficultyLookup = {
    easy: 32,
    moderate: 28,
    hard: 25,
  };

  // private functions
  const randNum_0_8 = () => Math.floor(Math.random() * 9);
  const randNum_1_9 = () => Math.floor(Math.random() * 9) + 1;

  const getRow = (checkGrid, row) => checkGrid[row];
  const getCol = (checkGrid, col) => checkGrid.map((arr) => arr[col]);

  const getSubGrid = (checkGrid, row, col) => {
    const gridRow = Math.floor(row / 3),
      gridCol = Math.floor(col / 3);
    const key = `${gridRow}${gridCol}`;

    return subGridLookup[key].map(([row, col]) => checkGrid[row][col]);
  };

  const getPossibleValues = (currGrid, row, col) => {
    const possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const existingValues = Array.from(
      new Set([
        ...getRow(currGrid, row),
        ...getCol(currGrid, col),
        ...getSubGrid(currGrid, row, col),
      ])
    );

    return possibleValues.filter((val) => !existingValues.includes(val));
  };

  const solvePuzzle = (checkGrid) => {
    let solved = false;
    let madeMove = true;
    let memory = [];

    while (!solved) {
      if (madeMove === false) break;
      madeMove = false;
      solved = true;
      memory = [];

      for (let row = 0; row < checkGrid.length; row++) {
        for (let col = 0; col < checkGrid[0].length; col++) {
          if (checkGrid[row][col] !== null) continue;
          const possibleValues = getPossibleValues(checkGrid, row, col);

          if (possibleValues.length === 1) {
            checkGrid[row][col] = possibleValues[0];
            madeMove = true;
          } else if (!possibleValues.length) {
            return false;
          } else {
            memory.push({ possible: possibleValues, row, col });
            solved = false;
          }
        } // end inner
      } // end outer
    } // end while

    if (!memory.length) return checkGrid;

    const checkSquare = memory
      .sort((a, b) => a.possible.length - b.possible.length)
      .shift();

    checkGrid[checkSquare.row][checkSquare.col] = checkSquare.possible[1];
    return solvePuzzle(checkGrid);
  };

  const generateBoard = (num) => {
    const matrix = Array(9)
      .fill(null)
      .map(() => Array(9).fill(null));
    let i = num;

    while (i > 0) {
      let row = randNum_0_8();
      let col = randNum_0_8();
      const checkSq = matrix[row][col];

      if (!checkSq) {
        const insertVal = randNum_1_9();
        const possibleValues = getPossibleValues(matrix, row, col);
        const isValidPlacement = possibleValues.includes(insertVal);
        if (isValidPlacement) {
          matrix[row][col] = insertVal;
          i--;
        }
      }
    }

    startBoard = JSON.parse(JSON.stringify(matrix));
    return solvePuzzle(matrix);
  };

  // public API
  const newGame = (difficulty = 'hard') => {
    let startNum = difficultyLookup[difficulty] || 35;
    solvedBoard = null;
    startBoard = [];
    while (!solvedBoard) {
      solvedBoard = generateBoard(startNum);
    }
  };

  const getStartBoard = () => startBoard;
  const getSolvedBoard = () => solvedBoard;

  const checkForWin = (checkBoard) => {
    const checkArr = [...checkBoard.flat()];
    return [...solvedBoard.flat()].every((num, i) => +num === +checkArr[i]);
  };

  const getHint = (checkBoard) => {};

  return {
    newGame,
    getStartBoard,
    getSolvedBoard,
    checkForWin,
  };
})();

export default GameModule;
