import { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema } from "./auth.validation";
import { registerUser, loginUser, getUserProfile } from "./auth.service";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const input = registerSchema.parse(req.body);
    const result = await registerUser(input);
    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const input = loginSchema.parse(req.body);
    const result = await loginUser(input);
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.auth) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const user = await getUserProfile(req.auth.userId);
    return res.status(200).json({ user });
  } catch (err) {
    return next(err);
  }
}