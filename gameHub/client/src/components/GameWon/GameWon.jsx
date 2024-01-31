import React, { useContext } from 'react';
import UserContext from '../../contextProviders/UserContext';
import './GameWon.css';

const GameWon = ({ handleBtnClick }) => {
  const { utilityBox } = useContext(UserContext);

  return (
    <div
      className='d-flex flex-column align-items-center'
      id='gameWonContainer'
    >
      <h4>Congratulations You&apos;ve Won!</h4>
      <div>
        <button
          type='button'
          className='btn btn-light me-1'
          onClick={() => utilityBox.navigate('/home')}
        >
          Go Home
        </button>
        <button
          type='button'
          className='btn btn-light ms-1'
          onClick={handleBtnClick}
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameWon;
