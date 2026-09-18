import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  interests: z.array(z.string().trim().min(1)).max(20).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  visibilityPreference: z.enum(["PUBLIC", "CONNECTIONS_ONLY"]).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;