import { Row } from 'react-bootstrap';
import { useContext } from 'react';
import UserContext from '../../../../../contextProviders/UserContext';

import '../GameBoard/GameBoard.css';

const GameBoard = ({ isGameOver, minesweeperBox }) => {
  const { state, handlers, helpers } = minesweeperBox;
  const { currBoard } = state;
  const { utilityBox } = useContext(UserContext);

  return (
    <Row
      onContextMenu={(e) => handlers.handleRightClick(e)}
      onClick={(e) => handlers.handleBoardClick(e)}
    >
      {currBoard.map((row, idx) => (
        <div
          className='d-flex justify-content-center'
          key={utilityBox.v4()}
        >
          {row.map((obj, i) => (
            <div
              id={obj.coordinates}
              className={helpers.getSqClasses(obj)}
              key={utilityBox.v4()}
            ></div>
          ))}
        </div>
      ))}
    </Row>
  );
};

export default GameBoard;
