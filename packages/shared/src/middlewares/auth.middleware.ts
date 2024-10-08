import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET || 'default';

export const verifyToken = (req:any, res:any, next:any) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token is required for this request' });
  }

  try {
    console.log("jwt secret in verifyToken", jwtSecret);
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;  

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: 'Token expired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    return res.status(401).json({ message: 'Authentication failed' });

    }
};
