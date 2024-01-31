import { useContext, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { HomeButton, Instructions, GameWon } from '../../../components';
import GameContext from '../../../contextProviders/GameContext';
import { StatContainer, GameBoard } from './_components';
import { ButtonContainer } from '../_components';
import golfDeck from './scripts/setDeck';
import golfLogic from './scripts/golfLogic';
import cardLogic from '../sharedLogic/cardLogic';

const Golf = () => {
  const { gameData } = useContext(GameContext);
  const [helpModalClass, setHelpModalClass] = useState('modalFadeIn');

  const [golfTable, setGolfTable] = useState(golfDeck.initialTable);

  const [lastTableState, setLastTableState] = useState(golfDeck.initialTable);

  const [isPaused, setIsPaused] = useState(true);
  const [showStartBtn, setShowStartBtn] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isFirstMove, setIsFirstMove] = useState(true);
  const [score, setScore] = useState(35);

  const [displayGameWon, setDisplayGameWon] = useState(false);
  const [savedTable, setSavedTable] = useState(golfDeck.initialTable);
  const [totalTime, setTotalTime] = useState('0:00');

  function getScore(table) {
    return Object.values(table)
      .flat()
      .filter((obj) => obj.position.includes('tableau')).length;
  }

  function handleUndoBtnClick() {
    setGolfTable(lastTableState);

    setScore(getScore(lastTableState));
  }

  function handleResumeBtnClick() {
    setGolfTable(savedTable);
    setIsPaused(false);
  }

  function handlePauseBtnClick() {
    setGolfTable(golfDeck.initialTable);
    setSavedTable(golfTable);
    setIsPaused(true);
  }

  function handleStartBtnClick() {
    const newTable = golfDeck.setUpGame();
    setIsFirstMove(false);
    setGolfTable(newTable);
    setLastTableState(newTable);
    setShowStartBtn(!showStartBtn);

    setScore(35);
    setIsPaused(false);
    setIsGameOver(false);
    setDisplayGameWon(false);
  }

  function handleNewGameBtnClick() {
    setIsFirstMove(true);
    setGolfTable(golfDeck.initialTable);
    setDisplayGameWon(false);
    setIsPaused(true);
    setIsGameOver(true);
    setTotalTime(0);

    setShowStartBtn(!showStartBtn);
    setScore(35);
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

  const golfBox = {
    state: {
      golfTable,
      score,
    },
    handlers: {
      handleStockClick: () => {
        const result = golfLogic.showNextCard(golfTable);
        setGolfTable(result.newTable);
        setLastTableState(result.oldTable);

        if (golfLogic.checkForWin(result.newTable)) {
          setDisplayGameWon(true);
          setIsGameOver(true);
        }
      },
    },
    helpers: {
      gameMoves: (drag, drop) => {
        const moveResult = golfLogic.checkValidMove(drag, drop, golfTable);

        const {
          cardToFoundation,
          cardToWaste,
          oldTable,
          newTable,
          isValidMove,
        } = moveResult;
        if (!isValidMove) return;
        setLastTableState(oldTable);
        setGolfTable(newTable);
        setScore(getScore(newTable));

        if (golfLogic.checkForWin(newTable)) {
          setDisplayGameWon(true);
          setIsGameOver(true);
        }
      },
    },
  };

  return (
    <Container>
      <h1>Golf</h1>
      <StatContainer
        golfBox={golfBox}
        timerBox={timerBox}
      />
      {displayGameWon && <GameWon handleBtnClick={handleNewGameBtnClick} />}
      <HomeButton positioning={{ top: '.3rem', right: '3.7rem' }} />
      <ButtonContainer buttonBox={buttonBox} />
      <Instructions
        gameName='Golf Solitaire'
        gameData={gameData}
        helpModalClass={helpModalClass}
      />
      <GameBoard golfBox={golfBox} />
    </Container>
  );
};
export default Golf;
