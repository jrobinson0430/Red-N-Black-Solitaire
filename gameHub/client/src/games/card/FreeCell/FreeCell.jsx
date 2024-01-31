import { useContext, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { HomeButton, Instructions, GameWon } from '../../../components';
import { StatContainer, GameBoard } from './_components';
import GameContext from '../../../contextProviders/GameContext';
import { ButtonContainer } from '../_components';

import freeCellDeck from './scripts/setDeck';
import freeCellLogic from './scripts/freeCellLogic';
import cardLogic from '../sharedLogic/cardLogic';

const FreeCell = () => {
  const { gameData } = useContext(GameContext);
  const [helpModalClass, setHelpModalClass] = useState('modalFadeIn');

  const [freeCellTable, setFreeCellTable] = useState(freeCellDeck.initialTable);

  const [lastTableState, setLastTableState] = useState(
    freeCellDeck.initialTable
  );

  const [isPaused, setIsPaused] = useState(true);
  const [showStartBtn, setShowStartBtn] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isFirstMove, setIsFirstMove] = useState(true);
  const [numOfMoves, setNumOfMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [lastScore, setLastScore] = useState(0);
  const [displayGameWon, setDisplayGameWon] = useState(false);
  const [savedTable, setSavedTable] = useState(freeCellDeck.initialTable);
  const [totalTime, setTotalTime] = useState('0:00');

  function handleUndoBtnClick() {
    if (!numOfMoves) return;
    setFreeCellTable(lastTableState);
    setNumOfMoves(numOfMoves + 1);
    setScore(Number(lastScore - 5));
  }

  function handleResumeBtnClick() {
    setFreeCellTable(savedTable);
    setIsPaused(false);
  }

  function handlePauseBtnClick() {
    setFreeCellTable(freeCellDeck.initialTable);
    setSavedTable(freeCellTable);
    setIsPaused(true);
  }

  function handleStartBtnClick() {
    const newTable = freeCellDeck.setUpGame();
    setIsFirstMove(false);
    setFreeCellTable(newTable);
    setLastTableState(newTable);
    setShowStartBtn(!showStartBtn);
    setNumOfMoves(0);
    setScore(0);
    setIsPaused(false);
    setIsGameOver(false);
    setDisplayGameWon(false);
  }

  function handleNewGameBtnClick() {
    setIsFirstMove(true);
    setFreeCellTable(freeCellDeck.initialTable);
    setDisplayGameWon(false);
    setIsPaused(true);
    setIsGameOver(true);
    setTotalTime(0);
    setNumOfMoves(0);
    setShowStartBtn(!showStartBtn);
    setScore(0);
  }

  const buttonBox = {
    // for the buttons
    booleans: { isPaused, showStartBtn, isGameOver },
    start: { text: 'Start Game', handler: handleStartBtnClick },
    pause: { text: 'Pause', handler: handlePauseBtnClick },
    resume: { text: 'Resume', handler: handleResumeBtnClick },
    undo: { text: 'Undo', handler: handleUndoBtnClick },
    newGame: { text: 'New Game', handler: handleNewGameBtnClick },
  };

  const timerBox = {
    isPaused,
    setIsPaused,
    isGameOver,
    setTotalTime,
    isFirstMove,
  };

  const freeCellBox = {
    state: {
      freeCellTable,
      numOfMoves,
      score,
    },
    helpers: {
      gameMoves: (drag, drop) => {
        const moveResult = freeCellLogic.checkValidMove(
          drag,
          drop,
          freeCellTable
        );
        console.log('moveResult', moveResult);

        const {
          // cardToFoundation,
          oldTable,
          newTable,
          isValidMove,
        } = moveResult;
        if (!isValidMove) return;

        setLastTableState(oldTable);
        setFreeCellTable(newTable);
        // const points = cardLogic.calculatePoints(cardToFoundation, cardToWaste);
        // setLastScore(Number(score));
        // setScore(Number(score) + Number(points));
        setNumOfMoves(numOfMoves + 1);

        if (freeCellLogic.checkForWin(newTable)) {
          setDisplayGameWon(true);
          setIsGameOver(true);
        }
      },
    },
  };

  return (
    <Container>
      <h1>FreeCell Solitaire</h1>
      <StatContainer
        freeCellBox={freeCellBox}
        timerBox={timerBox}
      />
      {displayGameWon && <GameWon handleBtnClick={handleNewGameBtnClick} />}
      <HomeButton positioning={{ top: '.3rem', right: '3.7rem' }} />
      <ButtonContainer buttonBox={buttonBox} />
      <Instructions
        gameName='FreeCell Solitaire'
        gameData={gameData}
        helpModalClass={helpModalClass}
      />
      <GameBoard freeCellBox={freeCellBox} />
    </Container>
  );
};
export default FreeCell;
