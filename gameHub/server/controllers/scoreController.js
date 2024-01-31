const mongoose = require('mongoose');
const User = require('../models/userModel');
const { Score } = require('../models/scoreModel');
const { ObjectId } = mongoose.Types;

const get_user_scores = async (req, res) => {
  const { userId, gameName } = req.params;
  const userScores = await User.findOne(
    { _id: userId },
    { highScores: 1, _id: 0 }
  );
  const { highScores } = userScores;

  const formattedScores = highScores
    .filter((obj) => obj.gameName === gameName)
    .sort((a, b) => a.moves - b.moves)
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

  res.status(200).json({ usersGameScores: formattedScores });
};

const get_all_scores = async (req, res) => {
  const { gameName } = req.params;

  const globalScores = await Score.find({ gameName })
    .sort({ points: -1, moves: 1 })
    .limit(10);

  res.status(200).json({ allGameScores: globalScores });
};

const set_score = async (req, res) => {
  try {
    const { payload } = req.body;
    const scoreDoc = await Score.create(payload);

    // adds the new score to the users highScores property
    await User.findOneAndUpdate(
      { _id: ObjectId(req.body.id) },
      { $push: { highScores: scoreDoc } }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const delete_user_score = async (req, res) => {
  try {
    const { _id, email } = req.params;
    await Score.deleteMany({ email });
    await User.findOneAndUpdate(
      { _id },
      { $set: { highScores: [] } },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: 'Scores Successfully Reset.',
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = {
  get_user_scores,
  get_all_scores,
  delete_user_score,
  set_score,
};
