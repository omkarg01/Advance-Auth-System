import crypto from 'crypto';

export const getRefreshToken = () => {
    const size = 16;
    return crypto.randomBytes(size).toString('hex')
} 
