const gameBoard = document.querySelector('#gameBoard');
const animationBoard = document.querySelector('#animationBoard')
let gameArr = createInitialBoard()
let isPaused = false

let testArr = gameArr.map(sq => {
  const [row, col] = sq.coords.split('-')
  if (row === '6' && !['10','11'].includes(col)) {
    return {...sq, color: 'bgYel' }
  } else if (row === '5' && !['10','11'].includes(col)) {
    return {...sq, color: 'bgRed' }
  } else if (row === '4' && (col === '2' || col === '19')) {
    return {...sq, color:'bgPurp' }
  }
  return sq
})

let testArr2 = gameArr.map(sq => {
  const [row, col] = sq.coords.split('-')
  if (['32','31','30','29'].includes(row) && !['1'].includes(col)) {
    return {...sq, color: 'bgYel' }
  }
  return sq
})

// gameArr = testArr
// gameArr = testArr2

console.log(gameArr)
displayBoard(gameArr)
let isVertical = false
let isStopped = false;

const pieceSpecs = {
  square: {
    rightEdge: 380,
  },
  straight: {
    rightEdge: 340,
    rotationShift: 30,
  },
  tee: {
    rightEdge: 360,
    rotationShift: 10,
  },
  leftElbow: {
    rightEdge: 360,
    rotationShift: 10,
  },
  rightElbow: {
    rightEdge: 360,
    rotationShift: 10,
  },
  leftZee: {
    rightEdge: 360,
    rotationShift: 10,
  },
  rightZee: {
    rightEdge: 360,
    rotationShift: 10,
  }
}


function processNewPiece() {
  const mapKey = {}
  isVertical = false
  let start = null;
  let lastStop = null;
  let isBlocked = false

  // const [pieceName, pieceHtml] = pcHTMLLookup[1]
  const [pieceName, pieceHtml] = pcHTMLLookup[randPiece()]
  
  // can determine the values of pieceSpecs here to cut out repetitive code
  const {
    rowOffset, // varies
    rightEdge, // varies
    rotationShift,
  } = pieceSpecs[pieceName]
  
  animationBoard.insertAdjacentHTML('beforeend', pieceHtml)
  animation = window.requestAnimationFrame(step);
  
  // must declare here or will cause an error
  const weakmap = new WeakMap([[mapKey, document.querySelector('.currPiece')]])
  const elemRef = weakmap.get(mapKey)


  let startPos = pieceName === 'straight' ? -20 : -40
  function step(timestamp) { // animation FN
    if (!start) start = timestamp;
    if (isPaused) { // allows game to be paused.
      start = timestamp
      startPos = getNums(elemRef.style.top)
      isPaused = false
    }
    let progress = (timestamp - start).toFixed();
    elemRef.style.top = startPos + (Math.floor(progress / 40)) + 'px';
    let stop = getNums(elemRef.style.top)
    stop = isVertical ? stop + 10 : stop
    
    const offset =
      (isVertical && pieceName === 'straight' ? -20 : 0)
      + (pieceName === 'straight' ? 20 : 0)

    // run checks every time piece enters a new row
    if (!(stop % 20) && stop !== lastStop) {
      lastStop = stop
      isStopped = checkBoard(pieceName, elemRef, 'bottom')
    }
    
    

    if (isStopped) {
      
      updateBoard(pieceName, elemRef)
      window.cancelAnimationFrame(animation)
      elemRef.classList.remove('currPiece')
      weakmap.delete(mapKey)
      isStopped = !isStopped
      processNewPiece()
      return
    }

    // means piece has hit the bottom of the board
    if (Number(stop) <= 619 + offset) { // 619
      animation = window.requestAnimationFrame(step);
    } else {
      window.cancelAnimationFrame(animation)
      elemRef.classList.remove('currPiece')
      weakmap.delete(mapKey)
      updateBoard(pieceName, elemRef)
      processNewPiece() // togglePieces
    }
  }



 window.addEventListener('keydown', (e) => {
    e.preventDefault();
    if (!weakmap.has(mapKey)) return;
    let rightEdgeStop = null;
    let currLeftLoc = getNums(elemRef.style.left);
    let newLoc = null;
    const rtVertOffset = 360
  // console.log(e.keyCode)
  switch (e.keyCode) {
    case 39: // right arrow
      isBlocked = checkBoard(pieceName, elemRef, 'right')
      if (isBlocked || isPaused) return

      rightEdgeStop = isVertical ? rtVertOffset : rightEdge
      newLoc = currLeftLoc + 20
      if (newLoc >= rightEdgeStop) return
      elemRef.style.left = newLoc + 'px'
      break;
      
    case 37: // left arrow
      isBlocked = checkBoard(pieceName, elemRef, 'left')
      if (isBlocked || isPaused) return;
      const straightOffset = pieceName === 'straight' ? -20 : 0
      const leftEdge = isVertical ? -20 + straightOffset : 0
      
      newLoc = currLeftLoc - 20
      if (newLoc < leftEdge) return
      elemRef.style.left = newLoc + 'px'
      break;
    
    case 38: // up arrow
    case 40: // down arrow

      if (isBlocked || isPaused || pieceName === 'square') return;
      let currLeft = getNums(elemRef.style.left);
      if (currLeft < 0) { currLeft = 10 }
      
      const rotateDegrees = e.keyCode === 40 ? 90 : -90

      elemRef.style.rotate = elemRef.style.rotate
        ? getNums(elemRef.style.rotate) + rotateDegrees + 'deg'
        : '90deg';
      
      const shift = isVertical && (rtVertOffset - currLeft === 10)
        ? rotationShift
        : 10;
        
      elemRef.style.left = isVertical
        ? currLeft - shift +'px'
        : currLeft + shift + 'px'

      isVertical = !isVertical
      break;
    case 32: // spacebar
      // run function that will drop piecce as far as it will go.
      const [canDrop, newStartBlk] =autoDrop(pieceName,elemRef, gameArr)
      if (canDrop) {
      // updateBoard(pieceName, elemRef, newStartBlk)
      elemRef.classList.remove('currPiece')
      weakmap.delete(mapKey)
      window.cancelAnimationFrame(animation)
      // updateBoard(pieceName, elemRef)
      processNewPiece() // togglePieces
        
      }

      break;
      
    case 80: // p pauses game
      isPaused = true
      window.cancelAnimationFrame(animation);
      break;
    case 83: // s starts game
      animation = requestAnimationFrame(step)
      break;
    } // end switch
  })

} // fn end

function autoDrop(pcName, element, arr) {
  const startBlock = getStartBlock(pcName, element)
  const currRow = Number(startBlock.split('-')[0])
  let newStartBlock = null
  const possibleSqs = arr.filter(sq =>
    !sq.color &&
    sq.coords.split('-')[0] > currRow).map(sq => sq.coords)
  console.log(possibleSqs)
  let allBlkCoords;
  let i = 32
  let isOpen = false;
  let moveLoc = []
  let moveLocTrue = []
  while(i > currRow) {
    const [row, col] = startBlock.split('-')
    // console.log(row, col)

    newStartBlock = `${i}-${col}`

  const allBlkCoords = getBlockLocs(pcName, element, newStartBlock).allBlkCoords
  isOpen = allBlkCoords.every(sq => possibleSqs.includes(sq))
      moveLoc.push(newStartBlock)
      moveLocTrue.push(isOpen)
    if (isOpen){
      updateBoard(pcName, element, newStartBlock)
      break;
    }
  i--
  
    
  }
  console.log(moveLoc)
  return [isOpen, newStartBlock]
}

function checkRows (arr) {
  let rowLookup = {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0,
    10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0,
    20: 0, 21: 0, 22: 0, 23: 0, 24: 0, 25: 0, 26: 0, 27: 0, 28: 0, 29: 0,
    30: 0, 31: 0, 32: 0
  };
  
  for (let i = 0; i < arr.length; i++) {
    const sq = arr[i]
    const [row] = sq.coords.split('-')

    if (!sq.color) {
      i = i - (i % 20) + 19 // jumps to begin of nxt row
      // i = i - (i % 10) + 9 // jumps to begin of nxt row
    } else {
      rowLookup = {...rowLookup, [row]: rowLookup[row] + 1 }
    }
  }

  const fullRows = Object.entries(rowLookup)
    .filter(entry => entry[1] === 20)
    .map(entry => entry[0])
    
  const lowestRow = fullRows.length ?  Math.max(...fullRows) : null
  if (!lowestRow) return gameArr
  
  const newGameArr = gameArr.map((sq, idx) => {
    const [row, col] = sq.coords.split('-')
    if (row - fullRows.length < 0) return {...sq, color: null }
    if (row > lowestRow) return sq
    const newCoord = `${row - fullRows.length}-${col}`
    const newColor = gameArr.filter(sq => sq.coords === newCoord)[0].color
    
    return {...sq, color: newColor }
  })
  return newGameArr
}


processNewPiece() // starts initial piece

function getStartBlock (pieceName ,elem) {

  const vertRowOffset = 10
  const vertColOffset = pieceName === 'straight' ? 30 : 10
  const rowOffset = (pieceName === 'straight') || (pieceName === 'square')
    ? 0 : 20
  const pieceOffset = isVertical ? vertRowOffset : rowOffset
  
  const currLeft = getNums(elem.style.left)
  const currTop = getNums(elem.style.top) + pieceOffset

  const col = (isVertical ? currLeft + vertColOffset : currLeft) / 20
  const row = Math.ceil((isVertical ? currTop + vertRowOffset : currTop) / 20)
  // console.log('row: ', row, 'col:', col)
  const startBlock = `${row}-${col}`
  return startBlock;
}



function getCheckBlocks (allbks, rowShift, colShift) {
  if (!allbks) return []
  return allbks.reduce((prev, curr) => {
    const [row, col] = curr.split('-')
    const newBlocks = `${Number(row) + rowShift}-${Number(col) + colShift}`
    return allbks.includes(newBlocks) ? prev : [...prev, newBlocks]
  },[])
}



function getBlockLocs(pcName, elem, startBlock) {

  let currRotation = getNums(elem.style.rotate) || 0
  if (currRotation.toString().startsWith('-')) {
    const remainder =  Number(currRotation.toString().slice(1)) % 360
    currRotation = 360 - remainder
  }
  
  const rotationIdx = (currRotation / 90) % 4
  const r = Number(startBlock.split('-')[0])
  const c = Number(startBlock.split('-')[1])
  
  const allblocksLookup = {
    square: {
      0: [startBlock, `${r+ 1}-${c}`, `${r}-${c+1}`, `${r+1}-${c+1}`]
    },
    tee: {
      0: [startBlock, `${r}-${c+1}`, `${r}-${c+2}`, `${r-1}-${c+1}`],
      1: [startBlock, `${r-1}-${c+1}`, `${r-1}-${c}`, `${r-2}-${c}`],
      2: [`${r}-${c+1}`, `${r-1}-${c}`, `${r-1}-${c+1}`, `${r-1}-${c+2}`],
      3: [`${r-1}-${c}`, `${r}-${c+1}`, `${r-1}-${c+1}`, `${r-2}-${c+1}`],
    },
    straight: {
      0: [startBlock, `${r}-${c+1}`, `${r}-${c+2}`, `${r}-${c+3}`],
      1: [startBlock, `${r-1}-${c}`, `${r-2}-${c}`, `${r-3}-${c}`],
      2: [startBlock, `${r}-${c+1}`, `${r}-${c+2}`, `${r}-${c+3}`],
      3: [startBlock, `${r-1}-${c}`, `${r-2}-${c}`, `${r-3}-${c}`],
    },
    leftElbow: {
      0: [startBlock, `${r-1}-${c}`, `${r}-${c+1}`, `${r}-${c+2}`],
      1: [startBlock, `${r-1}-${c}`, `${r-2}-${c}`, `${r-2}-${c+1}`],
      2: [`${r-1}-${c}`, `${r-1}-${c+1}`, `${r-1}-${c+2}`, `${r}-${c+2}`],
      3: [startBlock, `${r}-${c+1}`, `${r-1}-${c+1}`, `${r-2}-${c+1}`],
    },
    rightElbow: {
      0: [startBlock, `${r}-${c+1}`, `${r}-${c+2}`, `${r-1}-${c+2}`],
      1: [startBlock, `${r-1}-${c}`, `${r-2}-${c}`, `${r}-${c+1}`],
      2: [startBlock, `${r-1}-${c}`, `${r-1}-${c+1}`, `${r-1}-${c+2}`],
      3: [`${r-2}-${c}`, `${r-2}-${c+1}`, `${r-1}-${c+1}`, `${r}-${c+1}`],
    },
    leftZee: {
      0: [`${r-1}-${c}`, `${r-1}-${c+1}`, `${r}-${c+1}`, `${r}-${c+2}`],
      1: [startBlock, `${r-1}-${c}`, `${r-1}-${c+1}`, `${r-2}-${c+1}`],
      2: [`${r-1}-${c}`, `${r-1}-${c+1}`, `${r}-${c+1}`, `${r}-${c+2}`],
      3: [startBlock, `${r-1}-${c}`, `${r-1}-${c+1}`, `${r-2}-${c+1}`],

    },
    rightZee: {
      0: [startBlock, `${r}-${c+1}`, `${r-1}-${c+1}`, `${r-1}-${c+2}`],
      1: [`${r-1}-${c}`, `${r-2}-${c}`, `${r-1}-${c+1}`, `${r}-${c+1}`],
      2: [startBlock, `${r}-${c+1}`, `${r-1}-${c+1}`, `${r-1}-${c+2}`],
      3: [`${r-1}-${c}`, `${r-2}-${c}`, `${r-1}-${c+1}`, `${r}-${c+1}`],

    },
  }
  
  let allBlkCoords = allblocksLookup[pcName][rotationIdx]
  // console.log(allBlkCoords, rotationIdx)
  if (allBlkCoords) {
    allBlkCoords = allblocksLookup[pcName][rotationIdx]
    .filter(coord => !coord.startsWith('-'))
  }
  const btmCheckBlks = getCheckBlocks(allBlkCoords, 1, 0)
  const leftCheckBlks = getCheckBlocks(allBlkCoords, 0, -1)
  const rightCheckBlks = getCheckBlocks(allBlkCoords, 0, 1)

// ===========================Still working on=========================== //
  const nextRotationIdx = rotationIdx === 3 || pcName === 'square'
  ? 0
  : rotationIdx + 1
  
  const nxtRotationBlks = allblocksLookup[pcName][nextRotationIdx]
  const rotateCheckBlks = getCheckBlocks(nxtRotationBlks,1, 0);
// ===========================Still working on=========================== //

  return {
    allBlkCoords,
    btmCheckBlks,
    leftCheckBlks,
    rightCheckBlks,
    rotateCheckBlks, // still working on
  }
}

function updateBoard(name, element, autoDropLoc = null) {
  const colorLookup = {
    square: 'bgGrn',
    tee: 'bgRed',
    straight: 'bgYel',
    leftElbow: 'bgBlue',
    rightElbow: 'bgPurp',
    leftZee: 'bgOrange',
    rightZee: 'bgPink',
  }
  
  const startBlock = autoDropLoc || getStartBlock(name, element)
  const { allBlkCoords } = getBlockLocs(name, element, startBlock)

  // updates the boards color prop with the last piece to drop into place
  gameArr = gameArr.map(sq => allBlkCoords.includes(sq.coords)
    ? {...sq, color: colorLookup[name]}
    : sq)

  Array(...animationBoard.children).forEach(child => animationBoard.removeChild(child))
  
  // this checks if rows are full and need to be removed
  gameArr= [...checkRows(gameArr)]
  
  // displayes the updated board
  displayBoard(gameArr)
}

function checkBoard(piece, element, checkDirection) {
  const startBlock = getStartBlock(piece, element)

  const {
    btmCheckBlks,
    leftCheckBlks,
    rightCheckBlks,
    rotateCheckBlks // not being used..not working either
  } = getBlockLocs(piece, element, startBlock)
  let occupiedSqs = null
  
  switch(checkDirection) {
    case 'bottom':
      occupiedSqs = gameArr
      .filter(sq => btmCheckBlks.includes(sq.coords) && sq.color !== null);
      break;
    case 'right':
      occupiedSqs = gameArr
      .filter(sq => rightCheckBlks.includes(sq.coords) && sq.color !== null);
      break;
    case 'left':
      occupiedSqs = gameArr
      .filter(sq => leftCheckBlks.includes(sq.coords) && sq.color !== null);
      break;
    case 'rotate': // not working
      occupiedSqs = gameArr
      .filter(sq => rotateCheckBlks.includes(sq.coords) && sq.color !== null);
      
  }

  return occupiedSqs.length > 0

}


displayBoard(gameArr)

