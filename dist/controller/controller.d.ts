import type { Request, Response } from "express";
export type User = {
    name?: string | null;
    email: string;
    id: Number;
    provider?: String | null;
    providerId?: String | null;
};
export declare const signupController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const signinController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const refreshController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const googleAuthController: (req: Request, res: Response) => void;
export declare const googleAuthCBController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const homeController: (req: Request, res: Response) => Response<any, Record<string, any>>;
//# sourceMappingURL=controller.d.ts.map