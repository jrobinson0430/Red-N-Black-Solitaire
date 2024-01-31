import cardLogic from '../../sharedLogic/cardLogic';

const golfDeck = (() => {
  const initialTable = {
    stock: [],
    talon: [],
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
        const isShowingFace = !(pile === 'stock');
        let isDraggable = false;
        if (pile.includes('tableau') && pileLength === idx) {
          isDraggable = true;
        }

        return {
          ...genericCard,
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
    const startDeck = cardLogic.shuffle([...cardLogic.createFullDeck()]);

    let startTable = {
      stock: startDeck.slice(35),
      talon: [],
      tableau0: startDeck.slice(0, 5),
      tableau1: startDeck.slice(5, 10),
      tableau2: startDeck.slice(10, 15),
      tableau3: startDeck.slice(15, 20),
      tableau4: startDeck.slice(20, 25),
      tableau5: startDeck.slice(25, 30),
      tableau6: startDeck.slice(30, 35),
    };

    return setCardProps(startTable);
  };

  return {
    initialTable,
    setUpGame,
  };
})();

export default golfDeck;
