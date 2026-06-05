const { registerUser, loginUser } = require("../services/users.services");

const register = async (req, res) => {
  try {
    const newUser = await registerUser(req.body);

    return res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const loginResult = await loginUser(req.body);

    return res.status(200).json({
      success: true,
      accessToken: loginResult.accessToken,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { register, login };
