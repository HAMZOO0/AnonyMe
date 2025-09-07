"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, User, Send, Shield, Mail } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/app/lib/types/apiResponse";
import { Textarea } from "@/components/ui/textarea";

export default function UserProfilePage() {
   const params = useParams();
   const [message, setMessage] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);

   const username = params.username as string; // type cast for safety

   // check if user accepts messages
   const isAcceptingMessage = async () => {
      try {
         const res = await axios.post<ApiResponse>("/api/accept-message/check", {
            username,
         });
         if (!res?.data?.isAcceptingMessage) {
            // console.log("res?.data?.isAcceptingMessage ::", res?.data?.isAcceptingMessage);

            toast.warning("User is not accepting messages");
         } else {
            toast.success("User is  accepting messages");
         }
      } catch (error) {
         const axiosError = error as AxiosError<ApiResponse>;
         toast.error(axiosError.response?.data.message || "Error checking settings");
      }
   };

   // send message
   const sendMessage = async () => {
      setIsSubmitting(true);
      try {
         const res = await axios.post<ApiResponse>(`/api/send-message`, {
            content: message,
            userName: username,
         });
         toast.success(res?.data?.message || "Message sent successfully");
         setMessage("");
      } catch (error) {
         const axiosError = error as AxiosError<ApiResponse>;
         toast.error(axiosError.response?.data.message || "Message sending error");
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
         <Card className="w-full max-w-md shadow-xl rounded-2xl">
            {/* Profile Header */}
            <CardHeader className="text-center">
               <div className="flex justify-center mb-3">
                  <User className="w-14 h-14 text-primary" />
               </div>
               <CardTitle className="text-2xl font-semibold">{username}</CardTitle>
               <CardDescription>Send an anonymous message to this user.</CardDescription>
            </CardHeader>

            {/* Message Input */}
            <CardContent>
               <div className="flex flex-col gap-4">
                  <Textarea
                     placeholder="Write your message here..."
                     value={message}
                     onChange={(e) => setMessage(e.target.value)}
                     className="min-h-[120px] resize-none"
                  />

                  <Button
                     onClick={sendMessage}
                     disabled={!message || isSubmitting}
                     className="w-full flex items-center gap-2"
                  >
                     <Send className="w-4 h-4" />
                     {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>

                  <Button onClick={isAcceptingMessage} variant="outline" className="w-full flex items-center gap-2">
                     <Shield className="w-4 h-4" />
                     Check if accepting messages
                  </Button>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
