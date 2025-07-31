import { PassThrough } from "stream";
import { z } from "zod";

export const signIn = z.object({
   email: z.string(),
   password: z.string().min(6, "Password must be at least 6 characters long"),
});
