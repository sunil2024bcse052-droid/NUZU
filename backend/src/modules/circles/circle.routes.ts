import { Router } from "express";
import { create, list, getOne, join, members, approve } from "./circle.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

router.post("/", requireAuth, create);
router.get("/", requireAuth, list);
router.get("/:id", requireAuth, getOne);
router.post("/:id/join", requireAuth, join);
router.get("/:id/members", requireAuth, members);
router.patch("/:id/members/:userId", requireAuth, approve);

export default router;