import { prisma } from "../../config/prisma";
import { AppError } from "../../middleware/error.middleware";
import { UpdateProfileInput } from "./user.validation";

function toProfile(user: {
  id: string;
  name: string;
  email: string;
  role: string;
  interests: string[];
  latitude: number | null;
  longitude: number | null;
  verifiedStatus: string;
  visibilityPreference: string;
  createdAt: Date;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    interests: user.interests,
    location:
      user.latitude !== null && user.longitude !== null
        ? { latitude: user.latitude, longitude: user.longitude }
        : null,
    verifiedStatus: user.verifiedStatus,
    visibilityPreference: user.visibilityPreference,
    createdAt: user.createdAt,
  };
}

export async function getMyProfile(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return toProfile(user);
}

export async function updateMyProfile(userId: string, input: UpdateProfileInput) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.interests !== undefined && { interests: input.interests }),
      ...(input.latitude !== undefined && { latitude: input.latitude }),
      ...(input.longitude !== undefined && { longitude: input.longitude }),
      ...(input.visibilityPreference !== undefined && {
        visibilityPreference: input.visibilityPreference,
      }),
    },
  });
  return toProfile(user);
}