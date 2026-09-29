import { Request, Response, NextFunction } from "express";
import { getMyPointsHistory } from "./points.service";

export async function myHistory(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.auth) return res.status(401).json({ error: "Not authenticated" });
    const result = await getMyPointsHistory(req.auth.userId);
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}