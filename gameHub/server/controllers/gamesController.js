const Game = require('../models/gameModel');

const get_game_data = async (req, res) => {
  try {
    const gameData = await Game.find();
    console.log('gameData', gameData)
    return gameData
      ? res.status(200).json({ data: gameData })
      : res.status(200).json({ message: 'No Games Found.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const update_games_played = async (req, res) => { // not being used yet
  // done
  try {
    const { _id } = req.params;

    const updatedGame = await Game.findByIdAndUpdate(
      { _id },
      { $inc: { gamesPlayed: 1 } },
      { new: true }
    );

    res.status(200).json({ data: updatedGame });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  get_game_data,
  update_games_played,
};
