import { Router } from "express";
import { getReports, patchReportStatus, restrictUser, getUserRestrictions } from "./admin.controller";
import { requireAuth, requireAdmin } from "../../middleware/auth.middleware";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/reports", getReports);
router.patch("/reports/:id", patchReportStatus);
router.post("/restrictions", restrictUser);
router.get("/restrictions/:userId", getUserRestrictions);

export default router;