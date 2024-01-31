import { Button } from 'react-bootstrap';
import './dropDown.css';
import { GameButton } from '../../../../../../../components';

const DropDown = ({ handlers }) => {
  return (
    <div
      onClick={(e) => handlers.handleDropDown(e)}
      className='dropDown'
    >
      {['easy', 'moderate', 'hard'].map((text, idx) => (
        <GameButton
          styles={{ backgroundColor: 'lightgoldenrodyellow', color: 'black' }}
          key={idx}
          buttontext={text}
        />
      ))}
    </div>
  );
};

export default DropDown;
