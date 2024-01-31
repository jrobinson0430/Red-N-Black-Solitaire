import { Timer } from '../../../../../components';

const StatContainer = ({ golfBox, timerBox }) => {
  const { state } = golfBox;
  const { numOfMoves, score } = state;
  return (
    <div className='my-2 statContainer'>
      <div>{`Score: ${score}`}</div>

      <Timer timerBox={timerBox} />
    </div>
  );
};

export default StatContainer;
