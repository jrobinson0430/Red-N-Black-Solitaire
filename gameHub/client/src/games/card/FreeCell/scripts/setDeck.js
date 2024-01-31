import cardLogic from '../../sharedLogic/cardLogic';
const freeCellDeck = (() => {
  const initialTable = {
    freecell0: [],
    freecell1: [],
    freecell2: [],
    freecell3: [],
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
    tableau7: [],
  };
  const setCardProps = (table) => {
    const updatedTable = {};

    for (const pile in table) {
      const updatedPile = table[pile].map((genericCard, idx) => {
        const pileLength = table[pile].length - 1;
        let isDraggable = false;
        let isShowingFace = true;

        if (pile.includes('tableau') && pileLength === idx) {
          isDraggable = true;
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
    // console.log('updatedTable', updatedTable)
    return updatedTable;
  };

  const setUpGame = () => {
    const startDeck = cardLogic.shuffle([...cardLogic.createFullDeck()]);

    const startTable = {
      freecell0: [],
      freecell1: [],
      freecell2: [],
      freecell3: [],
      foundation0: [],
      foundation1: [],
      foundation2: [],
      foundation3: [],
      tableau0: startDeck.slice(0, 7),
      tableau1: startDeck.slice(7, 14),
      tableau2: startDeck.slice(14, 21),
      tableau3: startDeck.slice(21, 28),
      tableau4: startDeck.slice(28, 34),
      tableau5: startDeck.slice(34, 40),
      tableau6: startDeck.slice(40, 46),
      tableau7: startDeck.slice(46),
    };
    console.log(startTable);
    return setCardProps(startTable);
  };

  // setUpGame()
  return {
    initialTable,
    setUpGame,
  };
})();

export default freeCellDeck;
