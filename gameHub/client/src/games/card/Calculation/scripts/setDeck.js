import cardLogic from '../../sharedLogic/cardLogic';

const calculationDeck = (() => {
  const initialTable = {
    stock: [],
    talon: [],
    foundation0: [],
    foundation1: [],
    foundation2: [],
    foundation3: [],
    waste0: [],
    waste1: [],
    waste2: [],
    waste3: [],
  };

  const setCardProps = (table) => {
    const updatedTable = {};

    for (const pile in table) {
      const updatedPile = table[pile].map((genericCard, idx) => {
        const pileLength = table[pile].length - 1;

        return {
          ...genericCard,
          position: pile,
          isDraggable: pile.includes('talon'),
          isShowingFace: !pile.includes('stock'),
        };
      });
      updatedTable[pile] = updatedPile;
    }

    return updatedTable;
  };

  const setUpGame = () => {
    const startDeck = cardLogic.shuffle([...cardLogic.createFullDeck()]);

    const foundationCards = [
      startDeck.filter((card) => card.rank === 'ace')[0],
      startDeck.filter((card) => card.rank === 'two')[0],
      startDeck.filter((card) => card.rank === 'three')[0],
      startDeck.filter((card) => card.rank === 'four')[0],
    ];

    const restCards = startDeck.filter(
      (card) => !foundationCards.includes(card)
    );

    let startTable = {
      stock: restCards.slice(1),
      talon: restCards.slice(0, 1),
      foundation0: foundationCards.slice(0, 1),
      foundation1: foundationCards.slice(1, 2),
      foundation2: foundationCards.slice(2, 3),
      foundation3: foundationCards.slice(3, 4),
      waste0: [],
      waste1: [],
      waste2: [],
      waste3: [],
    };

    return setCardProps(startTable);
  };

  return {
    initialTable,
    setUpGame,
  };
})();

export default calculationDeck;
