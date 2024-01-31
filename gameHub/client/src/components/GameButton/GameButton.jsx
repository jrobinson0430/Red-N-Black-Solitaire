import React from 'react';
import './GameButton.css';
import { capper } from '../../scripts/helpers';

const GameButton = ({ buttontext, handleBtnClick, styles }) => (
  <button
    className='btnStyles p-2'
    type='button'
    onClick={handleBtnClick}
    style={styles}
  >
    {capper(buttontext)}
  </button>
);

export default GameButton;
