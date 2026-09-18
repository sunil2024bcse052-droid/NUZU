import { Router } from "express";
import { getProfile, updateProfile } from "./user.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

router.get("/me", requireAuth, getProfile);
router.patch("/me", requireAuth, updateProfile);

export default router;