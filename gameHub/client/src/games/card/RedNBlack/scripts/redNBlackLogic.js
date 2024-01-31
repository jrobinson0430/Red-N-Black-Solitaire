import cardLogic from '../../sharedLogic/cardLogic';

const {
  shuffle,
  hasSameSuit,
  hasAlternateColor,
  isAscendingOrder,
  isDescendingOrder,
} = cardLogic;

const redNBlackLogic = (() => {
  const autoMoveCard = (fillLocation, dropLocation, table, oldTable) => {
    const isWasteEmpty = table.waste.length === 0;
    const removeLocation = isWasteEmpty ? 'stock' : 'waste';
    const removePileArr = table[removeLocation];
    const length = removePileArr.length - 1;
    const newRemovePileArr = removePileArr.slice(0, length);
    const [cardToMove] = removePileArr.slice(length);

    const newFillPile =
      removeLocation === 'waste'
        ? [{ ...cardToMove, position: fillLocation }]
        : [
            {
              ...cardToMove,
              isShowingFace: true,
              isDraggable: true,
              position: fillLocation,
            },
          ];

    const newTable = {
      ...table,
      [removeLocation]: newRemovePileArr,
      [fillLocation]: newFillPile,
    };
    return {
      isValidMove: true,
      oldTable,
      newTable,
      cardToFoundation: dropLocation.includes('foundation'),
      cardToTableau: true,
    };
  };

  const moveCards = (dragCard, dropCard, table) => {
    const dropLocation = dropCard.position;
    const dragLocation = dragCard.position;
    const dropArr = table[dropLocation];
    const dragArr = table[dragLocation];
    const cardToFoundation = dropLocation.includes('foundation');
    const cardToTableau =
      dropLocation.includes('tableau') && !dragLocation.includes('tableau');
    const sliceIndex = table[dragLocation].reduce((prev, curr, idx) => {
      const newPrev =
        curr.rank === dragCard.rank && curr.suit === dragCard.suit ? idx : prev;
      return newPrev;
    }, null);

    const cardsToMove = dragArr.slice(sliceIndex);
    const newDragArr = dragArr.slice(0, sliceIndex);
    // updates the cards object properties based on the drop location
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
      [dragLocation]: newDragArr,
      [dropLocation]: newDropArr,
    };

    return newDragArr.length
      ? {
          isValidMove: true,
          oldTable: table,
          newTable: updatedTable,
          cardToTableau,
          cardToFoundation,
        }
      : autoMoveCard(dragLocation, dropLocation, updatedTable, table);
  };

  const showNextCard = (table, redeal) => {
    const stockSize = table.stock.length;
    // indicates stock is depleted and there are no more redeals
    if (stockSize === 0 && !redeal) {
      return {
        oldTable: table,
        newTable: table,
        stock: stockSize,
        redeal,
      };
    }

    // indicates the stock is depleted and the
    // waste pile needs shuffled and moved to stock pile
    if (stockSize === 0) {
      const resetStockPile = shuffle(table.waste).map((card) => ({
        ...card,
        isShowingFace: false,
        isDraggable: false,
      }));

      return {
        redeal: redeal - 1,
        stock: resetStockPile.length,
        oldTable: table,
        newTable: { ...table, stock: resetStockPile, waste: [] },
      };
    }

    // moves a single card from the stock to the waste
    // when the stock size is greater than 0
    const newStockPile = table.stock.slice(0, stockSize - 1);
    const [moveCard] = table.stock.slice(stockSize - 1);
    // updates the moveCard obj property's and adds it to the waste
    const newWastePile = [
      ...table.waste,
      {
        ...moveCard,
        position: 'waste',
        isDraggable: true,
        isShowingFace: true,
      },
    ];

    // reconstructs the table with the newly updated piles
    const newTable = {
      ...table,
      stock: newStockPile,
      waste: newWastePile,
    };

    return {
      redeal,
      stock: stockSize,
      oldTable: table,
      newTable,
    };
  };

  const checkValidMove = (card1, card2, table) => {
    if (
      card2.suit === 'empty' ||
      (card1.suit === card2.suit && card1.rank === card2.rank)
    ) {
      return { isValidMove: false };
    }
    // to determine whether cards should be ascending or descending order
    const inTableau = card2.position.includes('tableau');

    // check to make sure dropcard is the bottom-most card
    const card2Arr = table[card2.position];
    const card2Idx = card2Arr.findIndex((obj) => {
      return obj.rank === card2.rank && obj.suit === card2.suit;
    });

    const isLastCard = card2Idx === card2Arr.length - 1;

    if (!isLastCard) return { isValidMove: false, table };

    const isValidMove = inTableau
      ? hasAlternateColor(card1, card2) && isDescendingOrder(card1, card2)
      : hasSameSuit(card1, card2) && isAscendingOrder(card1, card2);

    return isValidMove ? moveCards(card1, card2, table) : { isValidMove };
  };

  const checkForWin = (table) =>
    Object.values(table)
      .flat()
      .filter((obj) => obj.position.includes('foundation')).length === 104;

  return {
    showNextCard,
    checkValidMove,
    checkForWin,
  };
})();

export default redNBlackLogic;
