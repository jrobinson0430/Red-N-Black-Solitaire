import { useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { PlayingCard } from '../../../../../components';
import UserContext from '../../../../../contextProviders/UserContext';
import cardHelpers from '../../../scripts/cardHelpers';

const GameBoard = ({ golfBox }) => {
  const { utilityBox } = useContext(UserContext);
  const { state, helpers, handlers } = golfBox;
  const { golfTable } = state;
  const { gameMoves } = helpers;

  return (
    <>
      {/* Tableau */}
      <Row className='mt-3'>
        <div className='d-flex px-0 justify-content-center'>
          {Array(7)
            .fill(null)
            .map((_, idx) => {
              const pileName = `tableau${idx}`;
              const pileArr = golfTable[pileName];
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
        <div className='d-flex px-0 justify-content-center'>
          {Array(2)
            .fill(null)
            .map((_, idx) => {
              const pileName = idx === 0 ? 'stock' : 'talon';
              const pileArr = golfTable[pileName];

              return (
                <div
                  key={utilityBox.v4()}
                  className='rowDimensions'
                  onClick={
                    pileName === 'stock' ? handlers.handleStockClick : null
                  }
                >
                  {pileArr.length
                    ? pileArr.map((card) =>
                        cardHelpers.printCard({
                          ...card,
                          gameMoves,
                          cardOffset: 0,
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
    </>
  );
};

export default GameBoard;
