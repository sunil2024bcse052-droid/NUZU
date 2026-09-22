import { Request, Response, NextFunction } from "express";
import { updateReportStatusSchema, applyRestrictionSchema } from "./admin.validation";
import {
  listReportsForReview,
  updateReportStatus,
  applyRestriction,
  listUserRestrictions,
} from "./admin.service";

export async function getReports(req: Request, res: Response, next: NextFunction) {
  try {
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const reports = await listReportsForReview(status);
    return res.status(200).json({ reports });
  } catch (err) {
    return next(err);
  }
}

export async function patchReportStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const input = updateReportStatusSchema.parse(req.body);
    const report = await updateReportStatus(req.params.id, input.status);
    return res.status(200).json({ report });
  } catch (err) {
    return next(err);
  }
}

export async function restrictUser(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.auth) return res.status(401).json({ error: "Not authenticated" });
    const input = applyRestrictionSchema.parse(req.body);
    const restriction = await applyRestriction(
      req.auth.userId,
      input.userId,
      input.restrictionType,
      input.reason
    );
    return res.status(201).json({ restriction });
  } catch (err) {
    return next(err);
  }
}

export async function getUserRestrictions(req: Request, res: Response, next: NextFunction) {
  try {
    const restrictions = await listUserRestrictions(req.params.userId);
    return res.status(200).json({ restrictions });
  } catch (err) {
    return next(err);
  }
}