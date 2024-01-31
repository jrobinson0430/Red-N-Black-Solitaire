import { useContext, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { HomeButton, Instructions, GameWon } from '../../../components';
import { StatContainer, GameBoard } from './_components';
import GameContext from '../../../contextProviders/GameContext';
import { ButtonContainer } from '../_components';
import demonDeck from './scripts/setDeck';
import demonLogic from './scripts/demonLogic';
import cardLogic from '../sharedLogic/cardLogic';

const Demon = () => {
  const { gameData } = useContext(GameContext);
  const [helpModalClass, setHelpModalClass] = useState('modalFadeIn');
  const [demonTable, setDemonTable] = useState(demonDeck.initialTable);
  const [lastTableState, setLastTableState] = useState(demonDeck.initialTable);
  const [isPaused, setIsPaused] = useState(true);
  const [showStartBtn, setShowStartBtn] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isFirstMove, setIsFirstMove] = useState(true);
  const [numOfMoves, setNumOfMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [lastScore, setLastScore] = useState(0);
  const [displayGameWon, setDisplayGameWon] = useState(false);
  const [savedTable, setSavedTable] = useState(demonDeck.initialTable);
  const [totalTime, setTotalTime] = useState('0:00');

  function handleUndoBtnClick() {
    if (!numOfMoves) return;
    setDemonTable(lastTableState);
    setNumOfMoves(numOfMoves + 1);
    setScore(Number(lastScore - 5));
  }

  function handleResumeBtnClick() {
    setDemonTable(savedTable);
    setIsPaused(false);
  }

  function handlePauseBtnClick() {
    setDemonTable(demonDeck.initialTable);
    setSavedTable(demonTable);
    setIsPaused(true);
  }

  function handleStartBtnClick() {
    const newTable = demonDeck.setUpGame();
    setIsFirstMove(false);
    setDemonTable(newTable);
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
    setDemonTable(demonDeck.initialTable);
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

  const demonBox = {
    state: {
      demonTable,
      numOfMoves,
      score,
    },
    handlers: {
      handleStockClick: () => {
        const result = demonLogic.showNextCard(demonTable);
        setDemonTable(result.newTable);
        setLastTableState(result.oldTable);
        setNumOfMoves(numOfMoves + 1);
      },
    },
    helpers: {
      gameMoves: (drag, drop) => {
        const moveResult = demonLogic.checkValidMove(drag, drop, demonTable);
        const {
          cardToFoundation,
          cardToTableau,
          oldTable,
          newTable,
          isValidMove,
        } = moveResult;
        if (!isValidMove) return;

        setLastTableState(oldTable);
        setDemonTable(newTable);
        const points = cardLogic.calculatePoints(
          cardToFoundation,
          cardToTableau
        );
        setLastScore(Number(score));
        setScore(Number(score) + Number(points));
        setNumOfMoves(numOfMoves + 1);

        if (demonLogic.checkForWin(newTable)) {
          setDisplayGameWon(true);
          setIsGameOver(true);
        }
      },
    },
  };

  return (
    <Container>
      <h1>Demon Solitiare</h1>
      <StatContainer
        demonBox={demonBox}
        timerBox={timerBox}
      />
      {displayGameWon && <GameWon handleBtnClick={handleNewGameBtnClick} />}
      <HomeButton positioning={{ top: '.3rem', right: '3.7rem' }} />
      <ButtonContainer buttonBox={buttonBox} />
      <Instructions
        gameName='Demon Solitaire'
        gameData={gameData}
        helpModalClass={helpModalClass}
      />
      <GameBoard demonBox={demonBox} />
    </Container>
  );
};

export default Demon;
