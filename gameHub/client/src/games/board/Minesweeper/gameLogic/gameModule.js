const gameModule = (() => {
  // private variables
  let gameBoard = [];
  let currentDifficulty = '';

  // private functions
  const shuffle = (str) => str.sort(() => Math.random() - 0.5);

  function generateBoardStr() {
    const [totalMines, totalEmpty] = {
      easy: [10, 90],
      moderate: [40, 216],
      hard: [99, 381],
    }[currentDifficulty];

    return shuffle([
      ...Array(totalMines).fill('*'),
      ...Array(totalEmpty).fill('.'),
    ]);
  }

  function convertToMatrix(fieldStr) {
    const [rowLen, colLen] = {
      easy: [10, 10],
      moderate: [16, 16],
      hard: [20, 24],
    }[currentDifficulty];

    return Array(rowLen)
      .fill(null)
      .reduce((prev, curr, idx) => {
        const startIdx = idx * colLen;
        const endIdx = startIdx + colLen;
        const fieldRow = fieldStr.slice(startIdx, endIdx);
        return [...prev, [...fieldRow]];
      }, []);
  }

  function generateStartBoard(field) {
    const classLookup = {
      '*': 'mine',
      0: 'empty',
      1: 'one',
      2: 'two',
      3: 'three',
      4: 'four',
      5: 'five',
      6: 'six',
      7: 'seven',
      8: 'eight',
    };

    return field.map((col, rowIdx) => {
      return col.map((val, colIdx) => {
        const value = getMineCount(rowIdx, colIdx, field);
        return {
          coordinates: `${[rowIdx]}-${[colIdx]}`,
          isShowing: false,
          hasFlag: false,
          initialStyles: 'mineSquare dimensions',
          showStyles: `${classLookup[value]} bgImg dimensions`,
          flagStyles: 'flag bgImg mineSquare dimensions',
          value,
        };
      });
    });
  }

  function getMineCount(row, col, board) {
    const checkSquares = getCheckCoordinates(row, col, board);
    if (board.at(row).at(col) === '*') return '*';

    const result = checkSquares
      .map((coord) => {
        const [row, col] = coord.split('-');
        return board.at(row).at(col);
      })
      .filter((char) => char === '*').length;
    return result;
  }

  // public
  const getStartBoard = () => gameBoard;

  function getCheckCoordinates(row, col, board) {
    const [rowEnd, colEnd] = {
      easy: [9, 9],
      moderate: [15, 15],
      hard: [19, 23],
    }[currentDifficulty];

    const r = Number(row),
      c = Number(col);

    const possibleSquares = [
      `${!r ? null : r - 1}-${!c ? null : c - 1}`,
      `${!r ? null : r - 1}-${c}`,
      `${!r ? null : r - 1}-${c === colEnd ? null : c + 1}`,
      `${r}-${c === colEnd ? null : c + 1}`,
      `${r === rowEnd ? null : r + 1}-${c === colEnd ? null : c + 1}`,
      `${r === rowEnd ? null : r + 1}-${c}`,
      `${r === rowEnd ? null : r + 1}-${!c ? null : c - 1}`,
      `${r}-${!c ? null : c - 1}`,
    ];
    return possibleSquares.filter((elem) => !elem.includes('null'));
  }

  const newGame = (dif = 'easy') => {
    currentDifficulty = dif;
    const boardStr = generateBoardStr();
    const boardArr = convertToMatrix(boardStr);
    gameBoard = generateStartBoard(boardArr);
  };

  return {
    getStartBoard,
    getCheckCoordinates,
    newGame,
  };
})();

export default gameModule;
