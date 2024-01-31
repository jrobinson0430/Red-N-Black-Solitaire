import cardLogic from '../../sharedLogic/cardLogic';
const freeCellLogic = (() => {
  const { hasAlternateColor, isDescendingOrder, isAscendingOrder } = cardLogic;

  function isBottomCard(dropCard, checkTable) {
    const dropPileArr = checkTable[dropCard.position];
    const dropCardIdx = dropPileArr.findIndex((obj) => {
      return obj.rank === dropCard.rank && obj.suit === dropCard.suit;
    });
    return dropCardIdx === dropPileArr.length - 1;
  }

  function calcEmptyLocations(checkTable) {
    let count = 0;

    for (let key in checkTable) {
      if (!key.includes('foundation')) {
        const pile = checkTable[key];
        if (!pile.length) count += 1;
      }
    }
    return count;
  }

  // this still isn't accurate. need to account for being able to store a set of cards on an empty tableau before moving other cards. it currently works technically, but you have to physically move the stacks to the empty tableau. it would be nice to have a working algorithm that automates this
  function calDragPileSize(dragCard, checkTable) {
    console.log('dragCard', dragCard);
    const checkPile = checkTable[dragCard.position];
    console.log('checkPile', checkPile);
    const startIdx = checkPile.findIndex((obj) => {
      return obj.rank === dragCard.rank && obj.suit === dragCard.suit;
    });

    return checkPile.length - startIdx - 1;
  }

  function isTableauStart(dropCard) {
    const isToTableau = dropCard.position.includes('tableau');
    const isEmpty = dropCard.rank === 'empty';

    return isToTableau && isEmpty;
  }

  function isFoundationStrt(dragCard, dropCard) {
    const dragCardIsAce = dragCard.rank === 'ace';
    const isToFoundation = dropCard.position.includes('foundation');
    const isEmpty = dropCard.rank === 'empty';

    return dragCardIsAce && isToFoundation && isEmpty;
  }
  function isCellEmpty(dropLoc) {
    const isToFreeCell = dropLoc.position.includes('freecell');
    const isDropEmpty = dropLoc.rank === 'empty';
    return isToFreeCell && isDropEmpty;
  }

  function moveCards(dragCard, dropCard, table) {
    const dropLocation = dropCard.position;
    const dragLocation = dragCard.position;
    const dropArr = table[dropLocation];
    const dragArr = table[dragLocation];
    const cardToFoundation = dropLocation.includes('foundation');

    const sliceIndex = table[dragLocation].reduce(
      (prev, curr, idx) =>
        curr.rank === dragCard.rank && curr.suit === dragCard.suit ? idx : prev,
      null
    );

    const cardsToMove = dragArr.slice(sliceIndex);
    const newDragArr = dragArr.slice(0, sliceIndex);

    const lastCard = newDragArr.at(-1);
    const rest = newDragArr.slice(0, newDragArr.length - 1);

    const updatedDragArr = newDragArr.length
      ? [...rest, { ...lastCard, isShowingFace: true, isDraggable: true }]
      : [];

    const updatedCardsToMove = cardsToMove.map((card) => ({
      ...card,
      position: dropLocation,
    }));

    const newDropArr = [...dropArr, ...updatedCardsToMove];

    const updatedTable = {
      ...table,
      [dragLocation]: updatedDragArr,
      [dropLocation]: newDropArr,
    };

    const resultObject = {
      isValidMove: true,
      oldTable: table,
      newTable: updatedTable,
      cardToFoundation,
    };

    return resultObject;
  }

  const checkValidMove = (dragCard, dropCard, table) => {
    // console.log('dragCard', dragCard);
    // console.log('dropCard', dropCard);
    // console.log('table', table);

    const isSameRank = dragCard.rank === dropCard.rank;
    const isSameSuit = dragCard.suit === dropCard.suit;
    const isToFreeCell = dropCard.position.includes('freecell');
    const isDropEmpty = dropCard.rank === 'empty';
    const inTableau = dropCard.position.includes('tableau');

    const maxCardPileSize = calcEmptyLocations(table);

    const dragPileSize = calDragPileSize(dragCard, table);
    console.log('dragPileSize', dragPileSize);

    // prevents duplicate card creation
    if ((isSameSuit && isSameRank) || dragPileSize > maxCardPileSize) {
      return { isValidMove: false, table };
    }

    // foundations must start with aces
    if (isFoundationStrt(dragCard, dropCard, table)) {
      return moveCards(dragCard, dropCard, table);
    }

    // for any pile/cell that is empty
    if (isCellEmpty(dropCard) || isTableauStart(dropCard)) {
      return moveCards(dragCard, dropCard, table);
    }

    // check to make sure dropcard is the bottom-most card
    if (!isBottomCard(dropCard, table)) return { isValidMove: false, table };

    const isValidMove = inTableau
      ? hasAlternateColor(dragCard, dropCard) &&
        isDescendingOrder(dragCard, dropCard)
      : isSameSuit && isAscendingOrder(dragCard, dropCard);

    return isValidMove ? moveCards(dragCard, dropCard, table) : { isValidMove };
  };

  const checkForWin = () => {
    console.log('need to write');
  };
  return {
    checkValidMove,
    checkForWin,
  };
})();

export default freeCellLogic;

// remember per rules of the game:

/*
Complete or partial tableaus may be moved to build on existing tableaus, or moved to empty cascades, by recursively placing and removing cards through intermediate locations. Computer implementations often show this motion, but players using physical decks typically move the tableau at once.

idea:
do this by determining the number of empty freecells and tableau piles and compare it to the length of the pile you want to move.
*/
