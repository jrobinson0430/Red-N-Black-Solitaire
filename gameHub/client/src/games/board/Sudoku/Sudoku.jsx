import { useState, useEffect, useContext } from 'react';
import gameModule from './scripts/gameModule';
import { HomeButton, Instructions } from '../../../components';
import { GameBoard, GameBtns, Tracker } from './_components';
import { Container, Row, Col } from 'react-bootstrap';
import { deepCopy } from '../../../scripts/helpers';
import { useNavigate } from 'react-router-dom';
import GameContext from '../../../contextProviders/GameContext';
import './sudoku.css';

const Sudoku = () => {
  // console.log('sudoku fired')
  const [currBoard, setCurrBoard] = useState([]);
  const [trackCount, setTrackCount] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [currDif, setCurrDif] = useState('hard');
  const [selectedVal, setSelectedVal] = useState(null);
  const { gameData } = useContext(GameContext);

  const navigate = useNavigate();

  function countBoard(board) {
    return Object.entries(
      board
        .flat()
        .reduce(
          (prev, curr) =>
            Object.hasOwn(prev, curr)
              ? { ...prev, [curr]: prev[curr] + 1 }
              : prev,
          { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 }
        )
    );
  }

  const sudokuBox = {
    state: {
      currBoard,
      trackCount,
      isGameOver,
      showDropDown,
      currDif,
      selectedVal,
    },
    hooks: {
      setCurrBoard,
      setIsGameOver,
      setShowDropDown,
      setCurrDif,
    },
    handlers: {
      startNewGame: () => {
        gameModule.newGame(currDif);
        setCurrBoard(gameModule.getStartBoard());
        setSelectedVal(null);
        setIsGameOver(false);
      },
      processUserInput: (e) => {
        let value = e.target.value;

        if (!value) return;
        value = [...'123456789'].includes(value) ? value : '';
        const [row, col] = e.target.dataset.sq;
        let updatedBoard = deepCopy(currBoard);
        updatedBoard[row][col] = value;
        setCurrBoard(updatedBoard);

        gameModule.checkForWin(updatedBoard) && setIsGameOver(true);
      },
      handleDifChange: (e) => {
        setCurrDif(e.target.dataset.dif);
        setShowDropDown(!showDropDown);
      },
      handleSelectedVal: (e) => {
        let selected = e.target.dataset.val;
        if (selected === selectedVal) selected = '';
        setSelectedVal(selected);
      },
      handleGiveUp: () => {
        setCurrBoard(gameModule.getSolvedBoard());
      },
    },
  };

  useEffect(() => {
    setTrackCount(countBoard(currBoard));
  }, [currBoard]);

  useEffect(() => {
    gameModule.newGame(currDif);
    setCurrBoard(gameModule.getStartBoard());
  }, []);

  return (
    <>
      <Container
        fluid
        className='p-0 position-relative'
      >
        <h1 className='text-center'>Sudoku</h1>
        <HomeButton positioning={{ top: '.3rem', right: '3.7rem' }} />
        <Instructions
          gameName='Sudoku'
          gameData={gameData}
        />
        <Row className='justify-content-center m-0 p-0'>
          <Col
            lg={9}
            xl={8}
          >
            <GameBtns sudokuBox={sudokuBox} />
          </Col>
        </Row>
        <Row className='justify-content-center m-0 p-0'>
          <Col
            lg={9}
            xl={8}
          >
            <GameBoard sudokuBox={sudokuBox} />
          </Col>
        </Row>
        <Row className='justify-content-center m-0 p-0'>
          <Col
            lg={9}
            xl={8}
          >
            <div className='d-flex justify-content-center flex-wrap'>
              <Tracker sudokuBox={sudokuBox} />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Sudoku;
