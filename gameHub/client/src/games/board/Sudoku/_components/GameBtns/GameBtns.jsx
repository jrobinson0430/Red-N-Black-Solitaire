import { useState } from 'react';
import { DropDown } from './_components';
import { capper } from '../../../../../scripts/helpers';
import { Row, Col, Button } from 'react-bootstrap';
import './GameBtns.css';

const GameBtns = ({ sudokuBox }) => {
  const { state, handlers, hooks } = sudokuBox;
  const { currDif, showDropDown } = state;
  const { setShowDropDown, setCurrDif } = hooks;

  // const handleGiveUp = () => {
  //   console.log('give up')
  // }
  return (
    <>
      <Row>
        <Col>
          <div className='d-flex justify-content-between mb-2 flex-wrap'>
            <div>
              <Button
                variant='light'
                className='border border-dark gameBtn'
                onClick={() => handlers.startNewGame()}
              >
                New Game
              </Button>
              <div className='d-inline position-relative'>
                <Button
                  variant='light'
                  className={`${
                    showDropDown && 'highlight_grn'
                  } border border-dark gameBtn`}
                  onClick={() => setShowDropDown(!showDropDown)}
                >
                  {capper(currDif)}
                </Button>
                {showDropDown && <DropDown sudokuBox={sudokuBox} />}
              </div>
              <Button
                onClick={() => handlers.handleGiveUp()}
                variant='light'
                className='border border-dark gameBtn'
              >
                Give Up
              </Button>
            </div>
            <div>
              <Button
                variant='light'
                className='border border-dark gameBtn'
              >
                Hint
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default GameBtns;
