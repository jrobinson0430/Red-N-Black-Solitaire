import axios from 'axios';

const getGameData = () => axios.get('/games/get_game_data');


const axiosAPI = {
  getGameData,
};

export default axiosAPI;
