function pawnSquares(rank, file, color, isFirstMove) {
  const white = {
    // F = forwards
    FL: `${!rank ? null : rank - 1}-${!file ? null : file - 1}`,
    F: `${!rank ? null : rank - 1}-${file}`,
    FR: `${!rank ? null : rank - 1}-${file === 7 ? null : file + 1}`,
    F2: `${rank === 1 || !isFirstMove ? null : rank - 2}-${file}`,
  };

  const black = {
    FL: `${rank === 7 ? null : rank + 1}-${file === 7 ? null : file + 1}`,
    F: `${rank === 7 ? null : rank + 1}-${file}`,
    FR: `${rank === 7 ? null : rank + 1}-${!file ? null : file - 1}`,
    F2: `${rank === 6 || !isFirstMove ? null : rank + 2}-${file}`,
  };

  return Object.values(color === 'W' ? white : black).filter(
    (loc) => !loc.includes('null')
  );
}

function rookSquares(rank, file) {
  const validSqs = Array(8)
    .fill(null)
    .reduce((prev, _, idx) => [...prev, `${rank}-${idx}`, `${idx}-${file}`], [])
    .filter((sq) => sq);

  return validSqs;
}

function knightSquares(rank, file) {
  const validSqs = {
    // top left --> clockwise
    one: `${rank < 2 ? null : rank - 2}-${!file ? null : file - 1}`,
    two: `${rank < 2 ? null : rank - 2}-${file === 7 ? null : file + 1}`,
    three: `${!rank ? null : rank - 1}-${file > 5 ? null : file + 2}`,
    four: `${rank === 7 ? null : rank + 1}-${file > 5 ? null : file + 2}`,
    five: `${rank > 5 ? null : rank + 2}-${file === 7 ? null : file + 1}`,
    six: `${rank > 5 ? null : rank + 2}-${!file ? null : file - 1}`,
    seven: `${rank === 7 ? null : rank + 1}-${file < 3 ? null : file - 2}`,
    eight: `${!rank ? null : rank - 1}-${file < 3 ? null : file - 2}`,
  };
  return Object.values(validSqs).filter((loc) => !loc.includes('null'));
}

function kingSquares(rank, file) {
  const validSqs = {
    TL: `${!rank ? null : rank - 1}-${!file ? null : file - 1}`,
    T: `${!rank ? null : rank - 1}-${file}`,
    TR: `${!rank ? null : rank - 1}-${file === 7 ? null : file + 1}`,
    R: `${rank}-${file === 7 ? null : file + 1}`,
    BR: `${rank === 7 ? null : rank + 1}-${file === 7 ? null : file + 1}`,
    B: `${rank === 7 ? null : rank + 1}-${file}`,
    BL: `${rank === 7 ? null : rank + 1}-${!file ? null : file - 1}`,
    L: `${rank}-${!file ? null : file - 1}`,
  };

  return Object.values(validSqs).filter((loc) => !loc.includes('null'));
}

function bishopSquares(rank, file) {
  const validSqs = Array(8)
    .fill(null)
    .reduce((prev, _, i) => {
      if (!i) return prev;
      const rankInc = rank + i;
      const fileInc = file + i;
      const fileDec = file - i;
      const rankDec = rank - i;

      return [
        ...prev,
        `${rankDec < 0 ? null : rankDec}-${fileDec < 0 ? null : fileDec}`,
        `${rankDec < 0 ? null : rankDec}-${fileInc > 7 ? null : fileInc}`,
        `${rankInc > 7 ? null : rankInc}-${fileDec < 0 ? null : fileDec}`,
        `${rankInc > 7 ? null : rankInc}-${fileInc > 7 ? null : fileInc}`,
      ];
    }, []);

  return validSqs.filter((loc) => !loc.includes('null'));
}

function queenSquares(rank, file) {
  return [...bishopSquares(rank, file), ...rookSquares(rank, file)];
}
