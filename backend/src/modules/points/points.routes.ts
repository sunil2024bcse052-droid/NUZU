import { Router } from "express";
import { myHistory } from "./points.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();
router.get("/mine", requireAuth, myHistory);

export default router;