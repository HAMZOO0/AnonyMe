import { z } from "zod";

export const messageSchema = z.object({
   content: z.string().min(2, "Content is required").max(500, "Content must be at most 500 characters long"),
});
