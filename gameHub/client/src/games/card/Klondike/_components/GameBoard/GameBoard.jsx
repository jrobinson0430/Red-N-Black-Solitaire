import { useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { PlayingCard } from '../../../../../components';
import UserContext from '../../../../../contextProviders/UserContext';
import cardHelpers from '../../../scripts/cardHelpers';

const GameBoard = ({ klondikeBox }) => {
  const { utilityBox } = useContext(UserContext);
  const { state, helpers, handlers } = klondikeBox;
  const { handleStockClick } = handlers;
  const { klondikeTable } = state;
  const { gameMoves } = helpers;

  return (
    <>
      <Row className='mt-3'>
        <div className='d-flex px-0 justify-content-center'>
          {Array(2)
            .fill(null)
            .map((_, idx) => {
              const pileName = idx === 0 ? 'stock' : 'waste';
              const pileArr = klondikeTable[`${pileName}`];

              return (
                <div
                  className='rowDimensions mx-1'
                  id={pileName}
                  onKeyDown={pileName === 'stock' ? handleStockClick : null}
                  onClick={pileName === 'stock' ? handleStockClick : null}
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
                    : cardHelpers.printEmptyPile({
                        gameMoves,
                        position: pileName,
                      })}
                </div>
              );
            })}

          {cardHelpers.generateSpacer()}
          {Array(4)
            .fill(null)
            .map((_, index) => {
              const pileName = `foundation${index}`;
              const pileArr = klondikeTable[pileName];

              return (
                <div
                  className='rowDimensions mx-1'
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
                    : cardHelpers.printEmptyPile({
                        gameMoves,
                        position: pileName,
                      })}
                </div>
              );
            })}
        </div>
      </Row>
      {/* Tableau Row */}
      <Row>
        <div className='d-flex justify-content-center px-0'>
          {Array(7)
            .fill(null)
            .map((_, index) => {
              const pileName = `tableau${index}`;
              const pileArr = klondikeTable[pileName];
              return (
                <div
                  className='rowDimensions mx-1'
                  key={utilityBox.v4()}
                >
                  {pileArr.length
                    ? pileArr.map((card, idx) =>
                        cardHelpers.printCard({
                          ...card,
                          gameMoves,
                          cardOffset: cardHelpers.calculateOffset(idx),
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
