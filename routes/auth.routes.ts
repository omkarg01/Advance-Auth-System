import express from 'express';
import { signupController, signinController, refreshController, googleAuthController, googleAuthCBController } from '../controller/controller.js';

const router = express.Router();

router.post("/signup", signupController)
router.post("/signin", signinController)
router.get('/refresh', refreshController)
router.get('/google', googleAuthController)
router.get('/google/callback', googleAuthCBController)

export const authRouter = router;