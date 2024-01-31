const chessModule = (() => {
  // private variables
  const pieceLookup = {
    R: 'rook',
    N: 'knight',
    B: 'bishop',
    Q: 'queen',
    K: 'king',
    P: 'pawn',
  };

  // private methods
  function createInitialBoard() {
    const blackPieces = 'RNBQKBNRPPPPPPPP';
    const whitePieces = 'PPPPPPPPRNBQKBNR';

    return blackPieces
      .concat('.'.repeat(32), whitePieces)
      .split('')
      .map((char, idx) => {
        const rank = Math.floor(idx / 8),
          file = idx % 8;
        const color = idx < 16 ? 'black' : idx > 47 ? 'white' : null;

        return {
          piece: pieceLookup[char] || null,
          location: `${rank}${file}`,
          hasMoved: false,
          isSelected: false,
          color,
        };
      });
  }

  function removeNulls(arr) {
    return arr.filter((str) => !str.includes('null'));
  }

  // helpers of getCheckLocations
  function getBlackPawnMoveLocs(rank, file, hasMoved) {
    const isLastRank = rank === 7,
      isLastFile = file === 7;

    const possibleSquares = {
      SE: `${isLastRank ? null : rank + 1}${!file ? null : file - 1}`,
      S: `${isLastRank ? null : rank + 1}${file}`,
      SW: `${isLastRank ? null : rank + 1}${isLastFile ? null : file + 1}`,
      S2: `${hasMoved ? null : rank + 2}${file}`,
    };

    return removeNulls(Object.values(possibleSquares));
  }

  function getEnPassantMoveLocs(rank, file) {
    return removeNulls([
      `${rank}${!file ? null : +file - 1}`,
      `${rank}${file === 7 ? null : +file + 1}`,
    ]);
  }

  function getWhitePawnMoveLocs(rank, file, hasMoved) {
    const possibleSquares = {
      // F = forwards
      NW: `${!rank ? null : rank - 1}${!file ? null : file - 1}`,
      N: `${!rank ? null : rank - 1}${file}`,
      NE: `${!rank ? null : rank - 1}${file === 7 ? null : file + 1}`,
      N2: `${hasMoved ? null : rank - 2}${file}`,
    };
    return removeNulls(Object.values(possibleSquares));
  }

  function getKingMoveLocs(rank, file) {
    const isLastRank = rank === 7,
      isLastFile = file === 7;

    const possibleSquares = {
      NW: `${!rank ? null : rank - 1}${!file ? null : file - 1}`,
      N: `${!rank ? null : rank - 1}${file}`,
      NE: `${!rank ? null : rank - 1}${isLastFile ? null : file + 1}`,
      E: `${rank}${isLastFile ? null : file + 1}`,
      SE: `${isLastRank ? null : rank + 1}${isLastFile ? null : file + 1}`,
      S: `${isLastRank ? null : rank + 1}${file}`,
      SW: `${isLastRank ? null : rank + 1}${!file ? null : file - 1}`,
      W: `${rank}${!file ? null : file - 1}`,
    };
    return removeNulls(Object.values(possibleSquares));
  }

  function getBishopMoveLocs(rank, file) {
    const possibleSquares = Array(8)
      .fill(null)
      .reduce((prev, _, i) => {
        if (!i) return prev;
        const rankInc = rank + i,
          rankDec = rank - i;
        const fileInc = file + i,
          fileDec = file - i;

        return [
          ...prev,
          `${rankDec < 0 ? null : rankDec}${fileDec < 0 ? null : fileDec}`,
          `${rankDec < 0 ? null : rankDec}${fileInc > 7 ? null : fileInc}`,
          `${rankInc > 7 ? null : rankInc}${fileDec < 0 ? null : fileDec}`,
          `${rankInc > 7 ? null : rankInc}${fileInc > 7 ? null : fileInc}`,
        ];
      }, []);
    return removeNulls(possibleSquares);
  }

  function getRooKMoveLocs(rank, file) {
    const possibleSquares = Array(8)
      .fill(null)
      .reduce((prev, _, idx) => {
        const rankLine = `${rank}${idx}`,
          fileLine = `${idx}${file}`;
        const loc = `${rank}${file}`;

        return [
          ...prev,
          rankLine === loc ? 'null' : rankLine,
          fileLine === loc ? 'null' : fileLine,
        ];
      }, []);

    return removeNulls(possibleSquares);
  }

  function getKnightMoveLocs(rank, file) {
    const possibleSquares = {
      // top left --> clockwise
      one: `${rank < 2 ? null : rank - 2}${!file ? null : file - 1}`,
      two: `${rank < 2 ? null : rank - 2}${file === 7 ? null : file + 1}`,
      three: `${!rank ? null : rank - 1}${file > 5 ? null : file + 2}`,
      four: `${rank === 7 ? null : rank + 1}${file > 5 ? null : file + 2}`,
      five: `${rank > 5 ? null : rank + 2}${file === 7 ? null : file + 1}`,
      six: `${rank > 5 ? null : rank + 2}${!file ? null : file - 1}`,
      seven: `${rank === 7 ? null : rank + 1}${file < 3 ? null : file - 2}`,
      eight: `${!rank ? null : rank - 1}${file < 2 ? null : file - 2}`,
    };

    return removeNulls(Object.values(possibleSquares));
  }

  // ==========public functions========== //
  const getStartBoard = () => createInitialBoard();

  // default arg is used specifically to get the isEnPassant
  const getCheckLocations = (checkPiece, isEnPassant = false) => {
    if (!checkPiece) return [];
    const { piece, location, color, hasMoved } = checkPiece;
    const rank = Number(location.at(0)),
      file = Number(location.at(1));
    let checkLocations = [];

    // console.log('checkPiece: ', checkPiece)

    switch (piece) {
      case 'pawn':
        checkLocations =
          color === 'black'
            ? getBlackPawnMoveLocs(rank, file, hasMoved)
            : getWhitePawnMoveLocs(rank, file, hasMoved);
        break;

      case 'king':
        checkLocations = getKingMoveLocs(rank, file);
        break;
      case 'bishop':
        checkLocations = getBishopMoveLocs(rank, file);
        break;
      case 'rook':
        checkLocations = getRooKMoveLocs(rank, file);
        break;
      case 'queen':
        checkLocations = [
          ...getRooKMoveLocs(rank, file),
          ...getBishopMoveLocs(rank, file),
        ];
        break;
      case 'knight':
        checkLocations = getKnightMoveLocs(rank, file);
        break;
      default:
        if (isEnPassant) {
          return (checkLocations = getEnPassantMoveLocs(rank, file));
        }
        return 'Invalid Data';
    }

    // console.log('checkLocations:', checkLocations)
    return checkLocations;
  };

  // i don't think the getCheckLocations needs to be exposed. call the function in checkValidMove. all that needs to be exposed is the boolean of whether move is valid or not.
  const checkValidMove = (selectedPiece, checkBoard) => {
    // const checkLocations = getCheckLocations(selectedPiece)
    // console.log('checkLocations:', checkLocations)
    // console.log('checkBoard', checkBoard)
  };

  // Interface
  return {
    getStartBoard,
    getCheckLocations,
    checkValidMove,
  };
})();

export default chessModule;

/* LOGIC STEPS FOR DETERMINING IF MOVE IS VALID:
- 1. Based on the piece being moved, determine which squares would be valid placements if that piece was the only one on the board.

- 2. Next, determine if the location of the square you want to move to is a valid placement. If it isn't, it is not a valid move. If it is, proceed to the next step.

- 3. Now, you must use the game board data and  piece capability to determine several things:
  * Are there pieces blocking the route to the landing square (if applicable).
  * Is there a piece occupying the landing square and is it the opposite color.
  * Will the move put the moving piece's king in check.
  * Is it a special situation: en passe, castling, piece upgrade?
  

Using the valid placements, landing square, and game board data

*/
