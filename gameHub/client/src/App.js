import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import UserContext from './contextProviders/UserContext';
import GameContext from './contextProviders/GameContext';
import AxiosAPI from './apis/axios';
import { v4 } from 'uuid';
import * as Pages from './pages';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './main.css';
import axiosAPI from './apis/axios';

const App = () => {
  const navigate = useNavigate();
  const obj = {}
  console.log(obj?.test)
  const location = useLocation();
  const [showLandingBtn, setShowLandingBtn] = useState(false);
  const [gameData, setGameData] = useState([]);
  const userData = useState(
    JSON.parse(sessionStorage.getItem('loggedInUser')) || {}
  );

  const utilityBox = {
    v4,
    navigate,
    location,
  };

  const getGameData = async () => {
    try {
      const result = await axiosAPI.getGameData();

      const { data, message } = result.data;
      if (data) {
        setGameData(data);

      } else {
        // display error message
      }
    } catch (error) {
      console.error(error.message);
      // display error message
    }
  };

  useEffect(() => {
    getGameData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, utilityBox }}>
      <GameContext.Provider value={{ gameData, setGameData }}>
        <Routes>
          <Route
            path='/'
            element={
              <Pages.Landing
                showLandingBtn={showLandingBtn}
                setShowLandingBtn={setShowLandingBtn}
              />
            }
          />
          <Route
            path='/home'
            element={<Pages.Home />}
          />
          <Route
            path='game/*'
            element={<Pages.Game />}
          />
        </Routes>
      </GameContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
