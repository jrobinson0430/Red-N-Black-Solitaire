import { Routes, Route } from 'react-router-dom';
import { Navigation } from '../../components';
import Games from '../../games';

const Game = () => {
  return (
    <>
      {/* <Navigation /> */}
      <Routes>
        <Route
          path='/minesweeper'
          element={<Games.BoardGames.Minesweeper />}
        />
        <Route
          path='/sudoku'
          element={<Games.BoardGames.Sudoku />}
        />
        <Route
          path='/chess'
          element={<Games.BoardGames.Chess />}
        />
        <Route
          path='/redNBlack'
          element={<Games.CardGames.RedNBlack />}
        />
        <Route
          path='/klondike'
          element={<Games.CardGames.Klondike />}
        />
        <Route
          path='/calculation'
          element={<Games.CardGames.Calculation />}
        />
        <Route
          path='/golf'
          element={<Games.CardGames.Golf />}
        />
        <Route
          path='/demon'
          element={<Games.CardGames.Demon />}
        />
        <Route
          path='/accordion'
          element={<Games.CardGames.Accordion />}
        />
        <Route
          path='/freeCell'
          element={<Games.CardGames.FreeCell />}
        />
      </Routes>
    </>
  );
};

export default Game;
