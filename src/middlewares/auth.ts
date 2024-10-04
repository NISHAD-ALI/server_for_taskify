import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string

interface AuthenticatedRequest extends Request {
  userId?: string|any;
  role?: string|any;
}
interface DecodedToken extends JwtPayload {
  id: string;
  role: string;
}

export const verifyToken = (req: AuthenticatedRequest, res: any, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
        console.log(err.message)
      return res.status(403).json({ success: false, message: 'Failed to authenticate token. Please Login Again' });
    }
    const decodedToken = decoded as DecodedToken

    req.userId = decodedToken.id
    req.role = decodedToken.role

    next()
  });
};
