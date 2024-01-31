const User = require('../models/userModel');
const Theme = require('../models/themeModel');

const createThemeDoc = () => {
  const themeDoc = new Theme();
  return themeDoc.save();
};

const create_user = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(200).json({
        message: 'Email Already Exists. Please Try Again.',
      });
    }

    const newThemeDoc = await createThemeDoc();
    const newUser = await User.create({ ...req.body, theme: newThemeDoc._id });
    const filteredUser = newUser.toObject();

    delete filteredUser.password;
    delete filteredUser.__v;

    return res.status(200).json({
      user: filteredUser,
      message: 'Thank you. Your account was successfully created.',
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const login_user = async (req, res) => {
  try {
    const message = 'Incorrect login information. Please try again.';
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email }).select('-__v');

    if (!existingUser) return res.status(200).json({ message });

    // verify login using bcrypt's API
    const isValidPassword = await existingUser.comparePassword(password);
    if (!isValidPassword) {
      return res.status(200).json({ message });
    }
    const filteredUser = existingUser.toObject();
    delete filteredUser.password;

    return res.status(200).json({
      message: 'Thank you. Login successful',
      user: filteredUser,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = {
  create_user,
  login_user,
};
