const pool = require("../../db/conn");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const secretKey = process.env.pg_encrypt_key;

const registerUser = async (data) => {
  const { userName, password, email, f_name, l_name, birthDate } = data;

  if (!userName || !password || !email || !f_name || !l_name || !birthDate) {
    throw new Error("All details are mandatory!");
  }

  try {
    const existingUserQuery = `
            SELECT userName 
            FROM socializer.users 
            WHERE userName = $1 OR pgp_sym_decrypt(email, $2) = $3
        `;
    const existingUserCheck = await pool.query(existingUserQuery, [
      userName,
      secretKey,
      email,
    ]);

    if (existingUserCheck.rows.length > 0) {
      throw new Error("Username or Email already exists!");
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const insertQuery = `
            INSERT INTO socializer.users (userName, passwordHash, email, f_name, l_name, birthDate) 
            VALUES ($1, $2, pgp_sym_encrypt($3, $4), pgp_sym_encrypt($5, $4), pgp_sym_encrypt($6, $4), pgp_sym_encrypt($7, $4)) 
            RETURNING id, userName;
        `;

    const { rows } = await pool.query(insertQuery, [
      userName,
      hashPassword,
      email,
      secretKey,
      f_name,
      l_name,
      birthDate,
    ]);

    return rows[0];
  } catch (err) {
    if (err.message.includes("exists") || err.message.includes("mandatory")) {
      throw err;
    }
    console.error("Database Error:", err.message);
    throw new Error("Internal Server Error!");
  }
};

const loginUser = async (data) => {
  const { email, userName, password } = data;

  if (!email && !userName) {
    throw new Error("Please provide email or username to login!");
  }
  if (!password) {
    throw new Error("Password Missing");
  }

  try {
    const checkUserQuery = `
        SELECT id, username, passwordhash
        FROM socializer.users 
        WHERE username = $1 OR pgp_sym_decrypt(email, $2) = $3
    `;

    const existingUserCheck = await pool.query(checkUserQuery, [
      userName || null, 
      secretKey,        
      email || null,    
    ]);

    if (existingUserCheck.rows.length === 0) {
      throw new Error("User with these credentials does not exist. Try Signup instead!");
    }

    const user = existingUserCheck.rows[0];

    const passwordCompare = await bcrypt.compare(password, user.passwordhash);
    if (!passwordCompare) {
      throw new Error("Invalid Credentials. Try again!");
    }

    const updateUserActiveQuery = `
        UPDATE socializer.users 
        SET lastactive = now()
        WHERE id = $1
    `;
    await pool.query(updateUserActiveQuery, [user.id]);

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username 
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );


    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET, // Alag secret key use karein .env mein
      { expiresIn: '7d' }
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); 

    const insertTokenQuery = `
        INSERT INTO socializer.refresh_tokens (user_id, token, expires_at)
        VALUES ($1, $2, $3)
    `;
    await pool.query(insertTokenQuery, [user.id, refreshToken, expiresAt]);

    return {
        accessToken: token,
        refreshToken
    };

  } catch (err) {
    if (err.message.includes('exist') || err.message.includes('Missing') || err.message.includes('Credentials')) {
      throw err;
    }
    console.error("Database Error:", err.message);
    throw new Error("Internal Server Error!");
  }
};

module.exports = { registerUser, loginUser } ;
