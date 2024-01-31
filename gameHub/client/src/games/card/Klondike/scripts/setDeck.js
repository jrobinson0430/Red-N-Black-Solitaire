import cardLogic from '../../sharedLogic/cardLogic';

const { shuffle, createFullDeck } = cardLogic;

const klondikeDeck = (() => {
  const initialTable = {
    stock: [],
    waste: [],
    foundation0: [],
    foundation1: [],
    foundation2: [],
    foundation3: [],
    tableau0: [],
    tableau1: [],
    tableau2: [],
    tableau3: [],
    tableau4: [],
    tableau5: [],
    tableau6: [],
  };

  const setCardProps = (table) => {
    const updatedTable = {};

    for (const pile in table) {
      const updatedPile = table[pile].map((genericCard, idx) => {
        const pileLength = table[pile].length - 1;
        let isDraggable = false;
        let isShowingFace = false;

        if (pile.includes('tableau') && pileLength === idx) {
          isDraggable = true;
          isShowingFace = true;
        }

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
    const startDeck = shuffle(createFullDeck());
    const startTable = {
      stock: startDeck.slice(28),
      waste: [],
      foundation0: [],
      foundation1: [],
      foundation2: [],
      foundation3: [],
      tableau0: startDeck.slice(0, 1),
      tableau1: startDeck.slice(1, 3),
      tableau2: startDeck.slice(3, 6),
      tableau3: startDeck.slice(6, 10),
      tableau4: startDeck.slice(10, 15),
      tableau5: startDeck.slice(15, 21),
      tableau6: startDeck.slice(21, 28),
    };

    return setCardProps(startTable);
  };

  return {
    initialTable,
    setUpGame,
  };
})();

export default klondikeDeck;
