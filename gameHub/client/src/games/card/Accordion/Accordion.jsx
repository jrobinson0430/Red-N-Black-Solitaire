import { useContext, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { HomeButton, Instructions, GameWon } from '../../../components';
import { StatContainer, GameBoard } from './_components';
import GameContext from '../../../contextProviders/GameContext';
import { ButtonContainer } from '../_components';

import accordionDeck from './scripts/setDeck';
import accordionLogic from './scripts/accordionLogic';
import cardLogic from '../sharedLogic/cardLogic';

const Accordion = () => {
  const { gameData } = useContext(GameContext);
  const [helpModalClass, setHelpModalClass] = useState('modalFadeIn');
  const [accordionTable, setAccordionTable] = useState([]);
  const [lastTableState, setLastTableState] = useState([]);
  const [isPaused, setIsPaused] = useState(true);
  const [showStartBtn, setShowStartBtn] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isFirstMove, setIsFirstMove] = useState(true);
  const [numOfMoves, setNumOfMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [lastScore, setLastScore] = useState(0);
  const [displayGameWon, setDisplayGameWon] = useState(false);
  const [savedTable, setSavedTable] = useState([]);
  const [totalTime, setTotalTime] = useState('0:00');

  function handleUndoBtnClick() {
    if (!numOfMoves) return;
    setAccordionTable(lastTableState);
    setNumOfMoves(numOfMoves + 1);
    setScore(Number(lastScore - 5));
  }

  function handleResumeBtnClick() {
    setAccordionTable(savedTable);
    setIsPaused(false);
  }

  function handlePauseBtnClick() {
    setAccordionTable([]);
    setSavedTable(accordionTable);
    setIsPaused(true);
  }

  function handleStartBtnClick() {
    const newTable = accordionDeck.setUpGame();
    setIsFirstMove(false);
    setAccordionTable(newTable);
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
    setAccordionTable([]);
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

  const accordionBox = {
    state: {
      accordionTable,
      numOfMoves,
      score,
    },
    helpers: {
      gameMoves: (drag, drop) => {
        const moveResult = accordionLogic.checkValidMove(
          drag,
          drop,
          accordionTable
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
        setAccordionTable(newTable);
        setLastScore(score);
        setScore(score + 5);
        setNumOfMoves(numOfMoves + 1);

        if (accordionLogic.checkForWin(newTable)) {
          setDisplayGameWon(true);
          setIsGameOver(true);
        }
      },
    },
  };

  return (
    <Container fluid>
      <h1>Accordion</h1>
      <StatContainer
        accordionBox={accordionBox}
        timerBox={timerBox}
      />
      {displayGameWon && <GameWon handleBtnClick={handleNewGameBtnClick} />}
      <HomeButton positioning={{ top: '.3rem', right: '3.7rem' }} />
      <ButtonContainer buttonBox={buttonBox} />
      <Instructions
        gameName='Accordion Solitaire'
        gameData={gameData}
        helpModalClass={helpModalClass}
      />
      <GameBoard accordionBox={accordionBox} />
    </Container>
  );
};

export default Accordion;
