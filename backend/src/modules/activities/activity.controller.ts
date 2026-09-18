import { Request, Response, NextFunction } from "express";
import { createActivitySchema, nearbyQuerySchema } from "./activity.validation";
import {
  createActivity,
  getActivityById,
  findNearbyActivities,
  listActivities,
} from "./activity.service";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.auth) return res.status(401).json({ error: "Not authenticated" });
    const input = createActivitySchema.parse(req.body);
    const activity = await createActivity(req.auth.userId, input);
    return res.status(201).json({ activity });
  } catch (err) {
    return next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const activity = await getActivityById(req.params.id);
    return res.status(200).json({ activity });
  } catch (err) {
    return next(err);
  }
}

export async function nearby(req: Request, res: Response, next: NextFunction) {
  try {
    const query = nearbyQuerySchema.parse(req.query);
    const activities = await findNearbyActivities(query);
    return res.status(200).json({ activities });
  } catch (err) {
    return next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { category, circleId } = req.query;
    const activities = await listActivities({
      category: typeof category === "string" ? category : undefined,
      circleId: typeof circleId === "string" ? circleId : undefined,
    });
    return res.status(200).json({ activities });
  } catch (err) {
    return next(err);
  }
}