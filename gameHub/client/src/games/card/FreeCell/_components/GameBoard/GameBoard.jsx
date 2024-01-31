import { useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { PlayingCard } from '../../../../../components';
import UserContext from '../../../../../contextProviders/UserContext';
import cardHelpers from '../../../scripts/cardHelpers';
import './GameBoard.css';

const GameBoard = ({ freeCellBox }) => {
  const { utilityBox } = useContext(UserContext);
  const { state, helpers } = freeCellBox;
  const { freeCellTable } = state;
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
      {/* freecells/foundation */}
      <Row className='mt-3'>
        <div className='d-flex px-0 justify-content-evenly'>
          <div className='d-flex justify-content-between'>
            {Array(4)
              .fill(null)
              .map((_, idx) => {
                const pileName = `freecell${idx}`;
                const pileArr = freeCellTable[pileName];
                return (
                  <div
                    key={utilityBox.v4()}
                    className='freeCellCardContainer'
                  >
                    {pileArr.length ? (
                      pileArr.map((card) => (
                        <PlayingCard
                          override={{ position: 'relative' }}
                          key={utilityBox.v4()}
                          cardProps={{
                            ...card,
                            gameMoves,
                            cardOffset: 0,
                          }}
                        />
                      ))
                    ) : (
                      <PlayingCard
                        override={{ position: 'relative' }}
                        key={utilityBox.v4()}
                        cardProps={{ ...emptyCardObj, position: pileName }}
                      />
                    )}
                  </div>
                );
              })}
          </div>
          <div className='d-flex'>
            {Array(4)
              .fill(null)
              .map((_, idx) => {
                const pileName = `foundation${idx}`;
                const pileArr = freeCellTable[pileName];
                return (
                  <div
                    key={utilityBox.v4()}
                    className='freeCellCardContainer'
                  >
                    {pileArr.length ? (
                      pileArr.map((card) => (
                        <PlayingCard
                          override={{ position: 'relative' }}
                          key={utilityBox.v4()}
                          cardProps={{
                            ...card,
                            gameMoves,
                            cardOffset: 0,
                          }}
                        />
                      ))
                    ) : (
                      <PlayingCard
                        override={{ position: 'relative' }}
                        key={utilityBox.v4()}
                        cardProps={{ ...emptyCardObj, position: pileName }}
                      />
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </Row>
      <Row className='mt-3'>
        <div className='d-flex justify-content-center px-0'>
          {Array(8)
            .fill(null)
            .map((_, index) => {
              const pileName = `tableau${index}`;
              const pileArr = freeCellTable[pileName];
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
