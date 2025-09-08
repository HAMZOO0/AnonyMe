"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { ApiResponse } from "@/app/lib/types/apiResponse";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifySchema } from "@/schemas/verifySchema";
import z from "zod";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function Verfiy() {
   const router = useRouter();

   const param = useParams<{ userName: string }>();

   // zod implementation
   const form = useForm<z.infer<typeof verifySchema>>({
      resolver: zodResolver(verifySchema),
   });

   const onSubmit = async (data: z.infer<typeof verifySchema>) => {
      try {
         const res = await axios.post<ApiResponse>(`/api/verify-otp`, {
            userName: param.userName,
            otp: data.otp,
         });
         toast.success(res.data.message);
         router.replace(`/sign-in`);
      } catch (error) {
         const axiosError = error as AxiosError<ApiResponse>;
         toast.error(axiosError.response?.data.message || "Something went wrong. Please try again.");
      }
   };

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-md mx-auto mt-16 space-y-8 p-6 sm:p-8 bg-white rounded-2xl shadow-lg"
         >
            {/* Heading */}
            <div className="mb-6">
            <h1 className="text-2xl font-bold text-center">Verify Your Account for AnonyMe</h1>
            <p className="text-center text-gray-600">Enter the 6-digit code sent to your email</p>
         </div>
            {/* OTP Input */}
            <FormField
               control={form.control}
               name="otp"
               render={({ field }) => (
                  <FormItem className="text-center">
                     <FormLabel className="block mb-2 font-medium text-gray-700">One-Time Password</FormLabel>
                     <FormControl>
                        <InputOTP maxLength={6} {...field} className="flex justify-center gap-3">
                           <InputOTPGroup className="flex gap-2">
                              <InputOTPSlot index={0} className="w-12 h-12 text-xl" />
                              <InputOTPSlot index={1} className="w-12 h-12 text-xl" />
                              <InputOTPSlot index={2} className="w-12 h-12 text-xl" />
                              <InputOTPSlot index={3} className="w-12 h-12 text-xl" />
                              <InputOTPSlot index={4} className="w-12 h-12 text-xl" />
                              <InputOTPSlot index={5} className="w-12 h-12 text-xl" />
                           </InputOTPGroup>
                        </InputOTP>
                     </FormControl>
                     <FormMessage className="text-red-500 mt-2" />
                  </FormItem>
               )}
            />
            {/* Submit Button */}
            <Button
               type="submit"
               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white  p-3 rounded-sm shadow-md transition-all duration-200"
            >
               Verify OTP
            </Button>
         </form>
      </Form>
   );
}
