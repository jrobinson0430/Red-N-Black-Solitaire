import cardLogic from '../../sharedLogic/cardLogic';

const redNBlackDeck = (() => {
  const initialTable = {
    stock: [],
    waste: [],
    foundation0: [],
    foundation1: [],
    foundation2: [],
    foundation3: [],
    foundation4: [],
    foundation5: [],
    foundation6: [],
    foundation7: [],
    tableau0: [],
    tableau1: [],
    tableau2: [],
    tableau3: [],
    tableau4: [],
    tableau5: [],
    tableau6: [],
    tableau7: [],
  };

  const setCardProps = (table) => {
    const updatedTable = {};

    for (const pile in table) {
      const updatedPile = table[pile].map((genericCard) => {
        const isDraggable = pile.includes('tableau');
        const isShowingFace = pile.includes('foundation') || isDraggable;
        return {
          ...genericCard,
          cardOffset: 0,
          position: pile,
          isDraggable,
          isShowingFace,
        };
      });

      updatedTable[pile] = updatedPile;
    }
    return updatedTable;
  };

  const setUpGame = () => {
    const { shuffle, createFullDeck } = cardLogic;
    const startDecks = shuffle(createFullDeck().concat(createFullDeck()));
    const allAces = startDecks
      .filter((card) => card.rank === 'ace')
      .sort((a, b) => (b.suit > a.suit ? -1 : 0));
    const gameDeck = startDecks.filter((card) => card.rank !== 'ace');

    const gameTable = {
      stock: gameDeck.slice(8),
      waste: [],
      foundation0: allAces.slice(0, 1),
      foundation1: allAces.slice(1, 2),
      foundation2: allAces.slice(2, 3),
      foundation3: allAces.slice(3, 4),
      foundation4: allAces.slice(4, 5),
      foundation5: allAces.slice(5, 6),
      foundation6: allAces.slice(6, 7),
      foundation7: allAces.slice(7, 8),
      tableau0: gameDeck.slice(0, 1),
      tableau1: gameDeck.slice(1, 2),
      tableau2: gameDeck.slice(2, 3),
      tableau3: gameDeck.slice(3, 4),
      tableau4: gameDeck.slice(4, 5),
      tableau5: gameDeck.slice(5, 6),
      tableau6: gameDeck.slice(6, 7),
      tableau7: gameDeck.slice(7, 8),
    };

    return setCardProps(gameTable);
  };

  return {
    initialTable,
    setUpGame,
  };
})();

export default redNBlackDeck;
