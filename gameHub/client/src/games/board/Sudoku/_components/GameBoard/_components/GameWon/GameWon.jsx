import './GameWon.css';
import { Button } from 'react-bootstrap';
const GameWon = ({ sudokuBox }) => {
  const { handlers } = sudokuBox;
  const handlePlayAgain = (e) => {
    setIsNewGame(true);
    setIsGameOver(false);
  };

  return (
    <div className='winContainer'>
      <h1 className='winHeading'>Game Won!</h1>
      <Button
        onClick={() => handlers.startNewGame()}
        type='button'
        className='border border-dark'
        variant='light'
      >
        Play again?
      </Button>
    </div>
  );
};

export default GameWon;
