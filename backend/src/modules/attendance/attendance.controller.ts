import { Request, Response, NextFunction } from "express";
import { scanQrSchema } from "./attendance.validation";
import { generateAttendanceQr, verifyAttendanceScan } from "./attendance.service";

export async function generateQr(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.auth) return res.status(401).json({ error: "Not authenticated" });
    const result = await generateAttendanceQr(req.auth.userId, req.params.id);
    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
}

export async function scan(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.auth) return res.status(401).json({ error: "Not authenticated" });
    const input = scanQrSchema.parse(req.body);
    const result = await verifyAttendanceScan(req.auth.userId, req.params.id, input.token);
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}