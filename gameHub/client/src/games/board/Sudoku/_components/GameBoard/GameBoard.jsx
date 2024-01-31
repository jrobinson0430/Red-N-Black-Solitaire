import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { v4 } from 'uuid';
import { GameWon } from '../GameBoard/_components/index';
import './GameBoard.css';

const GameBoard = ({ sudokuBox }) => {
  const { state, handlers } = sudokuBox;
  const { currBoard, isGameOver, selectedVal } = state;

  // helper specific to this component
  function setSqClasses(value, row, col, selVal) {
    const borderLook = { 2: true, 5: true, 8: true };
    let sqClasses = 'square text-center w-100';

    if (+selectedVal === +value && selectedVal) sqClasses += ' highlight_grn ';

    if (typeof value === 'number') sqClasses += ' staticNums ';
    if (row === 0) sqClasses += ' topBorder ';
    if (col === 0) sqClasses += ' leftBorder ';
    if (borderLook[col]) sqClasses += ' rightBorder ';
    if (borderLook[row]) sqClasses += ' bottomBorder ';
    return sqClasses;
  }

  return (
    <>
      {currBoard &&
        currBoard.map((arr, rowIdx) => (
          <Row
            key={v4()}
            className='mx-0'
          >
            {arr.map((val, colIdx) => {
              return (
                <Col
                  key={v4()}
                  className='p-0 m-0'
                >
                  <input
                    maxLength='1'
                    key={v4()}
                    onBlur={(e) => handlers.processUserInput(e)}
                    disabled={typeof val === 'number'}
                    data-sq={`${rowIdx}${colIdx}`}
                    className={setSqClasses(val, rowIdx, colIdx, selectedVal)}
                    defaultValue={val ? val : ''}
                  />
                </Col>
              );
            })}
          </Row>
        ))}
      {isGameOver && <GameWon sudokuBox={sudokuBox} />}
    </>
  );
};

export default GameBoard;
