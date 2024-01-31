import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import GameContext from '../../../contextProviders/GameContext';
import { ButtonContainer } from '../_components';
import {
  HomeButton,
  Instructions,
  gameButton,
  GameWon,
} from '../../../components';

import { StatContainer, GameBoard } from './_components';

import redNBlackDeck from './scripts/setDeck';
import redNBlackLogic from './scripts/redNBlackLogic';
import cardLogic from '../sharedLogic/cardLogic';

import UserContext from '../../../contextProviders/UserContext';
// import axiosAPI from '../../../apis/axios';
import './RedNBlack.css';

const RedNBlack = () => {
  const { gameData } = useContext(GameContext);
  const { utilityBox } = useContext(UserContext);
  const [redNBlackTable, setRedNBlackTable] = useState(
    redNBlackDeck.initialTable
  );
  const [lastTableState, setLastTableState] = useState(
    redNBlackDeck.initialTable
  );
  const [savedTable, setSavedTable] = useState(redNBlackDeck.initialTable);
  const [redealCount, setRedealCount] = useState(1);
  const [score, setScore] = useState(0);
  const [lastScore, setLastScore] = useState(0);
  const [showStartBtn, setShowStartBtn] = useState(true);
  const [isPaused, setIsPaused] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [totalTime, setTotalTime] = useState('0:00');

  const [helpModalClass, setHelpModalClass] = useState('modalFadeIn');
  const [isFirstMove, setIsFirstMove] = useState(true);

  const [numOfMoves, setNumOfMoves] = useState(0);

  const [displayGameWon, setDisplayGameWon] = useState(false);

  const processGameWin = async () => {
    setShowStartBtn(true);
    // backend is not build for rebuild yet
    // try {
    //   const scoreObj = await {
    //     userName: loggedInUser.userName,
    //     email: loggedInUser.email,
    //     gameName: 'redNBlack',
    //     points: score,
    //     time: totalTime.match(/[0-9]/gi).join(''),
    //     moves: numOfMoves,
    //   };

    //   await axiosAPI.setScore(scoreObj, loggedInUser._id);
    // } catch (error) {
    //   console.error('ERROR in processGameWin FN:', error);
    // }
  };

  function handleStartBtnClick() {
    const newTable = redNBlackDeck.setUpGame();
    setIsFirstMove(false);
    setDisplayGameWon(false);
    setRedNBlackTable(newTable);
    setLastTableState(newTable);
    setShowStartBtn(!showStartBtn);
    setNumOfMoves(0);
    setScore(0);
    setIsPaused(false);
    setIsGameOver(false);
  }

  function handlePauseBtnClick() {
    setRedNBlackTable(redNBlackDeck.initialTable);
    setSavedTable(redNBlackTable);
    setIsPaused(true);
  }

  function handleResumeBtnClick() {
    setRedNBlackTable(savedTable);
    setIsPaused(false);
  }

  function handleNewGameBtnClick() {
    setIsFirstMove(true);
    setDisplayGameWon(false);
    setRedNBlackTable(redNBlackDeck.initialTable);
    setIsPaused(true);
    setIsGameOver(true);
    setTotalTime(0);
    setNumOfMoves(0);
    setShowStartBtn(!showStartBtn);
    setRedealCount(1);
    setScore(0);
  }

  function handleUndoBtnClick() {
    // edge case for tracking the # of redeals when undo button is pressed
    const wasteSize = redNBlackTable.waste.length;
    if (numOfMoves === 0) return;
    if (!wasteSize && redealCount !== 1) setRedealCount(redealCount + 1);
    setRedNBlackTable(lastTableState);
    setNumOfMoves(numOfMoves + 1);
    setScore(Number(lastScore - 15));
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

  const redNBlackBox = {
    state: {
      redNBlackTable,
      numOfMoves,
      score,
    },
    handlers: {
      handleStockClick: () => {
        const processedClick = redNBlackLogic.showNextCard(
          redNBlackTable,
          redealCount
        );

        setNumOfMoves(numOfMoves + 1);
        setRedealCount(processedClick.redeal);
        setRedNBlackTable(processedClick.newTable);
        setLastTableState(processedClick.oldTable);
      },
    },
    helpers: {
      gameMoves: (drag, drop) => {
        const result = redNBlackLogic.checkValidMove(
          drag,
          drop,
          redNBlackTable
        );
        const {
          cardToFoundation,
          cardToTableau,
          oldTable,
          newTable,
          isValidMove,
        } = result;
        if (!isValidMove) return;
        setRedNBlackTable(newTable);
        setLastTableState(oldTable);
        const points = cardLogic.calculatePoints(
          cardToFoundation,
          cardToTableau
        );
        setLastScore(Number(score));
        setScore(Number(score) + Number(points));
        setNumOfMoves(numOfMoves + 1);

        // if game is won.
        if (redNBlackLogic.checkForWin(result.newTable)) {
          setIsPaused(true);
          setIsGameOver(true);
          setDisplayGameWon(true);
        }
      },
    },
  };

  return (
    <Container className='gameContainer'>
      <Instructions
        gameName='Red N Black Solitaire'
        gameData={gameData}
      />

      {displayGameWon && <GameWon handleBtnClick={handleNewGameBtnClick} />}
      <h1 className='mb-'>Red N Black Solitaire</h1>
      <HomeButton positioning={{ top: '.3rem', right: '3.7rem' }} />

      <Instructions
        gameName='Red N Black Solitaire'
        gameData={gameData}
        helpModalClass={helpModalClass}
      />
      <StatContainer
        timerBox={timerBox}
        score={score}
        numOfMoves={numOfMoves}
        redealCount={redealCount}
      />
      <ButtonContainer buttonBox={buttonBox} />

      <GameBoard redNBlackBox={redNBlackBox} />
    </Container>
  );
};

export default RedNBlack;
