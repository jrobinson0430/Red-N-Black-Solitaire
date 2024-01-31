import { useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { PlayingCard } from '../../../../../components';
import UserContext from '../../../../../contextProviders/UserContext';
import cardHelpers from '../../../scripts/cardHelpers';

const GameBoard = ({ demonBox }) => {
  const { utilityBox } = useContext(UserContext);
  const { state, helpers, handlers } = demonBox;
  const { demonTable } = state;
  const { gameMoves } = helpers;

  return (
    <>
      {/* Foundation */}
      <Row className='mt-3'>
        <div className='d-flex px-0 justify-content-center'>
          {cardHelpers.generateSpacer(2)}
          {Array(4)
            .fill(null)
            .map((_, idx) => {
              const pileName = `foundation${idx}`;
              const pileArr = demonTable[pileName];
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
      {/* Heel/Tableau */}
      <Row>
        <div className='d-flex px-0 justify-content-center'>
          {Array(1)
            .fill(null)
            .map((_, idx) => {
              const pileArr = demonTable.heel;
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
          {cardHelpers.generateSpacer(1)}

          {Array(4)
            .fill(null)
            .map((_, idx) => {
              const pileArr = demonTable[`tableau${idx}`];

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
                    : cardHelpers.printEmptyPile({ gameMoves })}
                </div>
              );
            })}
        </div>
      </Row>
      <Row>
        <div className='d-flex px-0 justify-content-start'>
          {Array(2)
            .fill(null)
            .map((_, idx) => {
              const pileName = idx === 0 ? 'stock' : 'talon';
              const pileArr = demonTable[pileName];
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
