import cardLogic from '../../sharedLogic/cardLogic';
const golfLogic = (() => {
  function moveCards(dragCard, dropCard, table) {
    const dropPile = dropCard.position;
    const dragPile = dragCard.position;
    const dropArr = table[dropPile];
    const dragArr = table[dragPile];

    const cardToFoundation = dropPile.includes('foundation');

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

    const resultObject = {
      isValidMove: true,
      oldTable: table,
      newTable: updatedTable,
      cardToFoundation,
    };
    return resultObject;
  }

  const showNextCard = (table) => {
    const stockLength = table.stock.length;
    const { stock, talon } = table;

    const newStock = stock.slice(1);
    const toTalon = stock
      .slice(0, 1)
      .map((card) => ({ ...card, position: 'talon', isShowingFace: true }));

    const newTalon = [...talon, ...toTalon];

    return {
      oldTable: table,
      newTable: { ...table, stock: newStock, talon: newTalon },
    };
  };

  const checkValidMove = (card1, card2, table) => {
    const isSameRank = card1.rank === card2.rank;
    const isSameSuit = card1.suit === card2.suit;
    if ((isSameRank && isSameSuit) || card2.position !== 'talon') {
      return { validMove: false };
    }

    const isValidMove =
      cardLogic.isDescendingOrder(card1, card2) ||
      cardLogic.isAscendingOrder(card1, card2);

    return isValidMove ? moveCards(card1, card2, table) : { isValidMove };
  };

  const checkForWin = (table) => table.talon.length === 52;

  return {
    showNextCard,
    checkValidMove,
    checkForWin,
  };
})();

export default golfLogic;
