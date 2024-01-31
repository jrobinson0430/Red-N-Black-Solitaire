import { Row } from 'react-bootstrap';
import { v4 } from 'uuid';
import './GameBoard.css';
const GameBoard = ({ chessBoard }) => {
  // console.log(chessBoard)
  let isDarkSq = false;
  return (
    <>
      {Array(8)
        .fill(null)
        .map((_, idx) => {
          const start = idx * 8;
          const end = start + 8;
          return (
            <div
              key={v4()}
              className=' d-flex justify-content-center'
            >
              {chessBoard.slice(start, end).map((sq, index) => {
                const selected = sq.isSelected ? 'selected' : '';
                const pieceClass = sq.piece
                  ? ` ${sq.color}${sq.piece} piece`
                  : '';

                if (index === 0) isDarkSq = !isDarkSq;
                isDarkSq = !isDarkSq;
                const sqColor = isDarkSq ? 'dark' : 'light';

                return (
                  <div
                    key={v4()}
                    id={`${idx}${index}`}
                    className={`${sqColor} ${pieceClass} ${selected}`}
                  ></div>
                );
              })}
            </div>
          );
        })}
    </>
  );
};

export default GameBoard;
