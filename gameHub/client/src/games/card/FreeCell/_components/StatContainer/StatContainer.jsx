import { Timer } from '../../../../../components';

const StatContainer = ({ freeCellBox, timerBox }) => {
  const { state } = freeCellBox;
  const { numOfMoves, score } = state;
  return (
    <div className='my-2 statContainer'>
      <div>{`Score: ${score}`}</div>

      <div>
        Moves:&nbsp;
        {numOfMoves}
      </div>
      <Timer timerBox={timerBox} />
    </div>
  );
};

export default StatContainer;
