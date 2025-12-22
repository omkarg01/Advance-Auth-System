import z, { email } from 'zod';
import { SigninSchema, SignupSchema } from "../types/authSchema.js";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const connectionString = process.env.DATABASE_URL;
if (typeof connectionString !== "string" || connectionString.trim() === "") {
    throw new Error("DATABASE_URL is not set or is not a string. Set DATABASE_URL to a valid Postgres connection string.");
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
export const signupController = async (req, res) => {
    try {
        const parseBody = SignupSchema.parse(req.body);
        const existingUser = await prisma.user.findFirst({ where: { email: parseBody.email } });
        if (existingUser) {
            return res.status(400).send({ "error": "User already exists!" });
        }
        const hashedPassword = await bcrypt.hash(parseBody.password, 10);
        const createdUser = await prisma.user.create({
            data: {
                email: parseBody.email,
                password: hashedPassword,
                name: parseBody.name
            },
            select: {
                email: true,
                name: true
            }
        });
        const key = process.env.JWT_SECRET || '';
        const token = jwt.sign(createdUser, key, {
            expiresIn: '24hr'
        });
        return res.status(201).json({ "message": "User created successfully!", user: { token, ...createdUser } });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.message });
        }
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
export const signinController = async (req, res) => {
    try {
        const parsedBody = SigninSchema.parse(req.body);
        const existingUser = await prisma.user.findFirst({
            where: { email: parsedBody.email }
        });
        if (!existingUser) {
            return res.status(400).json({ "message": "User does not exist!" });
        }
        const result = await bcrypt.compare(parsedBody.password, existingUser.password);
        if (!result) {
            return res.status(400).json({ "message": "Password is incorrect!" });
        }
        const key = process.env.JWT_SECRET || '';
        const token = jwt.sign({ name: existingUser.name, id: existingUser.id, email: existingUser.email }, key, { expiresIn: '24hr' });
        const { password, ...userWithoutPassword } = existingUser;
        return res.status(201).json({ "message": "User LoggedIn successfully!", user: { token, user: { ...userWithoutPassword } } });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.message });
        }
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
//# sourceMappingURL=auth.controller.js.map