const mongoose = require('mongoose');
const Theme = require('../models/themeModel');
const { ObjectId } = mongoose.Types;

const get_theme = async (req, res) => {
  try {
    const { _id } = req.params;
    const themeDoc = await Theme.findOne({ _id: ObjectId(_id) }).select(
      '-_id -__v'
    );

    res.status(200).json({
      success: true,
      userTheme: themeDoc,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const update_theme = async (req, res) => {
  try {
    const { payload, themeId } = req.body;
    const themeDoc = await Theme.findOneAndUpdate(
      { _id: ObjectId(themeId) },
      { ...payload },
      { new: true }
    );
    res.status(200).json({
      updatedTheme: themeDoc,
      message: 'Preferences Successfully Updated.',
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = {
  update_theme,
  get_theme,
};
