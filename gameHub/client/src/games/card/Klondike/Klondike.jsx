import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { StatContainer, GameBoard } from './_components';
import { ButtonContainer } from '../_components';
import { HomeButton, Instructions, GameWon } from '../../../components';

import klondikeDeck from './scripts/setDeck';
import cardLogic from '../sharedLogic/cardLogic';
import klondikeLogic from './scripts/klondikeLogic';

import UserContext from '../../../contextProviders/UserContext';
import GameContext from '../../../contextProviders/GameContext';

import axiosAPI from '../../../apis/axios';

const Klondike = () => {
  const { gameData } = useContext(GameContext);
  const { utilityBox } = useContext(UserContext);

  const [klondikeTable, setKlondikeTable] = useState(klondikeDeck.initialTable);
  const [lastTableState, setLastTableState] = useState(
    klondikeDeck.initialTable
  );
  const [savedTable, setSavedTable] = useState(klondikeDeck.initialTable);
  const [score, setScore] = useState(0);
  const [lastScore, setLastScore] = useState(0);
  const [numOfMoves, setNumOfMoves] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [totalTime, setTotalTime] = useState('0:00');
  const [helpModalClass, setHelpModalClass] = useState('modalFadeIn');
  const [showStartBtn, setShowStartBtn] = useState(true);
  const [displayGameWon, setDisplayGameWon] = useState(false);
  const [isFirstMove, setIsFirstMove] = useState(true);

  const processGameWin = async () => {
    setShowStartBtn(true);
    // try {
    //   const scoreObj = await {
    //     userName: loggedInUser.userName,
    //     email: loggedInUser.email,
    //     gameName: 'klondike',
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
    const newTable = klondikeDeck.setUpGame();
    setIsFirstMove(false);
    setIsGameOver(false);
    setKlondikeTable(newTable);
    setDisplayGameWon(false);
    setLastTableState(newTable);
    setShowStartBtn(!showStartBtn);
    setNumOfMoves(0);
    setIsPaused(false);
  }

  function handlePauseBtnClick() {
    setKlondikeTable(klondikeDeck.initialTable);
    setSavedTable(klondikeTable);
    setIsPaused(true);
  }

  function handleResumeBtnClick() {
    setKlondikeTable(savedTable);
    setIsPaused(false);
  }

  function handleNewGameBtnClick() {
    setDisplayGameWon(false);
    setKlondikeTable(klondikeDeck.initialTable);
    setIsFirstMove(true);

    setIsPaused(true);
    setIsGameOver(true);
    setNumOfMoves(0);
    setShowStartBtn(true);
    setScore(0);
  }

  function handleUndoBtnClick() {
    setKlondikeTable(lastTableState);
    setScore(Number(lastScore));
  }

  const gameMoves = (drag, drop) => {
    const result = klondikeLogic.checkValidMove(drag, drop, klondikeTable);
    const { cardToFoundation, cardToTableau, oldTable, newTable, isValidMove } =
      result;

    if (!isValidMove) return;
    setKlondikeTable(newTable);
    setLastTableState(oldTable);
    const points = cardLogic.calculatePoints(cardToFoundation, cardToTableau);
    setLastScore(Number(score));
    setScore(Number(score) + Number(points));
    setNumOfMoves(numOfMoves + 1);

    // if game is won.
    if (klondikeLogic.checkForWin(result.newTable)) {
      setIsPaused(true);
      setDisplayGameWon(true);
      setIsGameOver(true);
    }
  };

  // let table;
  function autoComplete(obj) {
    const { table, count, currentScore } = obj;
    setKlondikeTable(table);
    setLastTableState(table);
    setNumOfMoves(numOfMoves + count);
    setScore(currentScore);
    setLastScore(currentScore);
    // if game is won.
    if (klondikeLogic.checkForWin(table)) {
      setIsPaused(true);
      setDisplayGameWon(true);
      setIsGameOver(true);
    }
  }

  function handleDblClick(obj) {
    let { table, count, currentScore } = obj;
    let isMoveMade = false;
    const { checkValidMove } = klondikeLogic;
    let foundationCards = [];
    let checkCards = [];
    let updatedTable = table;

    for (let prop in table) {
      if (prop.includes('foundation')) {
        const foundationCard = table[prop].at(-1);
        if (foundationCard) foundationCards.push(foundationCard);
      } else if (!prop.includes('stock')) {
        const checkCard = table[prop].at(-1);
        if (checkCard) checkCards.push(checkCard);
      }
    }

    foundationCards.forEach((dropCard, idx) => {
      checkCards.forEach((dragCard) => {
        const result = checkValidMove(dragCard, dropCard, table);
        const { isValidMove, newTable } = result;
        if (isValidMove) {
          isMoveMade = true;
          updatedTable = newTable;
          currentScore += 10;
        }
      });
    });

    return isMoveMade
      ? handleDblClick({
          table: updatedTable,
          count: count + 1,
          currentScore,
        })
      : autoComplete({ table: updatedTable, count, currentScore });
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

  const klondikeBox = {
    state: {
      klondikeTable,
      numOfMoves,
      score,
    },
    handlers: {
      handleStockClick: () => {
        const processedClick = klondikeLogic.showNextCard(klondikeTable);
        const { newTable, oldTable, resetDeck } = processedClick;

        if (resetDeck) setScore(score - 10);
        setKlondikeTable(newTable);
        setNumOfMoves(numOfMoves + 1);
        setLastTableState(oldTable);
      },
    },
    helpers: {
      gameMoves: (drag, drop) => {
        const result = klondikeLogic.checkValidMove(drag, drop, klondikeTable);

        const {
          cardToFoundation,
          cardToTableau,
          oldTable,
          newTable,
          isValidMove,
        } = result;

        if (!isValidMove) return;
        setKlondikeTable(newTable);
        setLastTableState(oldTable);
        const points = cardLogic.calculatePoints(
          cardToFoundation,
          cardToTableau
        );
        setLastScore(Number(score));
        setScore(Number(score) + Number(points));
        setNumOfMoves(numOfMoves + 1);

        // if game is won.
        if (klondikeLogic.checkForWin(result.newTable)) {
          setIsPaused(true);
          setDisplayGameWon(true);
          setIsGameOver(true);
        }
      },
    },
  };

  return (
    <Container
      // fluid
      style={{ height: '100vh' }}
      className='gameContainer'
      onDoubleClick={() =>
        handleDblClick({
          table: klondikeTable,
          currentScore: score,
          count: 0,
        })
      }
    >
      <Instructions
        gameName='Klondike Solitaire'
        gameData={gameData}
      />

      {displayGameWon && <GameWon handleBtnClick={handleNewGameBtnClick} />}

      <h1>Klondike Solitaire</h1>
      <HomeButton positioning={{ top: '.3rem', right: '3.7rem' }} />
      <StatContainer
        timerBox={timerBox}
        score={score}
        numOfMoves={numOfMoves}
      />
      <ButtonContainer buttonBox={buttonBox} />
      <GameBoard klondikeBox={klondikeBox} />
    </Container>
  );
};

export default Klondike;
