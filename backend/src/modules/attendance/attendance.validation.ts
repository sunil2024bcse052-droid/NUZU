import { z } from "zod";

export const scanQrSchema = z.object({
  token: z.string().min(10),
});

export type ScanQrInput = z.infer<typeof scanQrSchema>;