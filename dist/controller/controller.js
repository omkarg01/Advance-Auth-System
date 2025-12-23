import z, { email, gt } from 'zod';
import { SigninSchema, SignupSchema } from "../types/authSchema.js";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getRefreshToken } from "../utils/index.js";
import crypto from 'crypto';
import { OAuth2Client } from "google-auth-library";
const connectionString = process.env.DATABASE_URL;
if (typeof connectionString !== "string" || connectionString.trim() === "") {
    throw new Error("DATABASE_URL is not set or is not a string. Set DATABASE_URL to a valid Postgres connection string.");
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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
                name: true,
                id: true
            }
        });
        const key = process.env.JWT_SECRET || '';
        const token = jwt.sign({ name: createdUser.name, id: createdUser.id, email: createdUser.email }, key, {
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
        const token = jwt.sign({ userId: existingUser.id }, key, { expiresIn: '30s' });
        res.cookie("access_token", token);
        const { password, ...userWithoutPassword } = existingUser;
        const refreshToken = getRefreshToken();
        const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        await prisma.session.create({
            data: {
                userId: existingUser.id,
                refreshTokenHash: hash,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax'
        });
        return res.status(201).json({ "message": "User LoggedIn successfully!", user: { ...userWithoutPassword } });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.message });
        }
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
export const refreshController = async (req, res) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        const hash = crypto.createHash('sha256').update(refresh_token).digest('hex');
        const session = await prisma.session.findFirst({
            where: {
                refreshTokenHash: hash,
                expiresAt: { gt: new Date() }
            }
        });
        if (!session) {
            return res.status(401);
        }
        const key = process.env.JWT_SECRET;
        const accessToken = jwt.sign({ userId: session.userId }, key, { expiresIn: '30s' });
        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax"
        });
        res.sendStatus(200);
    }
    catch (error) {
        return res.status(400).json({ error: error });
    }
};
export const googleAuthController = (req, res) => {
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: "http://localhost:3000/auth/google/callback",
        response_type: "code",
        scope: "openid email profile"
    });
    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
};
export const googleAuthCBController = async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(401).json({ error: "Missing Code" });
    }
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: 'POST', body: JSON.stringify({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: "http://localhost:3000/auth/google/callback",
            grant_type: "authorization_code"
        })
    }).then((data) => data.json());
    const { id_token, access_token } = tokenResponse;
    const ticket = await client.verifyIdToken({ idToken: id_token, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload) {
        throw new Error("Invalid Google ID token");
    }
    console.log("Payload", payload);
    if (!payload.email || !payload.name) {
        throw new Error("Google token missing email/name");
    }
    // create user if not exist
    let user = await prisma.user.findFirst({ where: { email: payload.email } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                name: payload.name,
                email: payload.email,
                provider: "google",
                providerId: payload.sub,
            }
        });
    }
    const key = process.env.JWT_SECRET;
    const accessToken = jwt.sign({ userId: user.id }, key, { expiresIn: '30s' });
    res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax"
    });
    return res.status(201).json({ "message": "User Google LoggedIn successfully!", user });
};
export const homeController = (req, res) => {
    try {
        return res.status(200).json({ "message": "Welcome back! Your id is : " + req._id });
    }
    catch (error) {
        return res.status(400).json({ error: error });
    }
};
//# sourceMappingURL=controller.js.map