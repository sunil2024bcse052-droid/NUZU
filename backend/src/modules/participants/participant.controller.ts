import { Request, Response, NextFunction } from "express";
import { joinActivity, leaveActivity, listParticipants } from "./participant.service";

export async function join(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.auth) return res.status(401).json({ error: "Not authenticated" });
    const participant = await joinActivity(req.auth.userId, req.params.id);
    return res.status(201).json({ participant });
  } catch (err) {
    return next(err);
  }
}

export async function leave(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.auth) return res.status(401).json({ error: "Not authenticated" });
    const result = await leaveActivity(req.auth.userId, req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const participants = await listParticipants(req.params.id);
    return res.status(200).json({ participants });
  } catch (err) {
    return next(err);
  }
}