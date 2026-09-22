import { Router } from "express";
import { generateQr, scan } from "./attendance.controller";
import { requireAuth } from "../../middleware/auth.middleware";

// Mounted at /api/activities/:id in app.ts
const router = Router({ mergeParams: true });

router.post("/qr", requireAuth, generateQr);
router.post("/scan", requireAuth, scan);

export default router;