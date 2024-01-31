import cardlogic from '../../sharedLogic/cardLogic';

const accordionDeck = (() => {
  const setUpGame = () => {
    const startDeck = cardlogic
      .shuffle([...cardlogic.createFullDeck()])
      .reduce((prev, curr, idx) => {
        return [
          ...prev,
          {
            ...curr,
            position: idx,
            isShowingFace: true,
            isDraggable: true,
          },
        ];
      }, []);
    return startDeck;
  };

  return {
    setUpGame,
  };
})();

export default accordionDeck;
