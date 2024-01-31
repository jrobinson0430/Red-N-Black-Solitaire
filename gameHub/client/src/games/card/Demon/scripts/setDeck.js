import cardLogic from '../../sharedLogic/cardLogic';

const demonDeck = (() => {
  const initialTable = {
    stock: [],
    talon: [],
    heel: [],
    foundation0: [],
    foundation1: [],
    foundation2: [],
    foundation3: [],
    tableau0: [],
    tableau1: [],
    tableau2: [],
    tableau3: [],
  };

  const setCardProps = (table) => {
    console.log('table', table);

    const updatedTable = {};

    for (const pile in table) {
      const updatedPile = table[pile].map((genericCard, idx) => {
        let isDraggable = false;
        let isShowingFace = false;

        if (pile.includes('tableau') || pile === 'heel') {
          isDraggable = true;
          isShowingFace = true;
        }

        if (pile === 'foundation0') {
          isShowingFace = true;
        }

        return {
          ...genericCard,
          position: pile,
          isDraggable,
          isShowingFace,
          leftOffset: 0,
        };
      });

      updatedTable[pile] = updatedPile;
    }
    return updatedTable;
  };

  const setUpGame = () => {
    const startDeck = cardLogic.shuffle([...cardLogic.createFullDeck()]);

    let startTable = {
      stock: startDeck.slice(18),
      talon: [],
      heel: startDeck.slice(0, 13),
      foundation0: startDeck.slice(13, 14),
      foundation1: [],
      foundation2: [],
      foundation3: [],
      tableau0: startDeck.slice(14, 15),
      tableau1: startDeck.slice(15, 16),
      tableau2: startDeck.slice(16, 17),
      tableau3: startDeck.slice(17, 18),
    };

    return setCardProps(startTable);
  };

  return {
    initialTable,
    setUpGame,
  };
})();

export default demonDeck;
