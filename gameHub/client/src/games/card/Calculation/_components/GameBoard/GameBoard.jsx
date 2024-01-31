import { useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { PlayingCard } from '../../../../../components';
import UserContext from '../../../../../contextProviders/UserContext';

import cardHelpers from '../../../scripts/cardHelpers';

const GameBoard = ({ calculationBox }) => {
  const { utilityBox } = useContext(UserContext);
  const { state, helpers } = calculationBox;
  const { calculationTable } = state;
  const { gameMoves } = helpers;

  const emptyCardObj = {
    isDraggable: false,
    rank: 'empty',
    suit: 'empty',
    position: '',
    cardOffset: 0,
    gameMoves,
  };

  return (
    <>
      {/* Foundation */}
      <Row className='mt-3'>
        <div className='d-flex px-0 justify-content-center'>
          {Array(4)
            .fill(null)
            .map((_, idx) => {
              const pileArr = calculationTable[`foundation${idx}`];
              return (
                <div
                  key={utilityBox.v4()}
                  className='rowDimensions'
                >
                  {pileArr.length
                    ? pileArr.map((card) =>
                        cardHelpers.printCard({
                          ...card,
                          gameMoves,
                          cardOffset: 0,
                        })
                      )
                    : cardHelpers.printEmptyPile({ gameMoves })}
                </div>
              );
            })}
        </div>
      </Row>

      {/* waste */}
      <Row>
        <div className='d-flex px-0 justify-content-center'>
          {Array(4)
            .fill(null)
            .map((_, idx) => {
              const pileName = `waste${idx}`;
              const pileArr = calculationTable[pileName];

              return (
                <div
                  key={utilityBox.v4()}
                  className='rowDimensions'
                >
                  {pileArr.length
                    ? pileArr.map((card, index) =>
                        cardHelpers.printCard({
                          ...card,
                          gameMoves,
                          cardOffset: cardHelpers.calculateOffset(index),
                        })
                      )
                    : cardHelpers.printEmptyPile({
                        gameMoves,
                        position: pileName,
                      })}
                </div>
              );
            })}
        </div>
      </Row>
      {/* Stock/Talon */}
      <Row style={{ marginTop: '8rem' }}>
        <div className='d-flex px-0 justify-content-start'>
          {Array(2)
            .fill(null)
            .map((_, idx) => {
              const pileName = idx === 0 ? 'stock' : 'talon';
              const pileArr = calculationTable[pileName];

              return (
                <div
                  key={utilityBox.v4()}
                  className='rowDimensions'
                >
                  {pileArr.length
                    ? pileArr.map((card) =>
                        cardHelpers.printCard({
                          ...card,
                          gameMoves,
                          cardOffset: 0,
                        })
                      )
                    : cardHelpers.printEmptyPile({ gameMoves })}
                </div>
              );
            })}
        </div>
      </Row>
    </>
  );
};

export default GameBoard;
