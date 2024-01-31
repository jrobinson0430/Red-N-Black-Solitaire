import { useState, useEffect, useContext } from 'react';

import { GameBoard } from './_components';
import { Container } from 'react-bootstrap';
import GameContext from '../../../contextProviders/GameContext';
import chessModule from './scripts/chessModule';
import { HomeButton, Timer, Instructions } from '../../../components';

import './Chess.css';
const Chess = () => {
  const { gameData } = useContext(GameContext);
  const [helpModalClass, setHelpModalClass] = useState('modalFadeIn');
  const [chessBoard, setChessBoard] = useState(chessModule.getStartBoard());

  return (
    <>
      <Container>
        <h1>Chess</h1>
        <HomeButton positioning={{ top: '.3rem', right: '3.7rem' }} />
        <Instructions
          gameName='Chess'
          gameData={gameData}
          helpModalClass={helpModalClass}
        />
        <GameBoard chessBoard={chessBoard} />
      </Container>
    </>
  );
};

export default Chess;
