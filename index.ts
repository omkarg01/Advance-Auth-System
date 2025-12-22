import "dotenv/config";
import express from 'express';
import {authRouter} from './routes/auth.routes.js';
import { homeRouter } from "./routes/home.routes.js";
import cookieParser from 'cookie-parser';

const connectionString = process.env.DATABASE_URL
if (typeof connectionString !== "string" || connectionString.trim() === "") {
  throw new Error("DATABASE_URL is not set or is not a string. Set DATABASE_URL to a valid Postgres connection string.")
}

const app = express();

app.use(cookieParser())
app.use(express.json())

app.use("/auth", authRouter)
app.use("/home", homeRouter)


const PORT = 3000
app.listen(PORT, () => {
    console.log("Server listening to port :", PORT)
})