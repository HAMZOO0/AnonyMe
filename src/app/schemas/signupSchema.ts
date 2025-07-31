import { z } from "zod";

// single vlaue
export const usernameValidation = z
   .string()
   .min(3, "Username must be at least 3 characters long")
   .max(20, "Username must be at most 20 characters long")
   .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");

// single value
export const emailValidation = z
   .string()
   .email("Invalid email address")
   .max(100, "Email must be at most 100 characters long");

// mutiple values
export const signupSchema = z.object({
   username: usernameValidation,
   email: emailValidation,
   password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(50, "Password must be at most 50 characters long"),
});
