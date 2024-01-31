const gameBoard = document.querySelector('#gameBoard');
// game
const chessGame = chessModule();
let boardArray = chessGame.getStartBoard();
let checkBoardArr = null;
let colorsTurn = 'white';
let nextColorsTurn = 'black';
const deepCopy = (arr) => JSON.parse(JSON.stringify(arr));
let enPassantData = null;

const displayBoard = (arr) => {
  let isDarkSq = false;
  Array(...gameBoard.children).forEach((child) => gameBoard.removeChild(child));

  Array(8)
    .fill(null)
    .map((_, idx) => {
      const start = idx * 8;
      const end = start + 8;

      gameBoard.insertAdjacentHTML(
        'beforeend',
        `<div id="row${idx}" class="row"></div>
    `
      );

      const currentRow = document.querySelector(`#row${idx}`);

      arr.slice(start, end).map((sq, index) => {
        const selected = sq.isSelected ? 'selected' : '';
        const pieceClass = sq.piece ? ` ${sq.color}${sq.piece} piece` : '';

        if (index === 0) isDarkSq = !isDarkSq;
        isDarkSq = !isDarkSq;
        const sqColor = isDarkSq ? 'dark' : 'light';

        currentRow.insertAdjacentHTML(
          'beforeend',
          `<div data-value=${sq.piece} id='${idx}${index}' class='${sqColor} ${pieceClass} ${selected}'></div>
        `
        );
      });
    });
};

// togglers
function toggleSelected(selected) {
  if (['gameBoard', 'row'].includes(selected)) return; // prevent break.
  if (selected.includes('row')) return;
  let updatedBoard = deepCopy(boardArray);
  const [selectedPiece] = updatedBoard.filter(
    (obj) => obj.location === selected
  );

  const isAlreadySelected = selectedPiece.isSelected;
  updatedBoard.forEach((obj) => {
    if (isAlreadySelected || !selectedPiece.piece) {
      obj.isSelected = false;
    } else if (selected === obj.location) {
      obj.isSelected = true;
    } else {
      obj.isSelected = false;
    }
  });

  boardArray = updatedBoard;
  // console.log(boardArray)
  displayBoard(boardArray);
  return updatedBoard;
}

function toggleColorsTurn() {
  nextColorsTurn = colorsTurn;
  colorsTurn = colorsTurn === 'white' ? 'black' : 'white';
}

function movePiece(from, to) {
  return deepCopy(boardArray).map((obj) => {
    return obj.location === to.location
      ? { ...from, hasMoved: true, location: to.location }
      : obj.location === from.location
      ? {
          piece: null,
          location: from.location,
          hasMoved: false,
          color: null,
          isSelected: false,
        }
      : obj;
  });
}

// this is working for isKingCheck
function checkRankPath(fromSquare, toSquare, isKingCheck = false) {
  const [fromRank, fromFile] = fromSquare.location;
  const [toRank, toFile] = toSquare.location;
  const spacesMoved = toRank - fromRank;
  const pathLocations = Array(Math.abs(spacesMoved))
    .fill(null)
    .map((_, idx) => {
      // determines which direction to look
      const checkRank =
        spacesMoved < 0 ? +fromRank - (idx + 1) : +fromRank + (idx + 1);

      return `${checkRank}${fromFile}`;
    });

  // ternary to account for king checks.
  const pathSquares = isKingCheck
    ? convertLocToPiece(pathLocations, checkBoardArr)
    : convertLocToPiece(pathLocations);
  // console.log('rank pathSquares', pathSquares)

  // the pawn cannot take a piece on a forward move, unlike the other pieces. which is why the return is a bit more complex.
  return fromSquare.piece === 'pawn'
    ? pathSquares.every((sq) => !sq.piece)
    : pathSquares.length && pathSquares.slice(0, -1).every((sq) => !sq.piece);
}

function checkFilePath(fromSquare, toSquare) {
  const [fromRank, fromFile] = fromSquare.location;
  const [toRank, toFile] = toSquare.location;
  const spacesMoved = toFile - fromFile;
  const pathLocations = Array(Math.abs(spacesMoved) - 1)
    .fill(null)
    .map((_, idx) => {
      // determines which direction to look
      const checkFile =
        spacesMoved < 0 ? +fromFile - (idx + 1) : +fromFile + (idx + 1);

      return `${fromRank}${checkFile}`;
    });
  // console.log('file pathLocations', pathLocations)
  const pathSquares = convertLocToPiece(pathLocations);

  // if piece is only moving 1 square away, there is no path to check.
  return !pathSquares.length || pathSquares.every((sq) => !sq.piece);
}

function checkDiagonalPath(fromSquare, toSquare) {
  const [fromRank, fromFile] = fromSquare.location;
  const [toRank, toFile] = toSquare.location;
  const isLeft = fromFile > toFile;
  const isForward = fromRank > toRank;

  const lookupIdx = [
    isForward && isLeft, // left forward
    isForward && !isLeft, // right forward
    !isForward && isLeft, // left backward
    !isForward && !isLeft, // right backward
  ].indexOf(true);

  const spacesMoved = Math.abs(fromRank - toRank);

  const pathLocations = Array(spacesMoved - 1)
    .fill(null)
    .map((_, i) =>
      [
        `${+fromRank - (i + 1)}${+fromFile - (i + 1)}`, // left forward
        `${+fromRank - (i + 1)}${+fromFile + (i + 1)}`, // right forward
        `${+fromRank + (i + 1)}${+fromFile - (i + 1)}`, // left backward
        `${+fromRank + (i + 1)}${+fromFile + (i + 1)}`, // right backward
      ].at(lookupIdx)
    );

  const pathSquares = convertLocToPiece(pathLocations);

  return pathSquares.every((square) => !square.piece);
}

// default param allows a checkboard to simulate a possible move.
function convertLocToPiece(locArr, board = boardArray) {
  return locArr.map((location) => {
    return board.filter((obj) => obj.location === location).at(0);
  });
}

function setEnPassantData(toSquare) {
  const { location: toLocation } = toSquare;
  const checkLocations = chessGame.getCheckLocations(toSquare, true);
  const checksquares = convertLocToPiece(checkLocations);

  const validEnPassant = checksquares.filter(
    (obj) => obj.piece === 'pawn' && obj.color == nextColorsTurn
  );

  const targetToLocation = [...toLocation]
    .map((char, idx) => {
      const newRank =
        nextColorsTurn === 'white'
          ? +toLocation.at(0) - 1
          : +toLocation.at(0) + 1;

      return idx ? char : newRank;
    })
    .join('');

  return validEnPassant.length
    ? { targetToLocation, targetTakeLocation: toLocation }
    : null;
}

function checkEnPassantMove(fromSquare, toSquare, checkData) {
  const { targetToLocation, targetTakeLocation } = checkData;
  const isCorrectToLocation = targetToLocation === toSquare.location;

  if (isCorrectToLocation) {
    // proceed with en passe move.
    const updatedBoard = movePiece(fromSquare, toSquare).map((obj) =>
      obj.location === targetTakeLocation
        ? { ...obj, piece: null, hasMoved: false, color: null }
        : obj
    );
    return { isValidMove: true, newBoard: updatedBoard };
  }

  return { isValidMove: false };
}

// still think i could move the enPassant check to a helper function.
function checkPawnMove(fromSquare, toSquare) {
  const [toRank, toFile] = toSquare.location;
  const [fromRank, fromFile] = fromSquare.location;
  const isForwardMove = toFile === fromFile;

  if (enPassantData) {
    // en passant move possible.
    const resultObj = checkEnPassantMove(fromSquare, toSquare, enPassantData);
    if (resultObj.isValidMove) return resultObj;
  }

  if (isForwardMove) {
    // check rank move
    const spacesMoved = Math.abs(toRank - fromRank);
    const isRankPathClear = checkRankPath(fromSquare, toSquare);
    enPassantData = spacesMoved === 2 ? setEnPassantData(toSquare) : null;

    if (!isRankPathClear) return { isValidMove: false };
  } else {
    // check capture move
    const canCapture = toSquare.color === nextColorsTurn;
    if (!canCapture) return { isValidMove: false };
    enPassantData = null;
  }

  return { isValidMove: true, newBoard: movePiece(fromSquare, toSquare) };
}

function checkRookMove(fromSquare, toSquare) {
  const [fromRank] = fromSquare.location;
  const [toRank] = toSquare.location;
  const isFileMove = fromRank === toRank;
  const canLandOn = toSquare.color === nextColorsTurn || !toSquare.color;

  const isPathClear = isFileMove
    ? checkFilePath(fromSquare, toSquare)
    : checkRankPath(fromSquare, toSquare);

  return isPathClear && canLandOn
    ? { isValidMove: true, newBoard: movePiece(fromSquare, toSquare) }
    : { isValidMove: false };
}

function checkKnightMove(fromSquare, toSquare) {
  const canLandOn = toSquare.color !== colorsTurn;

  return canLandOn
    ? { isValidMove: true, newBoard: movePiece(fromSquare, toSquare) }
    : { isValidMove: false };
}

function checkBishopMove(fromSquare, toSquare) {
  const isPathClear = checkDiagonalPath(fromSquare, toSquare);
  const canLandOn = toSquare.color !== colorsTurn;

  return isPathClear && canLandOn
    ? { isValidMove: true, newBoard: movePiece(fromSquare, toSquare) }
    : { isValidMove: false };
}

function checkQueenMove(fromSquare, toSquare, isKingCheck) {
  const [toRank, toFile] = toSquare.location;
  const [fromRank, fromFile] = fromSquare.location;
  const isSameRank = fromRank === toRank;
  const isSameFile = fromFile === toFile;
  const isRankMove = !isSameRank && isSameFile;
  const isFileMove = isSameRank && !isSameFile;
  const canLandOn = toSquare.color !== colorsTurn;
  const isPathClear = isRankMove
    ? checkRankPath(fromSquare, toSquare, isKingCheck)
    : isFileMove
    ? checkFilePath(fromSquare, toSquare)
    : checkDiagonalPath(fromSquare, toSquare);

  if (isKingCheck) {
    const canLandOnTest = isKingCheck
      ? toSquare.color === colorsTurn
      : toSquare.color !== colorsTurn;
    console.log('canLandOnTest', canLandOnTest);
    console.log('isPathClear', isPathClear);
    // console.log('canLandOn', canLandOn, colorsTurn)
  }

  return isPathClear && canLandOn
    ? { isValidMove: true, newBoard: movePiece(fromSquare, toSquare) }
    : { isValidMove: false };
}

// checkKnightMove FN is exactly the same as checkKingMove. but i'm hesitant to combine them per readability.
function checkKingMove(fromSquare, toSquare) {
  const canLandOn = toSquare.color !== colorsTurn;
  return canLandOn
    ? { isValidMove: true, newBoard: movePiece(fromSquare, toSquare) }
    : { isValidMove: false };
}

// not working. i think it has to do with the colorsTurn/nextColorsTurn variables. (canLandOn booleans within checkmoveFNS)

// i noticed the newBoard (checkboard) is not accurate as im going through the checks. start from the top and figure out why the board is changing during the process.

function checkSelfCheck(checkBoard) {
  // console.log(checkBoard.filter(obj => obj.piece))

  const [kingToCheck] = checkBoard.filter(
    (obj) => obj.piece === 'king' && obj.color === colorsTurn
  );
  // console.log('kingToCheck', kingToCheck);

  const selectedPieceArr = checkBoard.filter(
    (obj) => obj.color === nextColorsTurn
  );
  // console.log('selectedPieceArr', selectedPieceArr)

  const result = selectedPieceArr.map((selectedPiece) => {
    const checkLocations = chessGame.getCheckLocations(selectedPiece);
    const isValidLocation = checkLocations.includes(kingToCheck.location);
    // console.log('isValidLocation', isValidLocation)
    if (isValidLocation) {
      console.log(selectedPiece);
      const { isValidMove, newBoard } = checkMove(
        selectedPiece,
        kingToCheck,
        true
      );
      // console.log('isValidMove', isValidMove)
    }
  });
}

gameBoard.addEventListener('click', (e) => {
  const target = e.target.id;
  if (target.includes('row')) return;
  const [toSquare] = boardArray.filter((obj) => obj.location === target);
  const selectedPiece = boardArray.filter((obj) => obj.isSelected).at(0) || {};
  const isColorsTurn = selectedPiece.color === colorsTurn;

  if (!selectedPiece || !toSquare || !isColorsTurn) {
    return toggleSelected(target); // prevents breaks
  }
  const checkLocations = chessGame.getCheckLocations(selectedPiece);
  const isValidLocation = checkLocations.includes(toSquare.location);

  if (!isValidLocation) {
    toggleSelected(target);
    return console.log('INVALID MOVE');
  }

  const { isValidMove, newBoard } = checkMove(selectedPiece, toSquare);
  // if the move is valid. call the isKingInCheck FN before toggling turn or updating board.
  if (isValidMove) {
    checkBoardArr = deepCopy(newBoard);
    const isSelfCheck = checkSelfCheck(checkBoardArr);
    // console.log('isSelfCheck', isSelfCheck)

    boardArray = newBoard;
    toggleColorsTurn();
  }

  // console.log(boardArray)
  toggleSelected(target);
});

// checkMove switch function
function checkMove(from, to, isKingCheck = false) {
  let resultObj = { isValidMove: false };

  switch (from.piece) {
    case 'pawn':
      resultObj = checkPawnMove(from, to, isKingCheck);
      break;
    case 'rook':
      resultObj = checkRookMove(from, to, isKingCheck);
      break;
    case 'knight':
      resultObj = checkKnightMove(from, to, isKingCheck);
      break;
    case 'bishop':
      resultObj = checkBishopMove(from, to, isKingCheck);
      break;
    case 'queen':
      resultObj = checkQueenMove(from, to, isKingCheck);
      break;
    case 'king':
      resultObj = checkKingMove(from, to, isKingCheck);
      break;
    default:
      console.log('not set up');
  }
  // console.log('resultObj', resultObj)
  return resultObj;
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-test boards here=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

// en passant test board
// boardArray = [
//     {
//         "piece": "rook",
//         "location": "00",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "knight",
//         "location": "01",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "bishop",
//         "location": "02",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "queen",
//         "location": "03",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "king",
//         "location": "04",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "bishop",
//         "location": "05",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "knight",
//         "location": "06",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "rook",
//         "location": "07",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": null,
//         "location": "10",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": "pawn",
//         "location": "11",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "pawn",
//         "location": "12",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "pawn",
//         "location": "13",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "pawn",
//         "location": "14",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "pawn",
//         "location": "15",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "pawn",
//         "location": "16",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "pawn",
//         "location": "17",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": null,
//         "location": "20",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "21",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "22",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "23",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "24",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "25",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "26",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "27",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "30",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": null,
//         "location": "31",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "32",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": "pawn",
//         "location": "33",
//         "hasMoved": true,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": null,
//         "location": "34",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "35",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "36",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "37",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": "pawn",
//         "location": "40",
//         "hasMoved": true,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": null,
//         "location": "41",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "42",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "43",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": null,
//         "location": "44",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "45",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "46",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "47",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "50",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "51",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "52",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "53",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "54",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "55",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "56",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "57",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": "pawn",
//         "location": "60",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "pawn",
//         "location": "61",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "pawn",
//         "location": "62",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": null,
//         "location": "63",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": "pawn",
//         "location": "64",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "pawn",
//         "location": "65",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "pawn",
//         "location": "66",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "pawn",
//         "location": "67",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "rook",
//         "location": "70",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "knight",
//         "location": "71",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "bishop",
//         "location": "72",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "queen",
//         "location": "73",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "king",
//         "location": "74",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "bishop",
//         "location": "75",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "knight",
//         "location": "76",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "rook",
//         "location": "77",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     }
// ]

// rook test board
// boardArray = [
//     {
//         "piece": "rook",
//         "location": "00",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "knight",
//         "location": "01",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "bishop",
//         "location": "02",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "queen",
//         "location": "03",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "king",
//         "location": "04",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "bishop",
//         "location": "05",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "knight",
//         "location": "06",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "rook",
//         "location": "07",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": null,
//         "location": "10",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": null,
//         "location": "11",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": "pawn",
//         "location": "12",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "pawn",
//         "location": "13",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "pawn",
//         "location": "14",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "pawn",
//         "location": "15",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "pawn",
//         "location": "16",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": null,
//         "location": "17",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": null,
//         "location": "20",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": "pawn",
//         "location": "21",
//         "hasMoved": true,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": null,
//         "location": "22",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "23",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "24",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "25",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "26",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "27",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "30",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": null,
//         "location": "31",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "32",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "33",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "34",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "35",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "36",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": "pawn",
//         "location": "37",
//         "hasMoved": true,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": null,
//         "location": "40",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": "pawn",
//         "location": "41",
//         "hasMoved": true,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": null,
//         "location": "42",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "43",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "44",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "45",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "46",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "47",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "50",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "51",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "52",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "53",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "54",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "55",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "56",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "57",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "60",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": null,
//         "location": "61",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": "pawn",
//         "location": "62",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "pawn",
//         "location": "63",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "pawn",
//         "location": "64",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "pawn",
//         "location": "65",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "pawn",
//         "location": "66",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "pawn",
//         "location": "67",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "rook",
//         "location": "70",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "knight",
//         "location": "71",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "bishop",
//         "location": "72",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "queen",
//         "location": "73",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "king",
//         "location": "74",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "bishop",
//         "location": "75",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "knight",
//         "location": "76",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "rook",
//         "location": "77",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     }
// ]

//bishop test board
// boardArray = [
//     {
//         "piece": "rook",
//         "location": "00",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "knight",
//         "location": "01",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "bishop",
//         "location": "02",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "queen",
//         "location": "03",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "king",
//         "location": "04",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "bishop",
//         "location": "05",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "knight",
//         "location": "06",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "rook",
//         "location": "07",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "pawn",
//         "location": "10",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": null,
//         "location": "11",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": "pawn",
//         "location": "12",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": null,
//         "location": "13",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": "pawn",
//         "location": "14",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "pawn",
//         "location": "15",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "pawn",
//         "location": "16",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "pawn",
//         "location": "17",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": null,
//         "location": "20",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": "pawn",
//         "location": "21",
//         "hasMoved": true,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": null,
//         "location": "22",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": "pawn",
//         "location": "23",
//         "hasMoved": true,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": null,
//         "location": "24",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "25",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "26",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "27",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "30",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "31",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "32",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "33",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "34",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "35",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "36",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "37",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "40",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "41",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "42",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "43",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "44",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "45",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "46",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "47",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "50",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": "pawn",
//         "location": "51",
//         "hasMoved": true,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": null,
//         "location": "52",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": "pawn",
//         "location": "53",
//         "hasMoved": true,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": null,
//         "location": "54",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "55",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "56",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "57",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": "pawn",
//         "location": "60",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": null,
//         "location": "61",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": "pawn",
//         "location": "62",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": null,
//         "location": "63",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": "pawn",
//         "location": "64",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "pawn",
//         "location": "65",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "pawn",
//         "location": "66",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "pawn",
//         "location": "67",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "rook",
//         "location": "70",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "knight",
//         "location": "71",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "bishop",
//         "location": "72",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "queen",
//         "location": "73",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "king",
//         "location": "74",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "bishop",
//         "location": "75",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "knight",
//         "location": "76",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "rook",
//         "location": "77",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     }
// ]

// queen test board
// boardArray = [
//     {
//         "piece": "rook",
//         "location": "00",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "knight",
//         "location": "01",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "bishop",
//         "location": "02",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "queen",
//         "location": "03",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "king",
//         "location": "04",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "bishop",
//         "location": "05",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "knight",
//         "location": "06",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "rook",
//         "location": "07",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "pawn",
//         "location": "10",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": null,
//         "location": "11",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": null,
//         "location": "12",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": null,
//         "location": "13",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": null,
//         "location": "14",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": "pawn",
//         "location": "15",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "pawn",
//         "location": "16",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "pawn",
//         "location": "17",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": null,
//         "location": "20",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "21",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": "pawn",
//         "location": "22",
//         "hasMoved": true,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": null,
//         "location": "23",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "24",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "25",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "26",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "27",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "30",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "31",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "32",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "33",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": null,
//         "location": "34",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": null,
//         "location": "35",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "36",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "37",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "40",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "41",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "42",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": null,
//         "location": "43",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": null,
//         "location": "44",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "45",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "46",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "47",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "50",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "51",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "52",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "53",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": "pawn",
//         "location": "54",
//         "hasMoved": true,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": null,
//         "location": "55",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "56",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "57",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": "pawn",
//         "location": "60",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "pawn",
//         "location": "61",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": null,
//         "location": "62",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": null,
//         "location": "63",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": null,
//         "location": "64",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": null,
//         "location": "65",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": "pawn",
//         "location": "66",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "pawn",
//         "location": "67",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "rook",
//         "location": "70",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "knight",
//         "location": "71",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "bishop",
//         "location": "72",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "queen",
//         "location": "73",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "king",
//         "location": "74",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "bishop",
//         "location": "75",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "knight",
//         "location": "76",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "rook",
//         "location": "77",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     }
// ]

// castling test board
// boardArray = [
//     {
//         "piece": "rook",
//         "location": "00",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": null,
//         "location": "01",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": null,
//         "location": "02",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": null,
//         "location": "03",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": "king",
//         "location": "04",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": null,
//         "location": "05",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": null,
//         "location": "06",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": "rook",
//         "location": "07",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "pawn",
//         "location": "10",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "bishop",
//         "location": "11",
//         "hasMoved": true,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "pawn",
//         "location": "12",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": null,
//         "location": "13",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": "pawn",
//         "location": "14",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "pawn",
//         "location": "15",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "bishop",
//         "location": "16",
//         "hasMoved": true,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "pawn",
//         "location": "17",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": "knight",
//         "location": "20",
//         "hasMoved": true,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": null,
//         "location": "21",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "22",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": "queen",
//         "location": "23",
//         "hasMoved": true,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": null,
//         "location": "24",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "25",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "26",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": "knight",
//         "location": "27",
//         "hasMoved": true,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": null,
//         "location": "30",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": "pawn",
//         "location": "31",
//         "hasMoved": true,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": null,
//         "location": "32",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": "pawn",
//         "location": "33",
//         "hasMoved": true,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": null,
//         "location": "34",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "35",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": "pawn",
//         "location": "36",
//         "hasMoved": true,
//         "isSelected": false,
//         "color": "black"
//     },
//     {
//         "piece": null,
//         "location": "37",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "40",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": "pawn",
//         "location": "41",
//         "hasMoved": true,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": null,
//         "location": "42",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": "pawn",
//         "location": "43",
//         "hasMoved": true,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": null,
//         "location": "44",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "45",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": "pawn",
//         "location": "46",
//         "hasMoved": true,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": null,
//         "location": "47",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": "knight",
//         "location": "50",
//         "hasMoved": true,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": null,
//         "location": "51",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "52",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": "queen",
//         "location": "53",
//         "hasMoved": true,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": null,
//         "location": "54",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "55",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": null,
//         "location": "56",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": null
//     },
//     {
//         "piece": "knight",
//         "location": "57",
//         "hasMoved": true,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "pawn",
//         "location": "60",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "bishop",
//         "location": "61",
//         "hasMoved": true,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "pawn",
//         "location": "62",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": null,
//         "location": "63",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": "pawn",
//         "location": "64",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "pawn",
//         "location": "65",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "bishop",
//         "location": "66",
//         "hasMoved": true,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "pawn",
//         "location": "67",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": "rook",
//         "location": "70",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": null,
//         "location": "71",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": null,
//         "location": "72",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": null,
//         "location": "73",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": "king",
//         "location": "74",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     },
//     {
//         "piece": null,
//         "location": "75",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": null,
//         "location": "76",
//         "hasMoved": false,
//         "color": null,
//         "isSelected": false
//     },
//     {
//         "piece": "rook",
//         "location": "77",
//         "hasMoved": false,
//         "isSelected": false,
//         "color": "white"
//     }
// ]

// self checking king test board
boardArray = [
  {
    piece: 'rook',
    location: '00',
    hasMoved: false,
    isSelected: false,
    color: 'black',
  },
  {
    piece: 'knight',
    location: '01',
    hasMoved: false,
    isSelected: false,
    color: 'black',
  },
  {
    piece: 'bishop',
    location: '02',
    hasMoved: false,
    isSelected: false,
    color: 'black',
  },
  {
    piece: null,
    location: '03',
    hasMoved: false,
    color: null,
    isSelected: false,
  },
  {
    piece: 'king',
    location: '04',
    hasMoved: false,
    isSelected: false,
    color: 'black',
  },
  {
    piece: 'bishop',
    location: '05',
    hasMoved: false,
    isSelected: false,
    color: 'black',
  },
  {
    piece: 'knight',
    location: '06',
    hasMoved: false,
    isSelected: false,
    color: 'black',
  },
  {
    piece: 'rook',
    location: '07',
    hasMoved: false,
    isSelected: false,
    color: 'black',
  },
  {
    piece: 'pawn',
    location: '10',
    hasMoved: false,
    isSelected: false,
    color: 'black',
  },
  {
    piece: 'pawn',
    location: '11',
    hasMoved: false,
    isSelected: false,
    color: 'black',
  },
  {
    piece: 'pawn',
    location: '12',
    hasMoved: false,
    isSelected: false,
    color: 'black',
  },
  {
    piece: null,
    location: '13',
    hasMoved: false,
    color: null,
    isSelected: false,
  },
  {
    piece: 'queen',
    location: '14',
    hasMoved: true,
    isSelected: false,
    color: 'black',
  },
  {
    piece: null,
    location: '15',
    hasMoved: false,
    color: null,
    isSelected: false,
  },
  {
    piece: 'pawn',
    location: '16',
    hasMoved: false,
    isSelected: false,
    color: 'black',
  },
  {
    piece: 'pawn',
    location: '17',
    hasMoved: false,
    isSelected: false,
    color: 'black',
  },
  {
    piece: null,
    location: '20',
    hasMoved: false,
    isSelected: false,
    color: null,
  },
  {
    piece: null,
    location: '21',
    hasMoved: false,
    isSelected: false,
    color: null,
  },
  {
    piece: null,
    location: '22',
    hasMoved: false,
    isSelected: false,
    color: null,
  },
  {
    piece: 'pawn',
    location: '23',
    hasMoved: true,
    isSelected: false,
    color: 'black',
  },
  {
    piece: null,
    location: '24',
    hasMoved: false,
    isSelected: false,
    color: null,
  },
  {
    piece: null,
    location: '25',
    hasMoved: false,
    isSelected: false,
    color: null,
  },
  {
    piece: null,
    location: '26',
    hasMoved: false,
    isSelected: false,
    color: null,
  },
  {
    piece: null,
    location: '27',
    hasMoved: false,
    isSelected: false,
    color: null,
  },
  {
    piece: null,
    location: '30',
    hasMoved: false,
    isSelected: false,
    color: null,
  },
  {
    piece: null,
    location: '31',
    hasMoved: false,
    isSelected: false,
    color: null,
  },
  {
    piece: null,
    location: '32',
    hasMoved: false,
    isSelected: false,
    color: null,
  },
  {
    piece: null,
    location: '33',
    hasMoved: false,
    color: null,
    isSelected: false,
  },
  {
    piece: null,
    location: '34',
    hasMoved: false,
    isSelected: false,
    color: null,
  },
  {
    piece: null,
    location: '35',
    hasMoved: false,
    color: null,
    isSelected: false,
  },
  {
    piece: null,
    location: '36',
    hasMoved: false,
    isSelected: false,
    color: null,
  },
  {
    piece: null,
    location: '37',
    hasMoved: false,
    isSelected: false,
    color: null,
  },
  {
    piece: null,
    location: '40',
    hasMoved: false,
    isSelected: false,
    color: null,
  },
  {
    piece: null,
    location: '41',
    hasMoved: false,
    isSelected: false,
    color: null,
  },
  {
    piece: null,
    location: '42',
    hasMoved: false,
    isSelected: false,
    color: null,
  },
  {
    piece: 'pawn',
    location: '43',
    hasMoved: true,
    isSelected: false,
    color: 'white',
  },
  {
    piece: null,
    location: '44',
    hasMoved: false,
    color: null,
    isSelected: false,
  },
  {
    piece: null,
    location: '45',
    hasMoved: false,
    isSelected: false,
    color: null,
  },
  {
    piece: 'pawn',
    location: '46',
    hasMoved: true,
    isSelected: false,
    color: 'black',
  },
  {
    piece: null,
    location: '47',
    hasMoved: false,
    isSelected: false,
    color: null,
  },
  {
    piece: null,
    location: '50',
    hasMoved: false,
    isSelected: false,
    color: null,
  },
  {
    piece: null,
    location: '51',
    hasMoved: false,
    isSelected: false,
    color: null,
  },
  {
    piece: null,
    location: '52',
    hasMoved: false,
    isSelected: false,
    color: null,
  },
  {
    piece: null,
    location: '53',
    hasMoved: false,
    isSelected: false,
    color: null,
  },
  {
    piece: null,
    location: '54',
    hasMoved: false,
    isSelected: false,
    color: null,
  },
  {
    piece: null,
    location: '55',
    hasMoved: false,
    isSelected: false,
    color: null,
  },
  {
    piece: null,
    location: '56',
    hasMoved: false,
    isSelected: false,
    color: null,
  },
  {
    piece: null,
    location: '57',
    hasMoved: false,
    isSelected: false,
    color: null,
  },
  {
    piece: 'pawn',
    location: '60',
    hasMoved: false,
    isSelected: false,
    color: 'white',
  },
  {
    piece: 'pawn',
    location: '61',
    hasMoved: false,
    isSelected: false,
    color: 'white',
  },
  {
    piece: 'pawn',
    location: '62',
    hasMoved: false,
    isSelected: false,
    color: 'white',
  },
  {
    piece: 'king',
    location: '63',
    hasMoved: true,
    isSelected: false,
    color: 'white',
  },
  {
    piece: null,
    location: '64',
    hasMoved: false,
    color: null,
    isSelected: false,
  },
  {
    piece: 'pawn',
    location: '65',
    hasMoved: false,
    isSelected: false,
    color: 'white',
  },
  {
    piece: null,
    location: '66',
    hasMoved: false,
    color: null,
    isSelected: false,
  },
  {
    piece: 'pawn',
    location: '67',
    hasMoved: false,
    isSelected: false,
    color: 'white',
  },
  {
    piece: 'rook',
    location: '70',
    hasMoved: false,
    isSelected: false,
    color: 'white',
  },
  {
    piece: 'knight',
    location: '71',
    hasMoved: false,
    isSelected: false,
    color: 'white',
  },
  {
    piece: 'bishop',
    location: '72',
    hasMoved: false,
    isSelected: false,
    color: 'white',
  },
  {
    piece: 'queen',
    location: '73',
    hasMoved: false,
    isSelected: false,
    color: 'white',
  },
  {
    piece: null,
    location: '74',
    hasMoved: false,
    color: null,
    isSelected: false,
  },
  {
    piece: 'bishop',
    location: '75',
    hasMoved: false,
    isSelected: false,
    color: 'white',
  },
  {
    piece: 'knight',
    location: '76',
    hasMoved: false,
    isSelected: false,
    color: 'white',
  },
  {
    piece: 'rook',
    location: '77',
    hasMoved: false,
    isSelected: false,
    color: 'white',
  },
];
displayBoard(boardArray);
