const jwt = require('jsonwebtoken');
const pool = require('../../db/conn');

const refreshAccessToken = async (token) => {
  if (!token) {
    throw new Error("Refresh token is required!");
  }

  try {
    // A. Check karein ki DB mein token hai aur revoked toh nahi hai
    const checkTokenQuery = `
      SELECT * FROM socializer.refresh_tokens 
      WHERE token = $1 AND is_revoked = false AND expires_at > now()
    `;
    const tokenRecord = await pool.query(checkTokenQuery, [token]);

    if (tokenRecord.rows.length === 0) {
      throw new Error("Invalid or expired refresh token. Please login again.");
    }

    const userId = tokenRecord.rows[0].user_id;

    // B. Token ko verify karein ki valid (tamper-proof) hai ya nahi
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // C. User ki details nikal lein naye Access Token ke liye
    const userQuery = `SELECT username FROM socializer.users WHERE id = $1`;
    const userRecord = await pool.query(userQuery, [userId]);
    
    if (userRecord.rows.length === 0) {
      throw new Error("User no longer exists.");
    }

    // D. Naya Access Token banayein
    const newAccessToken = jwt.sign(
      { id: userId, username: userRecord.rows[0].username },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return { accessToken: newAccessToken };

  } catch (err) {
    console.error("Refresh Token Error:", err.message);
    throw new Error("Invalid or expired refresh token.");
  }
};

// 2. Service: Logout (Token Revoke karna)
const logoutUser = async (token) => {
  if (!token) return true; // Agar token hi nahi hai, toh already logged out maan lo

  try {
    // Token ko database mein 'revoked' mark kar do ya delete kar do
    const revokeTokenQuery = `
      UPDATE socializer.refresh_tokens 
      SET is_revoked = true 
      WHERE token = $1
    `;
    await pool.query(revokeTokenQuery, [token]);
    return { success: true, message: "Logged out successfully" };
  } catch (err) {
    console.error("Logout Error:", err.message);
    throw new Error("Internal Server Error during logout.");
  }
};

module.exports = {
  refreshAccessToken,
  logoutUser
};