import axios from 'axios';

const getGameData = () => axios.get('/games/get_game_data');

// still working
const updateGamesPlayed = (gameId) =>
  axios.put(`/games/update_games_played/${gameId}`);

const axiosAPI = {
  getGameData,
  updateGamesPlayed,
};

export default axiosAPI;
