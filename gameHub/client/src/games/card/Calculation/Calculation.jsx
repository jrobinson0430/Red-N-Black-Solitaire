import { useContext, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { HomeButton, Instructions, GameWon } from '../../../components';
import { StatContainer, GameBoard } from './_components';
import GameContext from '../../../contextProviders/GameContext';
import { ButtonContainer } from '../_components';

import calculationDeck from './scripts/setDeck';
import calculationLogic from './scripts/calculationLogic';
import cardLogic from '../sharedLogic/cardLogic';

const Calculation = () => {
  const { gameData } = useContext(GameContext);
  const [helpModalClass, setHelpModalClass] = useState('modalFadeIn');

  const [calculationTable, setCalculationTable] = useState(
    calculationDeck.initialTable
  );

  const [lastTableState, setLastTableState] = useState(
    calculationDeck.initialTable
  );

  const [isPaused, setIsPaused] = useState(true);
  const [showStartBtn, setShowStartBtn] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isFirstMove, setIsFirstMove] = useState(true);
  const [numOfMoves, setNumOfMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [lastScore, setLastScore] = useState(0);
  const [displayGameWon, setDisplayGameWon] = useState(false);
  const [savedTable, setSavedTable] = useState(calculationDeck.initialTable);
  const [totalTime, setTotalTime] = useState('0:00');

  function handleUndoBtnClick() {
    if (!numOfMoves) return;
    setCalculationTable(lastTableState);
    setNumOfMoves(numOfMoves + 1);
    setScore(Number(lastScore - 5));
  }

  function handleResumeBtnClick() {
    setCalculationTable(savedTable);
    setIsPaused(false);
  }

  function handlePauseBtnClick() {
    setCalculationTable(calculationDeck.initialTable);
    setSavedTable(calculationTable);
    setIsPaused(true);
  }

  function handleStartBtnClick() {
    const newTable = calculationDeck.setUpGame();
    setIsFirstMove(false);
    setCalculationTable(newTable);
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
    setCalculationTable(calculationDeck.initialTable);
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

  const calculationBox = {
    state: {
      calculationTable,
      numOfMoves,
      score,
    },
    helpers: {
      gameMoves: (drag, drop) => {
        const moveResult = calculationLogic.checkValidMove(
          drag,
          drop,
          calculationTable
        );

        const {
          cardToFoundation,
          cardToWaste,
          oldTable,
          newTable,
          isValidMove,
        } = moveResult;
        if (!isValidMove) return;

        setLastTableState(oldTable);
        setCalculationTable(newTable);
        const points = cardLogic.calculatePoints(cardToFoundation, cardToWaste);
        setLastScore(Number(score));
        setScore(Number(score) + Number(points));
        setNumOfMoves(numOfMoves + 1);

        if (calculationLogic.checkForWin(newTable)) {
          setDisplayGameWon(true);
          setIsGameOver(true);
        }
      },
    },
  };

  return (
    <>
      <Container>
        <h1>Calculation</h1>
        <StatContainer
          calculationBox={calculationBox}
          timerBox={timerBox}
        />
        {displayGameWon && <GameWon handleBtnClick={handleNewGameBtnClick} />}
        <HomeButton positioning={{ top: '.3rem', right: '3.7rem' }} />
        <ButtonContainer buttonBox={buttonBox} />
        <Instructions
          gameName='Calculation Solitaire'
          gameData={gameData}
          helpModalClass={helpModalClass}
        />
        <GameBoard calculationBox={calculationBox} />
      </Container>
    </>
  );
};

export default Calculation;
