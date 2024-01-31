import cardLogic from '../../sharedLogic/cardLogic';

const klondikeLogic = (() => {
  const { hasAlternateColor, isDescendingOrder, isAscendingOrder } = cardLogic;
  function isFoundationStart(dragCard, dropCard) {
    const dragCardIsAce = dragCard.rank === 'ace';
    const isToFoundation = dropCard.position.includes('foundation');
    const isEmpty = dropCard.rank === 'empty';

    return dragCardIsAce && isToFoundation && isEmpty;
  }

  function isTableauStart(dragCard, dropCard) {
    const dragCardIsKing = dragCard.rank === 'king';
    const isToTableau = dropCard.position.includes('tableau');
    const isEmpty = dropCard.rank === 'empty';

    return dragCardIsKing && isToTableau && isEmpty;
  }

  const moveCards = (dragCard, dropCard, table) => {
    const dropLocation = dropCard.position;
    const dragLocation = dragCard.position;
    const dropArr = table[dropLocation];
    const dragArr = table[dragLocation];
    const cardToFoundation = dropLocation.includes('foundation');
    const cardToTableau =
      dropLocation.includes('tableau') && !dragLocation.includes('tableau');

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

    const updatedCardsToMove = cardToFoundation
      ? cardsToMove.map((card) => ({
          ...card,
          position: dropLocation,
          isDraggable: false,
        }))
      : cardsToMove.map((card) => ({ ...card, position: dropLocation }));

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
      cardToTableau,
      cardToFoundation,
      canAutoComplete: checkForAutoFinish(updatedTable),
    };

    return resultObject;
  };

  function checkForAutoFinish(table) {
    return Object.values(table)
      .flat()
      .every((obj) => obj.isShowingFace);
  }

  const showNextCard = (table) => {
    const stockLength = table.stock.length;

    if (!stockLength) {
      const newStock = [...table.waste]
        .map((card) => ({
          ...card,
          isDraggable: false,
          isShowingFace: false,
          position: 'stock',
        }))
        .reverse();

      return {
        oldTable: table,
        newTable: { ...table, stock: newStock, waste: [] },
        resetDeck: true,
      };
    }

    const [moveToWaste, ...newStock] = [...table.stock].reverse();
    const newWaste = [
      ...table.waste,
      {
        ...moveToWaste,
        isShowingFace: true,
        isDraggable: true,
        position: 'waste',
      },
    ];

    return {
      oldTable: table,
      newTable: { ...table, stock: newStock.reverse(), waste: newWaste },
      resetDeck: false,
    };
  };

  const checkValidMove = (card1, card2, table) => {
    console.log('card1', card1);
    console.log('card2', card2);
    console.log(table);

    const isSameRank = card1.rank === card2.rank;
    const isSameSuit = card1.suit === card2.suit;
    const isInvalidPile = ['waste', 'stock'].includes(card2.position);
    const inTableau = card2.position.includes('tableau');

    // prevents duplicate cards & invalid placements
    if ((isSameRank && isSameSuit) || isInvalidPile) {
      return { isValidMove: false, table };
    }
    // for pile starts
    if (isFoundationStart(card1, card2) || isTableauStart(card1, card2)) {
      return moveCards(card1, card2, table);
    }

    // check to make sure dropcard is the bottom-most card
    const card2Arr = table[card2.position];
    const card2Idx = card2Arr.findIndex((obj) => {
      return obj.rank === card2.rank && obj.suit === card2.suit;
    });

    const isLastCard = card2Idx === card2Arr.length - 1;

    if (!isLastCard) return { isValidMove: false, table };

    const isValidMove = inTableau
      ? hasAlternateColor(card1, card2) && isDescendingOrder(card1, card2)
      : card1.suit === card2.suit && isAscendingOrder(card1, card2);

    return isValidMove ? moveCards(card1, card2, table) : { isValidMove };
  };

  const checkForWin = (table) =>
    Object.values(table)
      .flat()
      .filter((obj) => obj.position.includes('foundation')).length === 52;

  const autoComplete = (checkTable) => {
    const { moveCards, checkValidMove } = klondikeLogic;
    let madeMove = false;
    let checkCards = [];
    let foundationCards = [];

    for (let prop in checkTable) {
      if (prop.includes('foundation')) {
        const foundationCard = checkTable[prop].at(-1);
        if (foundationCard) foundationCards.push(foundationCard);
      } else if (!prop.includes('stock')) {
        const checkCard = checkTable[prop].at(-1);
        if (checkCard) checkCards.push(checkCard);
      }
    }

    foundationCards.forEach((dropCard) => {
      checkCards.forEach((dragCard) => {
        const result = checkValidMove(dragCard, dropCard, checkTable);
        console.log(result);
        const { isValidMove, newTable } = result;

        if (isValidMove) {
          autoComplete(newTable);
          setKlondikeTable(newTable);
        }
      });
    });

    setKlondikeTable(checkTable);
  };

  return {
    showNextCard,
    checkValidMove,
    checkForWin,
  };
})();

export default klondikeLogic;
