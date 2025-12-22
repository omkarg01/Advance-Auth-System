import type { Request, Response } from "express";
export type User = {
    name: string;
    email: string;
    id: Number;
};
export declare const signupController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const signinController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const refreshController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const homeController: (req: Request, res: Response) => Response<any, Record<string, any>>;
//# sourceMappingURL=controller.d.ts.map