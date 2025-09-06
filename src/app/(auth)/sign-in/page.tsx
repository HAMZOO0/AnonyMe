"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schemas/signInSchema";

export default function Signin() {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const router = useRouter();

   // zod implementation
   const form = useForm<z.infer<typeof signInSchema>>({
      resolver: zodResolver(signInSchema),
      defaultValues: {
         identifier: "",
         password: "",
      },
   });

   const onSubmit = async (data: z.infer<typeof signInSchema>) => {
      setIsSubmitting(true);

      try {
         const result = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
         });

         console.log("Result :: ", result);

         if (result?.error) {
            // Handle different types of authentication errors
            if (result.error === "CredentialsSignin") {
               toast.error("Invalid email or password. Please check your credentials.");
            } else if (result.error === "AccessDenied") {
               toast.error("Access denied. Please contact support.");
            } else {
               toast.error("Login failed. Please try again.");
            }
         } else if (result?.ok && result?.url) {
            // Success - redirect to dashboard
            toast.success("Login successful!");
            router.replace("/dashboard");
         } else {
            // Unexpected result
            toast.error("Something went wrong. Please try again.");
         }
      } catch (error) {
         console.error("Login error:", error);
         toast.error("Network error. Please check your connection and try again.");
      } finally {
         setIsSubmitting(false);
      }
   };
   return (
      <div className="max-w-md mx-auto mt-8 p-6 border rounded-lg shadow-lg">
         <div className="mb-6">
            <h1 className="text-2xl font-bold text-center">Welcome to AnonyMe</h1>
            <p className="text-center text-gray-600">Sign in to start your anonymous adventure</p>
         </div>

         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               {/* Email Field */}
               <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Email OR Username </FormLabel>
                        <FormControl>
                           <Input type="text" placeholder="Enter your email or username " {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               {/* Password Field */}
               <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                           <Input type="password" placeholder="Enter your password" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               {/* Submit Button */}
               <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                     <>
                        <span className="mr-2">🔄</span>
                        Opening Your Account...
                     </>
                  ) : (
                     "Login"
                  )}
               </Button>
            </form>
         </Form>

         {/* Already have account link */}
         <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
               create account?{" "}
               <Link href="/sign-up" className="text-blue-600 hover:underline font-medium">
                  Sign up here
               </Link>
            </p>
         </div>
      </div>
   );
}
