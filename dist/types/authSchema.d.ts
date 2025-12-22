import z from 'zod';
export declare const SignupSchema: z.ZodObject<{
    email: z.ZodString;
    name: z.ZodString;
    password: z.ZodString;
}, z.z.core.$strip>;
export declare const SigninSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.z.core.$strip>;
//# sourceMappingURL=authSchema.d.ts.map