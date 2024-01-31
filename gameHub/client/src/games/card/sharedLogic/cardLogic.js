const cardLogic = (() => {
  const createFullDeck = () => {
    let deckArr = [];
    const suitLookup = ['heart', 'club', 'spade', 'diamond'];
    const rankLookup = [
      'ace',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
      'ten',
      'jack',
      'queen',
      'king',
    ];

    for (let i = 0; i < suitLookup.length; i += 1) {
      for (let j = 0; j < rankLookup.length; j += 1) {
        const card = {
          suit: suitLookup[i],
          rank: rankLookup[j],
          value: j + 1,
        };
        deckArr = [...deckArr, card];
      }
    }
    return deckArr;
  };

  const calculatePoints = (foundationPoints, tableauPoints) =>
    (foundationPoints ? 10 : 0) + (tableauPoints ? 5 : 0);

  const shuffle = (deck) => deck.sort(() => Math.random() - 0.5);

  const hasSameSuit = (card1, card2) => card1.suit === card2.suit;

  const isAscendingOrder = (card1, card2) => card1.value === card2.value + 1;

  const isDescendingOrder = (card1, card2) => card1.value === card2.value - 1;

  const hasAlternateColor = (card1, card2) => {
    const colorLookUp = {
      spade: 'black',
      club: 'black',
      heart: 'red',
      diamond: 'red',
    };
    return colorLookUp[card1.suit] !== colorLookUp[card2.suit];
  };
  return {
    calculatePoints,
    hasSameSuit,
    hasAlternateColor,
    isAscendingOrder,
    isDescendingOrder,
    createFullDeck,
    shuffle,
  };
})();

export default cardLogic;
