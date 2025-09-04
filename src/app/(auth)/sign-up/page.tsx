"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useDebounceValue } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signupSchema } from "@/schemas/signupSchema";
import axios from "axios";
import { ApiResponse } from "@/app/lib/types/apiResponse";
import { AxiosError } from "axios";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function Sigup() {
   const [usernameMessage, setUsernameMessage] = useState("");
   const [isCheckingUsername, setIsCheckingUsername] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const router = useRouter();

   // zod implementation
   const form = useForm<z.infer<typeof signupSchema>>({
      resolver: zodResolver(signupSchema),
      defaultValues: {
         userName: "",
         email: "",
         password: "",
      },
   });

   // Watch the username field and debounce it
   const watchedUsername = form.watch("userName");
   const [debouncedUsername] = useDebounceValue(watchedUsername, 500);

   useEffect(() => {
      // Check if the username is unique
      const checkUsernameUniqueness = async () => {
         if (debouncedUsername) {
            setIsCheckingUsername(true);
            setUsernameMessage("");
            try {
               const res = await axios.get<ApiResponse>(`/api/check-username-unique?userName=${debouncedUsername}`);
               setUsernameMessage(res.data.message);
            } catch (error) {
               const axiosError = error as AxiosError<ApiResponse>;
               setUsernameMessage(axiosError.response?.data.message || "Error checking username");
               console.error("Error checking username uniqueness:", error);
               toast.error("Error checking username. Please try again.");
            } finally {
               setIsCheckingUsername(false);
            }
         }
      };
      checkUsernameUniqueness();
   }, [debouncedUsername]);

   const onSubmit = async (data: z.infer<typeof signupSchema>) => {
      try {
         console.log(data);
         setIsSubmitting(true);
         const res = await axios.post<ApiResponse>("/api/sign-up", data);
         toast.success(res.data.message);
         // Use form data instead of local state
         router.replace(`/verify/${data.userName}`);
      } catch (error) {
         const axiosError = error as AxiosError<ApiResponse>;
         toast.error(axiosError.response?.data.message || "Something went wrong. Please try again.");
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="max-w-md mx-auto mt-8 p-6 border rounded-lg shadow-lg">
         <div className="mb-6">
            <h1 className="text-2xl font-bold text-center">Join AnonyMe</h1>
            <p className="text-center text-gray-600">Sign up to start your anonymous adventure</p>
         </div>

         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               {/* Username Field */}
               <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                           <Input placeholder="Enter username" {...field} />
                        </FormControl>
                        {isCheckingUsername && (
                           <FormDescription className="text-blue-600">
                              Checking username availability...
                           </FormDescription>
                        )}
                        {usernameMessage && (
                           <FormDescription
                              className={
                                 usernameMessage.toLowerCase().includes("available") ||
                                 usernameMessage.toLowerCase().includes("unique")
                                    ? "text-green-600"
                                    : "text-red-600"
                              }
                           >
                              {usernameMessage}
                           </FormDescription>
                        )}
                        <FormMessage />
                     </FormItem>
                  )}
               />

               {/* Email Field */}
               <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                           <Input type="email" placeholder="Enter your email" {...field} />
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
                        Creating Account...
                     </>
                  ) : (
                     "Create Account"
                  )}
               </Button>
            </form>
         </Form>

         {/* Already have account link */}
         <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
               Already have an account?{" "}
               <Link href="/sign-in" className="text-blue-600 hover:underline font-medium">
                  Sign in here
               </Link>
            </p>
         </div>
      </div>
   );
}
