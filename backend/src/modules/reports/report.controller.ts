import { Request, Response, NextFunction } from "express";
import { createReportSchema } from "./report.validation";
import { fileReport, listMyReports } from "./report.service";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.auth) return res.status(401).json({ error: "Not authenticated" });
    const input = createReportSchema.parse(req.body);
    const report = await fileReport(req.auth.userId, input);
    return res.status(201).json({ report });
  } catch (err) {
    return next(err);
  }
}

export async function listMine(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.auth) return res.status(401).json({ error: "Not authenticated" });
    const reports = await listMyReports(req.auth.userId);
    return res.status(200).json({ reports });
  } catch (err) {
    return next(err);
  }
}