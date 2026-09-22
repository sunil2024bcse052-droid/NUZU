import { Router } from "express";
import { create, listMine } from "./report.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

router.post("/", requireAuth, create);
router.get("/mine", requireAuth, listMine);

export default router;