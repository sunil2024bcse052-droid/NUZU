import QRCode from "qrcode";
import { prisma } from "../../config/prisma";
import { AppError } from "../../middleware/error.middleware";
import { signQrToken, verifyQrToken } from "../../utils/jwt";

const POINTS_PER_VERIFIED_ATTENDANCE = 10;

export async function generateAttendanceQr(requesterId: string, activityId: string) {
  const activity = await prisma.activity.findUnique({ where: { id: activityId } });
  if (!activity) {
    throw new AppError("Activity not found", 404);
  }
  if (activity.creatorId !== requesterId) {
    throw new AppError("Only the activity creator can generate the attendance QR code", 403);
  }

  const token = signQrToken(activityId);
  const qrImageDataUrl = await QRCode.toDataURL(token);

  return { token, qrImageDataUrl, expiresInMinutes: 10 };
}

export async function verifyAttendanceScan(userId: string, activityId: string, token: string) {
  let decoded;
  try {
    decoded = verifyQrToken(token);
  } catch {
    throw new AppError("QR code is invalid or has expired", 401);
  }

  if (decoded.activityId !== activityId) {
    throw new AppError("This QR code does not belong to this activity", 400);
  }

  const participant = await prisma.participant.findUnique({
    where: { userId_activityId: { userId, activityId } },
  });
  if (!participant) {
    throw new AppError("You must join this activity before checking in", 403);
  }

  const existingAttendance = await prisma.attendance.findUnique({
    where: { userId_activityId: { userId, activityId } },
  });
  if (existingAttendance) {
    throw new AppError("Attendance already recorded for this activity", 409);
  }

  const attendance = await prisma.attendance.create({
    data: { userId, activityId, verified: true },
  });

  const points = await prisma.points.create({
    data: {
      userId,
      activityId,
      points: POINTS_PER_VERIFIED_ATTENDANCE,
      reason: "Verified attendance via QR check-in",
    },
  });

  return { attendance, pointsAwarded: points.points };
}