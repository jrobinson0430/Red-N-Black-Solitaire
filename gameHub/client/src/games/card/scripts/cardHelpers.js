import { PlayingCard } from '../../../components';
import { v4 } from 'uuid';
const cardHelpers = (() => {
  const emptyCardObj = {
    isDraggable: false,
    rank: 'empty',
    suit: 'empty',
    position: '',
    cardOffset: 0,
  };

  const calculateOffset = (num) => {
    return window.innerWidth < 720 ? 1.1 * num : 1.5 * num;
  };
  const generateSpacer = (num = 1) => {
    return Array(num)
      .fill(null)
      .map((_, idx) => (
        <div
          key={v4()}
          className='rowDimensions'
        >
          <PlayingCard
            key={v4()}
            cardProps={{ rank: 'blank', suit: 'blank' }}
          />
        </div>
      ));
  };

  const printEmptyPile = (objProp = {}) => {
    return (
      <PlayingCard
        key={v4()}
        cardProps={{ ...emptyCardObj, ...objProp }}
      />
    );
  };

  const printCard = (props) => {
    return (
      <PlayingCard
        key={v4()}
        cardProps={props}
      />
    );
  };

  return {
    calculateOffset,
    generateSpacer,
    printEmptyPile,
    printCard,
  };
})();

export default cardHelpers;
