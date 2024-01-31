import { useEffect } from 'react';
import { v4 } from 'uuid';
import './tracker.css';

const Tracker = ({ sudokuBox }) => {
  const { state, handlers } = sudokuBox;
  const { trackCount, selectedVal } = state;

  return (
    <>
      {trackCount.map((arr) => {
        const [val, count] = arr;
        return (
          <button
            onClick={(e) => handlers.handleSelectedVal(e)}
            data-val={val}
            key={v4()}
            className={`${
              +selectedVal === +val && 'highlight_grn'
            } numContainer mt-3`}
          >
            <p
              data-val={val}
              className='text-decoration-underline'
            >
              {val}'s
            </p>
            <p
              data-val={val}
              className='h5'
            >
              {9 - +count}
            </p>
          </button>
        );
      })}
    </>
  );
};

export default Tracker;
