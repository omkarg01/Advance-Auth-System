import jwt from 'jsonwebtoken';
export const authMiddleware = (req, res, next) => {
    try {
        const key = process.env.JWT_SECRET || '';
        // const token = req.headers.authorization?.split(' ')[1];
        const token = req.cookies.access_token;
        if (!token) {
            return res.status(400).json({ "message": "Invalid Token!" });
        }
        const payload = jwt.verify(token, key);
        if (!payload) {
            return res.status(403).json({ 'message': "Not authorized!" });
        }
        req._id = payload.userId;
        next();
        // return res.status(200).json({ payload })
    }
    catch (error) {
        return res.status(400).json({ error });
    }
};
//# sourceMappingURL=privateHandler.js.map