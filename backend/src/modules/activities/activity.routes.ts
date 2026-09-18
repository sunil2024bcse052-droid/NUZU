import { Router } from "express";
import { create, getOne, nearby, list } from "./activity.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

router.post("/", requireAuth, create);
router.get("/nearby", requireAuth, nearby);
router.get("/", requireAuth, list);
router.get("/:id", requireAuth, getOne);

export default router;