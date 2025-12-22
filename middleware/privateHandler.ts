import type { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import type { User } from "../controller/controller.js";

declare global {
    namespace Express {
        interface Request {
            _id?: Number;
            cookies?: Record<string, any>;
        }
    }
}


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const key = process.env.JWT_SECRET || '';

        // const token = req.headers.authorization?.split(' ')[1];
        const token = req.cookies.access_token;

        if (!token) {
            return res.status(400).json({ "message": "Invalid Token!" })
        }

        const payload = jwt.verify(token, key) as { userId: Number };
        if (!payload) {
            return res.status(403).json({ 'message': "Not authorized!" })
        }

        req._id = payload.userId;
        next()
        // return res.status(200).json({ payload })

    } catch (error) {
        return res.status(400).json({ error })
    }
}