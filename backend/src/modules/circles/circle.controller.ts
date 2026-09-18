import { Request, Response, NextFunction } from "express";
import { createCircleSchema, listCirclesQuerySchema } from "./circle.validation";
import {
  createCircle,
  listCircles,
  getCircleById,
  joinCircle,
  listMembers,
  approveMembership,
} from "./circle.service";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.auth) return res.status(401).json({ error: "Not authenticated" });
    const input = createCircleSchema.parse(req.body);
    const circle = await createCircle(req.auth.userId, input);
    return res.status(201).json({ circle });
  } catch (err) {
    return next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const query = listCirclesQuerySchema.parse(req.query);
    const circles = await listCircles(query);
    return res.status(200).json({ circles });
  } catch (err) {
    return next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const circle = await getCircleById(req.params.id);
    return res.status(200).json({ circle });
  } catch (err) {
    return next(err);
  }
}

export async function join(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.auth) return res.status(401).json({ error: "Not authenticated" });
    const membership = await joinCircle(req.auth.userId, req.params.id);
    return res.status(201).json({ membership });
  } catch (err) {
    return next(err);
  }
}

export async function members(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.auth) return res.status(401).json({ error: "Not authenticated" });
    const list = await listMembers(req.auth.userId, req.params.id);
    return res.status(200).json({ members: list });
  } catch (err) {
    return next(err);
  }
}

export async function approve(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.auth) return res.status(401).json({ error: "Not authenticated" });
    const membership = await approveMembership(req.auth.userId, req.params.id, req.params.userId);
    return res.status(200).json({ membership });
  } catch (err) {
    return next(err);
  }
}