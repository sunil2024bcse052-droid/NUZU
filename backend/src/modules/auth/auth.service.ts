import { prisma } from "../../config/prisma";
import { hashPassword, comparePassword } from "../../utils/password";
import { signToken } from "../../utils/jwt";
import { calculateAge, MINIMUM_AGE } from "../../utils/age";
import { AppError } from "../../middleware/error.middleware";
import { RegisterInput, LoginInput } from "./auth.validation";

function toPublicUser(user: {
  id: string;
  name: string;
  email: string;
  role: string;
  verifiedStatus: string;
  createdAt: Date;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    verifiedStatus: user.verifiedStatus,
    createdAt: user.createdAt,
  };
}

export async function registerUser(input: RegisterInput) {
  const birthDate = new Date(input.birthDate);
  const age = calculateAge(birthDate);

  if (age < MINIMUM_AGE) {
    throw new AppError(`You must be at least ${MINIMUM_AGE} years old to join Nuzu`, 403);
  }

  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AppError("An account with this email already exists", 409);
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      birthDate,
    },
  });

  const token = signToken({ userId: user.id, role: user.role });
  return { user: toPublicUser(user), token };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signToken({ userId: user.id, role: user.role });
  return { user: toPublicUser(user), token };
}

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return toPublicUser(user);
}