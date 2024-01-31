import { useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { PlayingCard } from '../../../../../components';
import UserContext from '../../../../../contextProviders/UserContext';
import cardHelpers from '../../../scripts/cardHelpers';

const GameBoard = ({ redNBlackBox }) => {
  const { utilityBox } = useContext(UserContext);
  const { state, helpers, handlers } = redNBlackBox;
  const { handleStockClick } = handlers;
  const { redNBlackTable } = state;
  const { gameMoves } = helpers;

  return (
    <>
      <Row className='my-2'>
        <div className='d-flex px-0 justify-content-center'>
          {Array(8)
            .fill(null)
            .map((_, index) => {
              const pileArr = redNBlackTable[`foundation${index}`];

              return (
                <div
                  className='rowDimensions'
                  key={utilityBox.v4()}
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

      <Row>
        <div className='d-flex justify-content-center mb-5 px-0'>
          {Array(8)
            .fill(null)
            .map((_, index) => {
              const pileArr = redNBlackTable[`tableau${index}`];
              return (
                <div
                  className='rowDimensions'
                  key={utilityBox.v4()}
                >
                  {pileArr.length
                    ? pileArr.map((card, idx) => {
                        let cardProps = {
                          ...card,
                          cardOffset: cardHelpers.calculateOffset(idx),
                          gameMoves,
                        };
                        console.log(cardProps);
                        if (!Object.hasOwn(cardProps, 'rank')) {
                          cardProps = {
                            ...cardProps,
                            rank: 'empty',
                            suit: 'empty',
                          };
                        }

                        return (
                          <PlayingCard
                            key={utilityBox.v4()}
                            cardProps={cardProps}
                          />
                        );
                      })
                    : cardHelpers.printEmptyPile({ gameMoves })}
                </div>
              );
            })}
        </div>
      </Row>
      {/* Stock/Talon */}
      <Row style={{ marginTop: '8rem' }}>
        <div className='d-flex justify-content-center'>
          {Array(2)
            .fill(null)
            .map((_, idx) => {
              const pileName = idx === 0 ? 'stock' : 'waste';
              const pileArr = redNBlackTable[`${pileName}`];

              return (
                <div
                  className='rowDimensions mt-5 mx-1'
                  id={pileName}
                  onClick={pileName === 'stock' ? handleStockClick : null}
                  onKeyPress={pileName === 'stock' ? handleStockClick : null}
                  key={utilityBox.v4()}
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
