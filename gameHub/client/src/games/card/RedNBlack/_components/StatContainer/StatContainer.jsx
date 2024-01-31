import { Timer } from '../../../../../components';

const StatContainer = ({ redealCount, numOfMoves, score, timerBox }) => {
  return (
    <div className='my-2 statContainer'>
      <div>{`Score: ${score}`}</div>
      <div className='d-flex '>
        <div className='me-2'>
          Redeals:&nbsp;
          {redealCount}
        </div>
        <div>
          Moves:&nbsp;
          {numOfMoves}
        </div>
      </div>
      <Timer timerBox={timerBox} />
    </div>
  );
};

export default StatContainer;
