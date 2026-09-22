import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface JwtPayload {
  userId: string;
  role: "USER" | "ADMIN";
}

export interface QrPayload {
  type: "qr_attendance";
  activityId: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}

// QR tokens are short-lived (10 minutes) and scoped to one activity.
// The "type" field prevents a login token from ever being accepted here,
// and vice versa.
export function signQrToken(activityId: string): string {
  const payload: QrPayload = { type: "qr_attendance", activityId };
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "10m" });
}

export function verifyQrToken(token: string): QrPayload {
  const decoded = jwt.verify(token, env.jwtSecret) as QrPayload;
  if (decoded.type !== "qr_attendance") {
    throw new Error("Invalid token type");
  }
  return decoded;
}