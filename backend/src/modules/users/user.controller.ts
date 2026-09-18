import { Request, Response, NextFunction } from "express";
import { updateProfileSchema } from "./user.validation";
import { getMyProfile, updateMyProfile } from "./user.service";

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.auth) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const profile = await getMyProfile(req.auth.userId);
    return res.status(200).json({ user: profile });
  } catch (err) {
    return next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.auth) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const input = updateProfileSchema.parse(req.body);
    const profile = await updateMyProfile(req.auth.userId, input);
    return res.status(200).json({ user: profile });
  } catch (err) {
    return next(err);
  }
}