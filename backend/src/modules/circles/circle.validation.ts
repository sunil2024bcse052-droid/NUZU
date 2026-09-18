import { z } from "zod";

export const createCircleSchema = z.object({
  name: z.string().trim().min(2).max(120),
  type: z.enum(["SOCIETY", "COLLEGE", "UNIVERSITY", "WORKPLACE"]),
  address: z.string().trim().max(200).optional(),
  pincode: z.string().trim().max(12).optional(),
});

export const listCirclesQuerySchema = z.object({
  type: z.enum(["SOCIETY", "COLLEGE", "UNIVERSITY", "WORKPLACE"]).optional(),
  search: z.string().trim().max(120).optional(),
});

export type CreateCircleInput = z.infer<typeof createCircleSchema>;
export type ListCirclesQuery = z.infer<typeof listCirclesQuerySchema>;