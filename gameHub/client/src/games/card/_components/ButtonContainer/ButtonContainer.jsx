import React from 'react';
import { GameButton } from '../../../../components';

const ButtonContainer = ({ buttonBox }) => {
  const { booleans, start, pause, resume, undo, newGame } = buttonBox;
  const { isPaused, showStartBtn, isGameWon } = booleans;

  return (
    <div className='d-flex justify-content-end'>
      {showStartBtn && (
        <GameButton
          buttontext={start.text}
          handleBtnClick={start.handler}
        />
      )}
      {!isPaused && !showStartBtn && (
        <GameButton
          buttontext={pause.text}
          handleBtnClick={pause.handler}
        />
      )}
      {((isPaused && !showStartBtn) || isGameWon) && (
        <GameButton
          buttontext={resume.text}
          handleBtnClick={resume.handler}
        />
      )}
      {!showStartBtn && !isPaused && (
        <GameButton
          buttontext={undo.text}
          handleBtnClick={undo.handler}
        />
      )}
      {!showStartBtn && (
        <GameButton
          buttontext={newGame.text}
          handleBtnClick={newGame.handler}
        />
      )}
    </div>
  );
};

export default ButtonContainer;
