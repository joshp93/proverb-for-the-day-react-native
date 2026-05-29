import { z } from "zod";

export const ProverbSchema = z.object({
  ref: z.string(),
  proverb: z.string(),
  citation: z.string().optional(),
});

export type Proverb = z.infer<typeof ProverbSchema>;
