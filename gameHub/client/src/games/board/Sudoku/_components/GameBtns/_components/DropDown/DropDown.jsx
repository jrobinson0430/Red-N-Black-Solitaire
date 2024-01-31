import { Button } from 'react-bootstrap';
import './dropDown.css';

const DropDown = ({ sudokuBox }) => {
  const { handlers } = sudokuBox;
  return (
    <div
      onClick={(e) => handlers.handleDifChange(e)}
      className='dropDown'
    >
      <Button
        variant='light'
        className='border border-dark'
        data-dif='easy'
      >
        Easy
      </Button>
      <Button
        variant='light'
        className='border border-dark'
        data-dif='moderate'
      >
        Moderate
      </Button>
      <Button
        variant='light'
        className='border border-dark'
        data-dif='hard'
      >
        Hard
      </Button>
    </div>
  );
};

export default DropDown;
