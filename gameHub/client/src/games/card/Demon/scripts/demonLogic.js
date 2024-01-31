import cardLogic from '../../sharedLogic/cardLogic';

const demonLogic = (() => {
  function checkTableauPiles(currTable) {
    for (let prop in currTable) {
      const pileArr = currTable[prop];
      if (prop.includes('tableau') && !pileArr.length) return true;
    }
    return false;
  }

  function autoMoveFromHeel(currTable) {
    let newTable = {};

    for (let loc in currTable) {
      const currPile = currTable[loc];
      const pileLen = currPile.length;

      if (loc === 'heel' && !pileLen) return currTable;

      if (loc.includes('tableau') && !pileLen) {
        const { heel } = currTable;

        const newHeel = heel.slice(0, heel.length - 1).map((card, idx, arr) => {
          return idx === arr.length - 1
            ? { ...card, isShowingFace: true }
            : card;
        });

        let [moveCard] = heel.slice(heel.length - 1);
        moveCard.position = loc;

        newTable = { ...currTable, heel: newHeel, [loc]: [moveCard] };

        return newTable;
      }
    }
    return currTable;
  }

  function isPileEmpty(dropLoc, position) {
    return dropLoc.position.includes(position) && dropLoc.rank === 'empty';
  }

  function isFoundationMove(dragCard, dropCard, currTable) {
    const startRank = currTable.foundation0[0].rank;
    const isRankMatch = dragCard.rank === startRank;
    return isRankMatch && isPileEmpty(dropCard, 'foundation');
  }

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

    const cardsToMove =
      dragPile === 'talon'
        ? dragArr.slice(sliceIndex).map((card) => ({ ...card, leftOffset: 0 }))
        : dragArr.slice(sliceIndex);

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

    const isTableuEmpty = checkTableauPiles(updatedTable);

    const cardToTableau =
      (dropPile.includes('tableau') && !dragPile.includes('tableau')) ||
      isTableuEmpty;

    updatedTable = isTableuEmpty
      ? autoMoveFromHeel(updatedTable)
      : updatedTable;

    console.log('updatedTable', updatedTable);

    const resultObject = {
      isValidMove: true,
      oldTable: table,
      newTable: updatedTable,
      cardToTableau,
      cardToFoundation,
    };
    return resultObject;
  }

  const checkValidMove = (card1, card2, table) => {
    if (card1.rank === card2.rank && card1.suit === card2.suit) {
      return { isValidMove: false };
    }

    const inTableau = card2.position.includes('tableau');

    // check for starting a foundation pile
    if (
      isFoundationMove(card1, card2, table) ||
      isPileEmpty(card2, 'tableau')
    ) {
      return moveCards(card1, card2, table);
    }

    // to allow ace to stack on king in foundation pile
    card2.value = !inTableau && card2.rank === 'king' ? 0 : card2.value;

    // check to make sure dropcard is the bottom-most card
    const card2Arr = table[card2.position];
    const card2Idx = card2Arr.findIndex((obj) => {
      return obj.rank === card2.rank && obj.suit === card2.suit;
    });

    const isLastCard = card2Idx === card2Arr.length - 1;

    if (!isLastCard) return { isValidMove: false, table };

    const isValidMove = inTableau
      ? cardLogic.hasAlternateColor(card1, card2) &&
        cardLogic.isDescendingOrder(card1, card2)
      : card1.suit === card2.suit && cardLogic.isAscendingOrder(card1, card2);

    return isValidMove ? moveCards(card1, card2, table) : { isValidMove };
  };

  const showNextCard = (table) => {
    const stockLength = table.stock.length;
    let { stock, talon } = table;

    if (!stockLength) {
      // when stock is empty
      const newStock = talon.map((card) => {
        return {
          ...card,
          isDraggable: false,
          isShowingFace: false,
          position: 'stock',
          leftOffset: 0,
        };
      });

      return {
        oldTable: table,
        newTable: { ...table, stock: newStock, talon: [] },
      };
    }

    const toTalon = stock.slice(0, 3);
    const newStock = stock.slice(3);

    const updatedToTalon = toTalon.map((card, idx) => {
      return idx === toTalon.length - 1
        ? {
            ...card,
            position: 'talon',
            isShowingFace: true,
            isDraggable: true,
            leftOffset: `${idx * 1.8}`,
          }
        : {
            ...card,
            position: 'talon',
            isShowingFace: true,
            leftOffset: `${idx * 1.8}`,
          };
    });

    const newTalon = [
      // reset offset for cards previously in talon
      ...talon.map((card) => ({ ...card, leftOffset: 0 })),
      ...updatedToTalon,
    ];

    return {
      oldTable: table,
      newTable: { ...table, stock: newStock, talon: newTalon },
    };
  };
  const checkForWin = (table) =>
    Object.values(table)
      .flat()
      .filter((obj) => obj.position.includes('foundation')).length === 52;

  return {
    checkValidMove,
    showNextCard,
    checkForWin,
  };
})();

export default demonLogic;
