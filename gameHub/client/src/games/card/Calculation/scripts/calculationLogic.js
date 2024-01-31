const calculationLogic = (() => {
  function checkTalonPile(currTable) {
    for (let prop in currTable) {
      const pileArr = currTable[prop];
      if (prop.includes('talon') && !pileArr.length) return true;
    }
    return false;
  }

  function autoMoveToTalon(currTable) {
    const { stock } = currTable;
    if (!stock.length) return currTable;

    const newTalon = stock.slice(stock.length - 1).map((card) => ({
      ...card,
      isDraggable: true,
      isShowingFace: true,
      position: 'talon',
    }));

    const newStock = stock.slice(0, stock.length - 1);

    const newTable = {
      ...currTable,
      stock: newStock,
      talon: newTalon,
    };

    return newTable;
  }

  const checkFoundationMove = (dragCard, dropCard) => {
    const toPile = dropCard.position;
    const increment = +toPile.slice(toPile.length - 1) + 1;
    let targetValue = +dropCard.value + increment;

    targetValue = targetValue > 13 ? targetValue - 13 : targetValue;

    return +dragCard.value === targetValue;
  };

  const moveCards = (dragCard, dropCard, table) => {
    const dropPile = dropCard.position;
    const dragPile = dragCard.position;
    const dropArr = table[dropPile];
    const dragArr = table[dragPile];
    const cardToFoundation = dropPile.includes('foundation');

    const cardToWaste = dropPile.includes('waste');

    const sliceIndex = table[dragPile].reduce((prev, curr, idx) => {
      return curr.rank === dragCard.rank && curr.suit === dragCard.suit
        ? idx
        : prev;
    }, null);

    const cardsToMove = dragArr.slice(sliceIndex);
    const newDragArr = dragArr.slice(0, sliceIndex);
    const lastCard = newDragArr.at(-1);
    const rest = newDragArr.slice(0, newDragArr.length - 1);

    const updatedDragArr = newDragArr.length
      ? [...rest, { ...lastCard, isShowingFace: true, isDraggable: true }]
      : [];
    // updates the cards object properties based on the drop location

    const updatedCardsToMove = cardToFoundation
      ? cardsToMove.map((card) => ({
          ...card,
          position: dropPile,
          isDraggable: false,
        }))
      : cardsToMove.map((card) => ({ ...card, position: dropPile }));

    const newDropArr = [...dropArr, ...updatedCardsToMove];

    let updatedTable = {
      ...table,
      [dragPile]: updatedDragArr,
      [dropPile]: newDropArr,
    };

    updatedTable = checkTalonPile(updatedTable)
      ? autoMoveToTalon(updatedTable)
      : updatedTable;

    const resultObject = {
      isValidMove: true,
      oldTable: table,
      newTable: updatedTable,
      cardToWaste,
      cardToFoundation,
    };
    return resultObject;
  };

  const checkValidMove = (card1, card2, table) => {
    const toFoundation = card2.position.includes('foundation');

    if (
      (card1.position.includes('waste') && card2.position.includes('waste')) ||
      card1.position === card2.position ||
      card2.position === 'talon'
    ) {
      return { isValidMove: false };
    }
    const isValidMove = toFoundation ? checkFoundationMove(card1, card2) : true;

    return isValidMove ? moveCards(card1, card2, table) : { isValidMove };
  };

  const checkForWin = (table) =>
    Object.values(table)
      .flat()
      .filter((obj) => obj.position.includes('foundation')).length === 52;

  return {
    checkValidMove,
    checkForWin,
  };
})();

export default calculationLogic;
