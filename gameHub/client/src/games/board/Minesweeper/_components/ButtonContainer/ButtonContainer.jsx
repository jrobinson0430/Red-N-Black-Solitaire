import { DropDown } from './_components';
import { capper } from '../../../../../scripts/helpers';
import { Row, Col, Button } from 'react-bootstrap';
import { GameButton } from '../../../../../components';

const ButtonContainer = ({ minesweeperBox }) => {
  const { state, handlers, helpers } = minesweeperBox;
  const { showDropDown, currDifficulty } = state;

  return (
    <>
      <Row>
        <Col>
          <div className='d-flex justify-content-between mb-2 flex-wrap'>
            <div>
              <GameButton
                buttontext='New Game'
                handleBtnClick={handlers.handleNewGame}
              />
              <div className='d-inline position-relative'>
                <GameButton
                  buttontext={capper(currDifficulty)}
                  handleBtnClick={helpers.toggleDropDown}
                />
                {showDropDown && <DropDown handlers={handlers} />}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ButtonContainer;
