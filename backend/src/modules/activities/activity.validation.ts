import { z } from "zod";

export const createActivitySchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(2000),
  category: z.string().trim().min(2).max(60),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  date: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
    message: "date must be a valid ISO date string",
  }),
  capacity: z.number().int().min(1).max(1000),
  visibility: z.enum(["OPEN_NEARBY", "CIRCLE_ONLY"]).default("OPEN_NEARBY"),
  genderRestriction: z.enum(["NONE", "WOMEN_ONLY", "VERIFIED_ONLY"]).default("NONE"),
  joinMode: z.enum(["INSTANT", "SILENT_INTEREST", "REQUEST_APPROVAL"]).default("INSTANT"),
  isSmallGroup: z.boolean().default(false),
  circleId: z.string().uuid().optional(),
});

export const nearbyQuerySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  radiusKm: z.coerce.number().min(0.1).max(50).default(5),
  category: z.string().trim().optional(),
});

export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type NearbyQuery = z.infer<typeof nearbyQuerySchema>;