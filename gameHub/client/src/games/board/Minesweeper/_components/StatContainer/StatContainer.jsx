import { Timer } from '../../../../../components';

const StatContainer = ({ minesweeperBox, styles }) => {
  const { state, hooks } = minesweeperBox;
  const { setTotalTime } = hooks;
  const { minesLeft, isFirstMove, isGameOver, totalTime } = state;

  const timerBox = { isFirstMove, isGameOver, totalTime, setTotalTime };
  return (
    <div
      style={styles}
      className='my-2 statContainer'
    >
      <div> Mines Left:&nbsp; {minesLeft}</div>
      <Timer timerBox={timerBox} />
    </div>
  );
};

export default StatContainer;

/* 
i will need a unique stat container for each game because the information inside is unique to each game.
*/
