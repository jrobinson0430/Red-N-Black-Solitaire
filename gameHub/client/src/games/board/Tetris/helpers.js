function createInitialBoard () {
  const testBoard = Array(660).fill(null).map((elem, idx) => {
    const row = Math.floor(idx / 20);
    const col = idx % 20;
    return {
      coords: `${row}-${col}`,
      color: null,
    }
  })
  return testBoard
}

const displayBoard = (arr) => {
  Array(...gameBoard.children).forEach(child => gameBoard.removeChild(child))

  Array(33).fill(null).map((square, idx) => {
    const start = idx * 20
    const end = start + 20

  
  // creates the row that the squares populate
  gameBoard.insertAdjacentHTML(
    'beforeend', `<div id="row${idx}" class="row">`
    );

  arr.slice(start, end).map((sq, index) => {
    const colorClass = sq.color ? `${sq.color} border border-dark` : ''
    document.querySelector(`#row${idx}`).insertAdjacentHTML(
      'beforeend',
      `<div id='${idx}-${index}' class='${colorClass} boardSquare'></div>
      `)
    });
  });
  
  Array(33).fill(null).forEach((_,idx) => {
  // horizontal lines
  animationBoard.insertAdjacentHTML('beforeend', `
  <hr class="horizontalLine" style="top: ${idx}rem; left: 0rem">
  `)
  
  if (idx < 19) { // vertical lines
    animationBoard.insertAdjacentHTML('beforeend', `
    <hr class="verticalLine" style="left: ${idx - 15.5}rem">
  `)
  }
})
};

// helper function
function getNums(str) {
  return Number(str.match(/[-0-9]/gi).join(''));
};

function randPiece() {
  return Math.floor(Math.random() * 7);
};


const pcHTMLLookup = [
  ['square', `
  <div style='left: 180px; top: -40px; rotate: 0deg' class='currPiece allPieces twoByTwo'>
    <div
      class='block bgGrn border-left border-top border-dark'
      style='left: 0rem'>
    </div>
    <div
      class='block bgGrn border-top border-left border-right border-dark'
      style='left: 1rem'>
    </div>
    <div
      class='block bgGrn border-left border-bottom border-top  border-dark'
      style='left: 0rem; top: 1rem'>
    </div>
    <div
      class='block bgGrn border border-dark'
      style='left: 1rem; top: 1rem'>
    </div>
  </div>
  `],
  ['tee', `
  <div style='left: 160px; top: -40px; rotate: 0deg' class='currPiece allPieces threeByTwo'>
    <div
      class='block bgRed border-top border-left border-right border-dark'
      style='left: 1rem; top: 0rem'>
    </div>
    <div
      class='block bgRed border-left border-top border-bottom border-dark'
      style='left: 0rem; top: 1rem'>
    </div>
    <div
      class='block bgRed border border-dark'
      style='left: 1rem; top: 1rem'>
    </div>
    <div
      class='block bgRed border-top border-right border-bottom border-dark'
      style='left: 2rem; top: 1rem'>
    </div>
  </div>
  `],
  ['straight', `
  <div style='left: 160px; top: -40px; rotate: 0deg' class='currPiece fourByOne'>
    <div
      class='block bgYel border-left border-top border-bottom border-dark'
      style='left: 0rem'>
    </div>
    <div
      class='block bgYel border border-dark'
      style='left: 1rem'>
    </div>
    <div
      class='block bgYel border-top border-bottom border-dark'
      style='left: 2rem'>
    </div>
    <div
      class='block bgYel border border-dark'
      style='left: 3rem'>
    </div>
  </div>
  `],
  ['leftElbow', `
  <div style='left: 160px; top: -40px; rotate: 0deg' class='currPiece allPieces threeByTwo'>
    <div
      class='block bgBlue border-left border-top border-right border-dark'
      style='left: 0rem'>
    </div>
    <div
      class='block bgBlue border border-dark'
      style='left: 0rem; top:1rem'>
    </div>
    <div
      class='block bgBlue border-top border-bottom border-dark'
      style='left: 1rem; top: 1rem'>
    </div>
    <div
      class='block bgBlue border border-dark'
      style='left: 2rem; top: 1rem'>
    </div>
  </div>
  `],
  ['rightElbow', `
  <div style='left: 160px; top: -40px; rotate: 0deg' class='currPiece allPieces threeByTwo'>
    <div
      class='block bgPurp border-left border-top border-right border-dark'
      style='left: 2rem'>
    </div>
    <div
      class='block bgPurp border border-dark'
      style='left: 0rem; top:1rem'>
    </div>
    <div
      class='block bgPurp border-top border-bottom border-dark'
      style='left: 1rem; top: 1rem'>
    </div>
    <div
      class='block bgPurp border border-dark'
      style='left: 2rem; top: 1rem'>
    </div>
  </div>
  `],
  ['leftZee', `
  <div style='left: 160px; top: -40px; rotate: 0deg' class='currPiece allPieces threeByTwo'>
    <div
      class='block bgOrange border-top border-left border-bottom border-dark'
      style='left: 0rem'>
    </div>
    <div
      class='block border bgOrange  border-dark'
      style='left: 1rem; top:0rem'>
    </div>
    <div
      class='block bgOrange border-left border-right border-bottom border-dark'
      style='left: 1rem; top: 1rem'>
    </div>
    <div
      class='block bgOrange border-top border-right border-bottom border-dark'
      style='left: 2rem; top: 1rem'>
    </div>
  </div>
  `],
    ['rightZee', `
  <div style='left: 160px; top: -40px; rotate: 0deg' class='currPiece allPieces threeByTwo'>
    <div
      class='block bgPink border-top border-right border-bottom border-dark'
      style='left: 2rem'>
    </div>
    <div
      class='block border bgPink  border-dark'
      style='left: 1rem; top:0rem'>
    </div>
    <div
      class='block bgPink border-left border-right border-bottom border-dark'
      style='left: 1rem; top: 1rem'>
    </div>
    <div
      class='block bgPink border-top border-left border-bottom border-dark'
      style='left: 0rem; top: 1rem'>
    </div>
  </div>
  `],
]



