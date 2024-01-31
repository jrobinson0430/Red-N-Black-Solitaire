import { useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { PlayingCard } from '../../../../../components';
import UserContext from '../../../../../contextProviders/UserContext';

import './GameBoard.css';
const GameBoard = ({ accordionBox }) => {
  const { utilityBox } = useContext(UserContext);
  const { state, helpers } = accordionBox;
  const { accordionTable } = state;
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
      {/* Tableau */}
      <Row className='mt-3'>
        <Col className='d-flex flex-wrap'>
          {accordionTable.map((card, idx) => {
            return (
              <div
                key={utilityBox.v4()}
                className='accordionCardContainer'
              >
                <PlayingCard
                  override={{
                    position: 'relative',
                    width: '5.1rem',
                    height: '6.8rem',
                  }}
                  cardProps={{ ...card, gameMoves }}
                />
              </div>
            );
          })}
        </Col>
      </Row>
    </>
  );
};

export default GameBoard;
