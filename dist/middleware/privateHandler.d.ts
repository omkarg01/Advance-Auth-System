import type { NextFunction, Request, Response } from "express";
declare global {
    namespace Express {
        interface Request {
            _id?: Number;
            cookies?: Record<string, any>;
        }
    }
}
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=privateHandler.d.ts.map