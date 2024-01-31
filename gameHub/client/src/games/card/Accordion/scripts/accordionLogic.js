const accordionLogic = (() => {
  function moveCards(dragCard, dropCard, table) {
    console.log('table', table);
    const newTable = table
      .map((card, idx) => {
        return idx === dropCard.position
          ? { ...dragCard, position: dropCard.position }
          : idx === dragCard.position
          ? []
          : card;
      })
      .flat()
      .map((card, idx) => ({ ...card, position: idx }));

    const resultObject = {
      isValidMove: true,
      oldTable: table,
      newTable,
    };
    return resultObject;
  }

  const checkValidMove = (card1, card2, table) => {
    const isSameSuit = card1.suit === card2.suit;
    const isSameRank = card1.rank === card2.rank;
    const validDropPositions = [+card1.position - 1, +card1.position - 3];
    const isValidPosition = validDropPositions.includes(+card2.position);

    return isValidPosition && (isSameRank || isSameSuit)
      ? moveCards(card1, card2, table)
      : { isValidMove: false };
  };

  const checkForWin = (table) => {
    return table.length === 1;
  };

  return {
    checkValidMove,
    checkForWin,
  };
})();

export default accordionLogic;
