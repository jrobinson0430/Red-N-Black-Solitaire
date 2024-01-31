import { useState, useEffect, useContext } from 'react';
import { HomeButton, Timer, Instructions } from '../../../components';
import { deepCopy } from '../../../scripts/helpers';

import { GameBoard, ButtonContainer, StatContainer } from './_components';
import gameModule from './gameLogic/gameModule';
import { Container } from 'react-bootstrap';

import GameContext from '../../../contextProviders/GameContext';
import './Minesweeper.css';

const Minesweeper = () => {
  const { gameData } = useContext(GameContext);
  const [currBoard, setCurrBoard] = useState([]);
  const [isFirstMove, setIsFirstMove] = useState(true);
  const [isNewGame, setIsNewGame] = useState(false);
  const [currDifficulty, setCurrDifficulty] = useState('easy');
  const [showDropDown, setShowDropDown] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [totalTime, setTotalTime] = useState('0');
  const [minesLeft, setMinesLeft] = useState(0);

  // adding instructions modal
  const [helpModalClass, setHelpModalClass] = useState('modalFadeIn');
  const [displayHelp, setDisplayHelp] = useState(true);

  const processGameMove = (field) => {
    let runAgain = false;

    const newField = field.map((row, rowIdx) => {
      row.map((square, colIdx) => {
        const isHidden = !square.isShowing;
        const isMine = square.value === '*';
        if ((isHidden && square.value !== 0) || (isHidden && !isMine)) {
          return square;
        }

        const checkSquares = gameModule
          .getCheckCoordinates(rowIdx, colIdx, field)
          .map((coord) => {
            const [row, col] = coord.split('-');

            return field.at(row).at(col);
          });

        checkSquares.forEach((sq) => {
          if (!sq) return;
          if (sq.value !== '*' && !sq.isShowing && square.value === 0) {
            sq.isShowing = true;
            runAgain = true;
          }
        });
        return square;
      });
      return row;
    });
    return runAgain ? processGameMove(newField) : newField;
  };

  function getMineCount(board) {
    const flagsPlaced = board.flat().filter((obj) => obj.hasFlag).length;
    const totalMines = {
      easy: 10,
      moderate: 40,
      hard: 99,
    }[currDifficulty];

    return totalMines - flagsPlaced;
  }

  function checkForWin(checkBoard) {
    const isWon = checkBoard
      .flat()
      .filter((obj) => obj.value === '*' && !obj.hasFlag);
    return !isWon.length;
  }

  const minesweeperBox = {
    state: {
      currBoard,
      showDropDown,
      currDifficulty,
      isFirstMove,
      isGameOver,
      totalTime,
      minesLeft,
    },
    hooks: {
      setTotalTime,
    },
    handlers: {
      handleBoardClick: (e) => {
        if (!e.target.id || isGameOver) return; // prevents invalid click
        const [row, col] = e.target.id.split('-');
        let updatedBoard = deepCopy(currBoard);
        let selectedSq = null;
        let isMine = updatedBoard.at(row).at(col).value === '*';

        // prevents first click from being a mine.
        while (isFirstMove && isMine) {
          gameModule.newGame(currDifficulty);
          updatedBoard = gameModule.getStartBoard();
          isMine = updatedBoard.at(row).at(col).value === '*';
        }

        setIsFirstMove(false);
        selectedSq = { ...updatedBoard.at(row).at(col) };

        if (selectedSq.hasFlag) return; // do nothing if sq has flag;

        selectedSq.isShowing = true; // gives processGameMove a starting point
        updatedBoard[row][col] = selectedSq;

        if (selectedSq.value === '*') {
          setCurrBoard(updatedBoard);
          return setIsGameOver(true);
        }

        return setCurrBoard(processGameMove(updatedBoard));
      },
      handleRightClick: (e) => {
        e.preventDefault();
        const sqCoordinate = e.target.id;
        if (!sqCoordinate || isFirstMove || isGameOver) return;

        let updatedBoard = deepCopy(currBoard);
        const [row, col] = sqCoordinate.split('-');
        const selectedSq = { ...updatedBoard.at(row).at(col) };

        if (selectedSq.isShowing) return; // cannot place flag if already showing
        selectedSq.hasFlag = !selectedSq.hasFlag;
        updatedBoard[row][col] = selectedSq;
        const newMineCount = getMineCount(updatedBoard);

        if (!newMineCount) {
          if (checkForWin(updatedBoard)) {
            setMinesLeft(newMineCount);
            setCurrBoard(updatedBoard);
            return setIsGameOver(true);
          }
        }

        setMinesLeft(newMineCount);
        setCurrBoard(updatedBoard);
      },
      handleNewGame: () => {
        gameModule.newGame(currDifficulty);
        setCurrBoard(gameModule.getStartBoard());
        setIsGameOver(false);
        setIsFirstMove(true);
        setTotalTime(0);
      },
      handleDropDown: (e) => {
        const newDif = e.target.textContent.toLowerCase();
        if (currDifficulty === newDif || !newDif) return;
        setIsGameOver(false);
        setIsFirstMove(true);
        setCurrDifficulty(newDif);
        setShowDropDown(!showDropDown);
        gameModule.newGame(newDif);
        setCurrBoard(gameModule.getStartBoard());
      },
    },
    helpers: {
      getSqClasses: (sqObj) => {
        const classLookup = {
          '*': 'mine',
          0: 'empty',
          1: 'one',
          2: 'two',
          3: 'three',
          4: 'four',
          5: 'five',
          6: 'six',
          7: 'seven',
          8: 'eight',
        };

        const { isShowing, hasFlag, value } = sqObj;
        const isExploded = isGameOver && isShowing && value === '*';
        const isBadFlag = isGameOver && hasFlag && value !== '*';
        const isGoodFlag = isGameOver && hasFlag && value === '*';

        let classes = hasFlag
          ? 'flag bgImg mineSquare dimensions'
          : isShowing || isGameOver
          ? `${classLookup[value]} bgImg dimensions`
          : 'mineSquare dimensions';

        // classes for when the game is over
        if (isExploded) classes = 'redBomb mine dimensions';
        if (isBadFlag) classes = 'badFlag dimensions';
        if (isGoodFlag) classes = 'bgGreen flag bgImg dimensions';
        return classes;
      },
      toggleDropDown: () => setShowDropDown(!showDropDown),
    },
  };

  useEffect(() => {
    // sets new game on initial load
    gameModule.newGame(currDifficulty);
    setCurrBoard(gameModule.getStartBoard());
  }, []);

  useEffect(() => {
    console.log('use effect rendered');

    const totalMines = {
      easy: 10,
      moderate: 40,
      hard: 99,
    }[currDifficulty];
    setMinesLeft(totalMines);
  }, [currDifficulty, isFirstMove]);

  return (
    <>
      <Container
        fluid
        style={{ height: '100vh' }}
        onClick={() => showDropDown && setShowDropDown(false)}
      >
        <h1>Minesweeper</h1>
        <HomeButton positioning={{ top: '.3rem', right: '3.7rem' }} />
        <Instructions
          gameName='Minesweeper'
          gameData={gameData}
          helpModalClass={helpModalClass}
        />
        <StatContainer
          styles={{ justifyContent: 'flex-end' }}
          minesweeperBox={minesweeperBox}
        />
        <ButtonContainer minesweeperBox={minesweeperBox} />
        <GameBoard minesweeperBox={minesweeperBox} />
      </Container>
    </>
  );
};

export default Minesweeper;
