import jwt from 'jsonwebtoken';

// role is embedded in the token so middleware can route to correct model
const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '15m', // Short-lived access token
  });

const generateRefreshToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d', // Long-lived refresh token
  });

export { generateRefreshToken };
export default generateToken;
