import jwt from 'jsonwebtoken';

const generateToken = (userId, userType) => {
  const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  
  return jwt.sign(
    { userId, userType },
    secret,
    { expiresIn: '7d' }
  );
};

export default generateToken;

