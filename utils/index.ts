import crypto from 'crypto';
import jwt from 'jsonwebtoken'

export const getRefreshToken = () => {
    const size = 16;
    return crypto.randomBytes(size).toString('hex')
} 

export const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const generateAccessToken = (userId: string) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );
};