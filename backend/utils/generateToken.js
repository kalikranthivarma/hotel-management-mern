import jwt from 'jsonwebtoken';

// role is embedded in the token so middleware can route to correct model
const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

export default generateToken;
