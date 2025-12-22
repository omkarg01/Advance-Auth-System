import { Router } from "express";
import { authMiddleware } from "../middleware/privateHandler.js";
import { homeController } from "../controller/controller.js";
const router = Router();
router.get('/', authMiddleware, homeController);
export const homeRouter = router;
//# sourceMappingURL=home.routes.js.map