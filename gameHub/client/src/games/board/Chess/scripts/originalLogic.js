const gameBoard = document.querySelector('#gameBoard');
let isWhitesTurn = true; // would be state var
let passant = { isPassant: false }; // another state var
let board = createInitialBoard();

const fnLookup = {
  P: checkPawn,
  R: checkRook,
  N: checkKnight,
  B: checkBishop,
  K: checkKing,
  Q: checkQueen,
};

function createInitialBoard() {
  const setBoardStr =
    'B-R,B-N,B-B,B-Q,B-K,B-B,B-N,B-R,B-P,B-P,B-P,B-P,B-P,B-P,B-P,B-P,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,W-P,W-P,W-P,W-P,W-P,W-P,W-P,W-P,W-R,W-N,W-B,W-Q,W-K,W-B,W-N,W-R';
  // const setBoardStr = '.,B-N,B-B,B-Q,B-K,B-B,B-N,B-R,W-P,B-P,B-P,B-P,B-P,B-P,B-P,B-P,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,W-P,W-P,W-P,W-P,W-P,W-P,W-P,B-P,W-R,W-N,W-B,W-Q,W-K,W-B,W-N,.';

  return setBoardStr.split(',').map((str, idx) => {
    const xCoord = Math.floor(idx / 8);
    const yCoord = idx % 8;
    const loc = `${xCoord}-${yCoord}`;

    return {
      piece: str,
      loc,
      isFirstMove: true,
      isSelected: false,
      fadeIn: false, // used for animation
    };
  });
}

const toggleIsSelected = (location, arr) => {
  const updateSquares = arr.map((sq) => {
    if (sq.piece === '.') return sq;
    return sq.loc === location
      ? { ...sq, isSelected: !sq.isSelected }
      : sq.isSelected
      ? { ...sq, isSelected: false }
      : sq;
  });
  updateSquares.forEach((sq) => {
    const element = document.getElementById(`${sq.loc}`);
    if (sq.isSelected) {
      console.log(element);
    }
    return sq.isSelected
      ? element.classList.add('selected')
      : element.classList.remove('selected');
  });
  console.log(updateSquares);
  return updateSquares;
};

const displayBoard = (arr) => {
  let isDarkSq = false;
  // empty's container before displaying new board
  Array(...gameBoard.children).forEach((child) => gameBoard.removeChild(child));

  Array(8)
    .fill(null)
    .map((square, idx) => {
      const start = idx * 8;
      const end = start + 8;
      if (idx % 2) isDarkSq = isDarkSq;

      // creates the row that the squares populate
      gameBoard.insertAdjacentHTML(
        'beforeend',
        `<div id="row${idx}" class="row">
  `
      );

      const currentRow = document.querySelector(`#row${idx}`);
      arr.slice(start, end).map((sq, index) => {
        const selected = sq.isSelected ? 'selected' : '';
        const pieceClass = sq.piece !== '.' ? ` ${sq.piece} piece` : '';
        if (index === 0) isDarkSq = !isDarkSq;
        isDarkSq = !isDarkSq;
        const sqColor = isDarkSq ? 'dark' : 'light';

        currentRow.insertAdjacentHTML(
          'beforeend',
          `<div data-value=${sq.piece} id='${idx}-${index}' class='${sqColor} ${pieceClass} ${selected}'></div>
      `
        );
      });
    });
  // call the animation FN here.
  // return animatePieces(arr);
};

const getClickData = (location) => {
  const [clickedSq] = board.filter((sq) => sq.loc === location);
  const [color, piece] = clickedSq.piece.split('-');
  return [clickedSq, color, piece];
};

const checkEnPassant = (fmSq, toSq, gameBoard) => {
  const toRank = Number(toSq.loc.split('-')[0]);
  const toFile = Number(toSq.loc.split('-')[1]);
  const [fmColor] = fmSq.piece.split('-');
  const altColor = fmSq.piece.split('-')[0] === 'W' ? 'B' : 'W';
  const altPawn = `${altColor}-P`;
  const targetToSq =
    fmColor === 'W' ? `${toRank + 1}-${toFile}` : `${toRank - 1}-${toFile}`;

  const checkSqs = [
    `${toRank}-${!toFile ? null : toFile - 1}`,
    `${toRank}-${toFile === 7 ? null : toFile + 1}`,
  ];

  const pieceCheck = gameBoard
    .filter((sq) => checkSqs.includes(sq.loc))
    .map((obj) => obj.piece === altPawn);

  // sets object props based on passant conditons
  passant = {
    isPassant: pieceV.includes(true),
    targetToSq: pieceCheck.includes(true) ? targetToSq : null,
    takeSq: pieceCheck.includes(true) ? toSq.loc : null,
  };

  return genNewBoard(fmSq, toSq, gameBoard);
};

function checkQueen(fmSq, toSq, gameBoard, isMateCheck = false) {
  const fmRank = Number(fmSq.loc.split('-')[0]);
  const fmFile = Number(fmSq.loc.split('-')[1]);
  if (!queenSquares(fmRank, fmFile).includes(toSq.loc))
    return { success: false };
  const altColor = fmSq.piece.split('-')[0] === 'W' ? 'B' : 'W';
  const [toColor] = toSq.piece.split('-');
  const toRank = Number(toSq.loc.split('-')[0]);
  const toFile = Number(toSq.loc.split('-')[1]);
  const isMoveToLeft = fmFile > toFile;
  const isMoveForward = fmRank > toRank;
  const isSameRank = fmRank === toRank;
  const isSameFile = fmFile === toFile;

  const arrLen = isSameRank
    ? Math.abs(fmFile - toFile) + 1
    : Math.abs(fmRank - toRank) + 1;

  const directionToMove = [
    isMoveForward && isMoveToLeft && !isSameRank, // left forward
    isMoveForward && !isMoveToLeft && !isSameFile, // right forward
    !isMoveForward && isMoveToLeft && !isSameRank, // left backward
    !isMoveForward && !isMoveToLeft && !isSameRank && !isSameFile, // rt back
    isSameRank && isMoveToLeft, // left on rank
    isSameRank && !isMoveToLeft, // right on rank
    !isSameRank && isMoveForward && isSameFile, // forward on file
    !isSameRank && !isMoveForward && isSameFile, // backward on file
  ];

  const areValidMoves = Array(arrLen)
    .fill(null)
    .map((_, i) => {
      if (!i) return true;

      const locLookup = [
        `${fmRank - i}-${fmFile - i}`, // left forward
        `${fmRank - i}-${fmFile + i}`, // right forward
        `${fmRank + i}-${fmFile - i}`, // left backward
        `${fmRank + i}-${fmFile + i}`, // right backward
        `${fmRank}-${fmFile - i}`, // left on rank
        `${fmRank}-${fmFile + i}`, // right on rank
        `${fmRank - i}-${fmFile}`, // forward on file
        `${fmRank + i}-${fmFile}`, // backward on file
      ];

      const sqLocation = locLookup[directionToMove.indexOf(true)];
      const [square] = gameBoard.filter((sq) => sq.loc === sqLocation);

      if (isMateCheck) return square;

      return i + 1 === arrLen // check for landing sq
        ? square.piece === '.' || toColor === altColor
        : square.piece === '.';
    });

  // CHANGED RETURN CHANGED RETURN CHANGED RETURN
  console.log('areValidMoves', areValidMoves);
  if (isMateCheck) return areValidMoves.slice(1, areValidMoves.length - 1);
  if (isMateCheck)
    return {
      squares: areValidMoves.slice(1, areValidMoves.length - 1),
      success: false, // issue here i cant figure out
    };
  return areValidMoves.includes(false)
    ? { success: false }
    : genNewBoard(fmSq, toSq, gameBoard);

  return !areValidMoves.includes(false)
    ? genNewBoard(fmSq, toSq, gameBoard)
    : { success: false };
}

function checkKing(fmSq, toSq, gameBoard) {
  // console.log(fmSq)
  // console.log(toSq)
  const fmRank = Number(fmSq.loc.split('-')[0]);
  const fmFile = Number(fmSq.loc.split('-')[1]);
  const toRank = Number(toSq.loc.split('-')[0]);
  const toFile = Number(toSq.loc.split('-')[1]);
  let checkSqs = kingSquares(fmRank, fmFile);

  // castling conditions check
  if (fmSq.loc === `${fmRank}-${4}` && fmSq.isFirstMove) {
    console.log('in castling condition check');
    const checkForCastling = checkCastleConditions(fmSq, toSq, gameBoard);
    if (checkForCastling.success) return checkForCastling;
  }

  if (!kingSquares(fmRank, fmFile).includes(toSq.loc))
    return { success: false };
  const altColor = fmSq.piece.split('-')[0] === 'W' ? 'B' : 'W';
  const [toColor] = toSq.piece.split('-');

  return altColor === toColor || toSq.piece === '.'
    ? genNewBoard(fmSq, toSq, gameBoard)
    : { success: false, checkBoard: gameBoard }; // added checkBoard prop
}

function checkBishop(fmSq, toSq, gameBoard, isMateCheck = false) {
  const fmRank = Number(fmSq.loc.split('-')[0]);
  const fmFile = Number(fmSq.loc.split('-')[1]);
  if (!bishopSquares(fmRank, fmFile).includes(toSq.loc))
    return { success: false };
  const altColor = fmSq.piece.split('-')[0] === 'W' ? 'B' : 'W';
  const [toColor] = toSq.piece.split('-');
  const toRank = Number(toSq.loc.split('-')[0]);
  const toFile = Number(toSq.loc.split('-')[1]);
  const arrLen = Math.abs(fmFile - toFile) + 1;
  const isMoveToLeft = fmFile > toFile;
  const isMoveForward = fmRank > toRank;

  const directionToMove = [
    isMoveForward && isMoveToLeft, // left forward
    isMoveForward && !isMoveToLeft, // right forward
    !isMoveForward && isMoveToLeft, // left backward
    !isMoveForward && !isMoveToLeft, // right backward
  ];

  const areValidMoves = Array(arrLen)
    .fill(null)
    .map((_, i) => {
      if (!i) return null;

      const locLookup = [
        `${fmRank - i}-${fmFile - i}`, // left forward
        `${fmRank - i}-${fmFile + i}`, // right forward
        `${fmRank + i}-${fmFile - i}`, // left backward
        `${fmRank + i}-${fmFile + i}`, // right backward
      ];
      const sqLocation = locLookup[directionToMove.indexOf(true)];
      const [square] = gameBoard.filter((sq) => sq.loc === sqLocation);

      // checkMate FN only needs the path of the atk piece leading to king
      if (isMateCheck) return square;

      return i + 1 === arrLen // check for landing sq
        ? square.piece === '.' || toColor === altColor
        : square.piece === '.';
    });

  // CHANGED THIS RETURN CHANGED THIS RETURN CHANGED THIS RETURN //
  // checkMate FN only needs arr of squares that make up atk path to king
  if (isMateCheck)
    return {
      squares: areValidMoves.slice(1, areValidMoves.length - 1),
      success: true,
    };

  return !areValidMoves.includes(false)
    ? genNewBoard(fmSq, toSq, gameBoard)
    : { success: false };
}

function checkKnight(fmSq, toSq, gameBoard) {
  const fmRank = Number(fmSq.loc.split('-')[0]);
  const fmFile = Number(fmSq.loc.split('-')[1]);
  if (!knightSquares(fmRank, fmFile).includes(toSq.loc))
    return { success: false };
  const [toColor] = toSq.piece.split('-');
  const altColor = fmSq.piece.split('-')[0] === 'W' ? 'B' : 'W';

  return toSq.piece === '.' || toColor === altColor
    ? genNewBoard(fmSq, toSq, gameBoard)
    : { success: false };
}

function checkRook(fmSq, toSq, gameBoard, isMateCheck = false) {
  const fmRank = Number(fmSq.loc.split('-')[0]);
  const fmFile = Number(fmSq.loc.split('-')[1]);
  if (!rookSquares(fmRank, fmFile).includes(toSq.loc))
    return { success: false };
  const altColor = fmSq.piece.split('-')[0] === 'W' ? 'B' : 'W';
  const [toColor] = toSq.piece.split('-');
  const toRank = Number(toSq.loc.split('-')[0]);
  const toFile = Number(toSq.loc.split('-')[1]);
  const isSameRank = fmRank === toRank;
  const isMoveToLeft = fmFile > toFile;
  const isMoveForward = fmRank > toRank;
  const arrLen = isSameRank
    ? Math.abs(fmFile - toFile) + 1
    : Math.abs(fmRank - toRank) + 1;

  const areValidMoves = Array(arrLen)
    .fill(null)
    .map((_, i) => {
      if (!i) return null;
      const locLookup = {
        rankSqLoc: isMoveToLeft
          ? `${fmRank}-${fmFile - i}`
          : `${fmRank}-${fmFile + i}`,
        fileSqLoc: isMoveForward
          ? `${fmRank - i}-${fmFile}`
          : `${fmRank + i}-${fmFile}`,
      };
      const { rankSqLoc, fileSqLoc } = locLookup;
      const sqLocation = isSameRank ? rankSqLoc : fileSqLoc;
      const [square] = gameBoard.filter((sq) => sq.loc === sqLocation);

      // checkMate FN only needs the path of the atk piece leading to king
      if (isMateCheck) return square;

      // check for landing sq; it can be an occupied sq of opp color
      return i + 1 === arrLen
        ? square.piece === '.' || toColor === altColor
        : square.piece === '.';
    });

  // checkMate FN only needs arr of squares that make up atk path to king
  // CHANGED RETURN CHANGED RETURN CHANGED RETURN
  if (isMateCheck) return areValidMoves.slice(1, areValidMoves.length - 1);
  if (isMateCheck)
    return {
      squares: areValidMoves.slice(1, areValidMoves.length - 1),
      success: true,
    };
  return areValidMoves.includes(false)
    ? { success: false }
    : genNewBoard(fmSq, toSq, gameBoard);
}

function checkPawn(fmSq, toSq, gameBoard, isKingCheck = false) {
  const { loc: fromLoc, piece: fmPiece, isFirstMove } = fmSq;
  const fmRank = Number(fromLoc.split('-')[0]);
  const fmFile = Number(fromLoc.split('-')[1]);
  const [fmColor] = fmPiece.split('-');

  const { loc: toLoc } = toSq;
  const toRank = Number(toLoc.split('-')[0]);
  const toFile = Number(toLoc.split('-')[1]);
  const [toColor] = toSq.piece.split('-');

  const checkRank1 = fmColor === 'W' ? fmRank - 1 : fmRank + 1;
  const checkRank2 = fmColor === 'W' ? fmRank - 2 : fmRank + 2;
  const altColor = fmColor === 'W' ? 'B' : 'W';

  const upgradeRank = `${fmColor === 'W' ? 0 : 7}-${fmFile}`;

  // if (upgradeRank === toSq.loc && !isKingCheck) {
  //   console.log('test123')
  //     // this is when you would display an input/selection menu for the user to
  //     // select which upgrade piece they would like.
  //     // for now we will default to the queen for testing
  //   const upgradedPiece = {...fmSq, piece: `${fmColor}-Q` }
  //   console.log(upgradedPiece)
  //   return genNewBoard(upgradedPiece, toSq, gameBoard);
  // }

  if (!pawnSquares(fmRank, fmFile, fmColor, isFirstMove).includes(toLoc))
    return { success: false };

  if (passant.isPassant && toSq.loc === passant.targetToSq) {
    // passant checks
    const updatedBoard = gameBoard.map((sq) => {
      return sq.loc === passant.takeSq
        ? { ...sq, piece: '.', isFirstMove: true }
        : sq;
    });
    return genNewBoard(fmSq, toSq, updatedBoard);
  } else {
    passant = { isPassant: false };
  }

  // check for pawn forward 1 square
  if (checkRank1 === toRank && fmFile === toFile) {
    if (toSq.piece !== '.') return { success: false };
  }

  // check for pawn forward 2 squares
  if (checkRank2 === toRank && fmFile === toFile) {
    const blockCoords = `${checkRank1}-${fmFile}`;
    const [blockSq] = board.filter((sq) => sq.loc === blockCoords);

    return toSq.piece !== '.' || blockSq.piece !== '.'
      ? { success: false }
      : checkEnPassant(fmSq, toSq, gameBoard);
  }

  // check for pawn left diagonal move
  if (checkRank1 === toRank && fmFile - 1 === toFile) {
    if (toColor !== altColor) return { success: false };
  }

  // check for pawn right diagonal move
  if (checkRank1 === toRank && fmFile + 1 === toFile) {
    if (toColor !== altColor) return { success: false };
  }

  return genNewBoard(fmSq, toSq, gameBoard);
}

const isKingInCheck = (newBoard, isWhTurn) => {
  const [currColor, oppColor] = isWhTurn ? ['W', 'B'] : ['B', 'W'];
  const [currKing] = newBoard.filter((sq) => sq.piece === `${currColor}-K`);
  const currPieces = newBoard.filter((sq) => sq.piece.startsWith(currColor));
  const [oppKing] = newBoard.filter((sq) => sq.piece === `${oppColor}-K`);
  const oppPieces = newBoard.filter((sq) => sq.piece.startsWith(oppColor));

  const lookUp = [
    [oppPieces, currKing, newBoard],
    [currPieces, oppKing, newBoard],
  ];

  const [currKingData, oppKingData] = lookUp.map((specs) => {
    return specs[0].reduce(
      (prev, curr) => {
        if (prev.isCheck) return prev;
        const [, piece] = curr.piece.split('-');
        const fn = fnLookup[piece];
        const result = fn(curr, specs[1], specs[2]);
        // console.log('results', result, piece)
        return result.success ? { isCheck: true, causedCheck: curr } : prev;
      },
      { isCheck: false, causedCheck: null }
    );
  });

  return {
    inCheck: oppKingData.isCheck,
    currKingData,
    oppKingData,
    newBoard,
  };
};

const genNewBoard = (selSq, moveSq, gameBoard) => {
  // console.log('selSq', selSq)
  // console.log('moveSq', moveSq)
  const { loc: moveLoc, isFirstMove, piece } = moveSq;
  const checkBoard = gameBoard.map((sq) => {
    return sq.loc === moveSq.loc
      ? { ...sq, piece: selSq.piece, isFirstMove: false, fadeIn: true }
      : sq.loc === selSq.loc
      ? { ...sq, piece: '.', isFirstMove: true, isSelected: false }
      : sq;
  });

  return { success: true, checkBoard };
};

const canKingMove = (kingSq, boardInQuestion, isWhTurn) => {
  console.log('in kingmove');
  const rank = Number(kingSq.loc.split('-')[0]);
  const file = Number(kingSq.loc.split('-')[1]);
  const testSqs = kingSquares(rank, file).map(
    (loc) => boardInQuestion.filter((sq) => sq.loc === loc)[0]
  );

  const isPossibleMoveArr = Array(testSqs.length)
    .fill(null)
    .map((_, i) => {
      const canMoveToSq = checkKing(kingSq, testSqs[i], boardInQuestion);
      return isKingInCheck(canMoveToSq.checkBoard, isWhTurn);
    });

  return isPossibleMoveArr;
};

const checkCheckMate = (kingData) => {
  const { currKingData, oppKingData, newBoard } = kingData;
  const [currColor, oppColor] = isWhitesTurn ? ['W', 'B'] : ['B', 'W'];
  const color = oppKingData.isCheck ? oppColor : currColor;
  const kingsPieces = newBoard.filter((sq) => sq.piece.startsWith(oppColor));

  const causedCheck = oppKingData.isCheck
    ? oppKingData.causedCheck
    : currKingData.causedCheck;

  const king = newBoard.filter((sq) => sq.piece === `${color}-K`)[0];
  const kingHasMove = canKingMove(king, newBoard, isWhitesTurn).filter(
    (elem) => !elem.inCheck
  );
  // return if king can get itself out of check
  if (kingHasMove.length > 0) return true;

  // gets the atk path
  const atkPiece = oppKingData.causedCheck;
  const [, atkPieceName] = atkPiece.piece.split('-');
  const fn = fnLookup[atkPieceName];

  // knight/pawn/king dont have atk paths.
  // may need something specific for K based on game rules
  const atkPath = ['N', 'P', 'K'].includes(atkPieceName)
    ? [atkPiece]
    : [...fn(atkPiece, king, newBoard, true).squares, atkPiece];

  console.log('atkPath', atkPath);
  const canPreventMate = atkPath.reduce((prev, toSq) => {
    if (prev === true) return prev; // will prevent unnecessary checks
    const canBlockSq = kingsPieces.reduce((prev, fmSq) => {
      if (prev === true) return prev; // will prevent unnecessary checks
      const fmPiece = fmSq.piece.split('-')[1];
      if (fmPiece === 'K') return false;
      const fn = fnLookup[fmPiece];

      return fn(fmSq, toSq, newBoard).success;
    }, false);
    return canBlockSq;
  }, false);

  return canPreventMate;
};

const checkCastleConditions = (fmSq, toSq, currBoard) => {
  const fmRank = Number(fmSq.loc.split('-')[0]);
  const fmFile = Number(fmSq.loc.split('-')[1]);
  const toRank = Number(toSq.loc.split('-')[0]);
  const toFile = Number(toSq.loc.split('-')[1]);
  const validCastleSq = [`${fmRank}-2`, `${fmRank}-6`];

  if (!validCastleSq.includes(toSq.loc)) return { success: false };

  const isCastleLeft = toFile < fmFile;

  // returns arr of booleans to check if path is empty
  // need to check if king would be in check here as well
  const isPathClear = Array(Number(`${isCastleLeft ? 4 : 3}`))
    .fill(null)
    .map((_, i) => {
      const newFile = isCastleLeft ? 3 - i : 5 + i;
      const [checkSq] = currBoard.filter(
        (sq) => sq.loc === `${fmRank}-${newFile}`
      );

      // checks relevant Rook
      if (checkSq.piece.endsWith('R')) return checkSq.isFirstMove;
      // ensures sq is empty
      if (checkSq.piece !== '.') return false;
      //  case for when castling left
      if (checkSq.piece === '.' && i === 2) return true;

      // determines whether king will be under atk when castling
      const { checkBoard } = genNewBoard(fmSq, checkSq, currBoard);
      const { inCheck } = isKingInCheck(checkBoard, !isWhitesTurn);
      return !inCheck;
    });

  const castleStartLoc = isCastleLeft ? `${fmRank}-0` : `${fmRank}-7`;
  const [castleStartSq] = currBoard.filter((sq) => sq.loc === castleStartLoc);
  const castleEndLoc = isCastleLeft ? `${fmRank}-3` : `${fmRank}-5`;
  const [castleEndSq] = currBoard.filter((sq) => sq.loc === castleEndLoc);
  const { checkBoard } = genNewBoard(fmSq, toSq, currBoard);

  const updatedBoard = genNewBoard(
    castleStartSq,
    castleEndSq,
    checkBoard
  ).checkBoard;

  return isPathClear.includes(false)
    ? { success: false }
    : { success: true, checkBoard: updatedBoard };
};

const processClick = (selectedSq, moveToSq, currBoard) => {
  const [currColor, oppColor] = isWhitesTurn ? ['W', 'B'] : ['B', 'W'];

  const { piece: selPiece } = selectedSq;
  const [, name] = selPiece.split('-');
  const fn = fnLookup[name];
  const isValidMove = fn(selectedSq, moveToSq, currBoard);

  if (!isValidMove.success) return console.log('invalid move');

  const { checkBoard } = isValidMove;
  const kingCheck = isKingInCheck(checkBoard, isWhitesTurn);
  console.log('kingCheck', kingCheck);
  const { currKingData, oppKingData, newBoard } = kingCheck;
  const isWhiteInCheck =
    currColor === 'W' ? currKingData.isCheck : oppKingData.isCheck;

  const isBlackInCheck =
    currColor === 'W' ? oppKingData.isCheck : currKingData.isCheck;

  if ((isWhitesTurn && isWhiteInCheck) || (!isWhitesTurn && isBlackInCheck)) {
    return console.log('check!@!@!@!@');
  }

  if (oppKingData.isCheck || currKingData.isCheck) {
    const isCheckMate = !checkCheckMate(kingCheck);
    console.log('isCheckMate', isCheckMate);
    // if isCheckMate is true, run end of game functionality
  } // end of condition statement

  isWhitesTurn = !isWhitesTurn;
  board = [...newBoard];
  displayBoard(board);
};

gameBoard.addEventListener('click', (e) => {
  const loc = e.target.id;
  if (!loc.includes('-')) return; // catches bad clicks
  const [moveTo, color, piece] = getClickData(loc);
  const [selected] = board.filter((sq) => sq.isSelected);
  if (color === 'B' && isWhitesTurn && !selected) return; // W turn
  if (color === 'W' && !isWhitesTurn && !selected) return; // B turn

  if (
    (color === 'B' && isWhitesTurn) ||
    (color === 'W' && !isWhitesTurn) ||
    (selected && !piece)
  ) {
    return processClick(selected, moveTo, board);
  }

  // working on animation. the toggling of the selected square is throwing off the animation classes bc its rerendering at the wrong time.
  // not displayBoard board here helps but doesnt entirely fix the problem.
  // now need to look in the displayBoard && genNewBoard functions
  toggleIsSelected(loc, board);
  board = [...toggleIsSelected(loc, board)];
  // displayBoard(board)
});

displayBoard(board); // initial board display

// ANIMATION FN ANIMATION FN ANIMATION FN //

function animatePieces(currBoard) {
  // isStartGame prevents animation on initial board load
  const isStartGame = currBoard.filter((sq) => !sq.isFirstMove);

  // isFadeIn prevents animation on selected sq toggling
  const isFadeIn = currBoard.filter((sq) => sq.fadeIn);
  if (!isStartGame.length || !isFadeIn.length) return;

  const newBoard = currBoard.map((sq) => {
    const square = document.getElementById(`${sq.loc}`);

    if (sq.fadeIn) {
      square.classList.add('animateFadeIn');
    }
    return { ...sq, fadeIn: false };
  });

  if (!isWhitesTurn) {
    setTimeout(() => {
      gameBoard.classList.add('rotateBoard');
      newBoard.map((sq) => {
        const square = document.getElementById(`${sq.loc}`);
        square.classList.add('rotatePiece');
      });
    }, 200);
  } else {
    setTimeout(() => {
      gameBoard.classList.add('reverseRotate');
      newBoard.map((sq) => {
        const square = document.getElementById(`${sq.loc}`);
        square.classList.add('rotatePiece');
      });
    }, 200);

    setTimeout(() => {
      gameBoard.classList.remove('rotateBoard', 'reverseRotate');
    }, 4000);
  }

  board = [...newBoard];
}
console.log(board);
