const authService = require('../services/authServices.services'); // Apne path ke hisaab se update karein

const refreshToken = async (req, res) => {
  try {
    // Agar aap frontend se body mein bhej rahe hain
    const { refreshToken } = req.body; 
    
    const result = await authService.refreshAccessToken(refreshToken);
    
    res.status(200).json({
      success: true,
      accessToken: result.accessToken
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body; 
    
    const result = await authService.logoutUser(refreshToken);
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  refreshToken,
  logout
};