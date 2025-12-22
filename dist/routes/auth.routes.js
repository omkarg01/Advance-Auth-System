import express from 'express';
import { signupController, signinController, refreshController } from '../controller/controller.js';
const router = express.Router();
router.post("/signup", signupController);
router.post("/signin", signinController);
router.get('/refresh', refreshController);
export const authRouter = router;
//# sourceMappingURL=auth.routes.js.map