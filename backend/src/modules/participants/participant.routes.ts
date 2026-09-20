import { Router } from "express";
import { join, leave, list } from "./participant.controller";
import { requireAuth } from "../../middleware/auth.middleware";

// This router is mounted at /api/activities/:id in app.ts,
// so paths here are relative to a specific activity.
const router = Router({ mergeParams: true });

router.post("/join", requireAuth, join);
router.delete("/leave", requireAuth, leave);
router.get("/participants", list);

export default router;