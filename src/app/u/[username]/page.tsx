"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, User, Send, Shield, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/app/lib/types/apiResponse";
import { AnyTxtRecord } from "dns";

export default function UserProfilePage() {
   const params = useParams();
   const router = useRouter();
   const [message, setMessage] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isCheckingAcceptance, setIsCheckingAcceptance] = useState(true);
   const [isAcceptingMessages, setIsAcceptingMessages] = useState(false);
   const [userExists, setUserExists] = useState(true);

   const username = params.username as string;

   useEffect(() => {
      const checkAcceptance = async () => {
         try {
            setIsCheckingAcceptance(true);
            const res = await axios.post<ApiResponse>("/api/accept-message/check", {
               username,
            });

            if (res.data?.status) {
               setIsAcceptingMessages(res.data.isAcceptingMessage!);
               if (!res.data.isAcceptingMessage) {
                  toast.warning("This user is not currently accepting messages");
               }
            } else {
               setUserExists(false);
               toast.error("User not found");
            }
         } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            if (axiosError.response?.status === 404) {
               setUserExists(false);
               toast.error("User not found");
            } else {
               toast.error(axiosError.response?.data.message || "Error checking user status");
            }
         } finally {
            setIsCheckingAcceptance(false);
         }
      };

      if (username) {
         checkAcceptance();
      }
   }, [username]);

   const sendMessage = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!message.trim()) {
         toast.error("Please enter a message");
         return;
      }

      if (!isAcceptingMessages) {
         toast.error("This user is not accepting messages");
         return;
      }

      setIsSubmitting(true);

      try {
         const res = await axios.post<ApiResponse>(`/api/send-message`, {
            content: message,
            userName: username,
         });
         toast.success(res?.data?.message || "Message sent successfully");
         setMessage(""); // Clear the input after successful submission
      } catch (error) {
         const axiosError = error as AxiosError<ApiResponse>;
         toast.error(axiosError.response?.data.message || "Error sending message");
      } finally {
         setIsSubmitting(false);
      }
   };

   if (isCheckingAcceptance) {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center">
               <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
               <p>Checking user status...</p>
            </div>
         </div>
      );
   }

   if (!userExists) {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Card className="w-full max-w-md mx-4">
               <CardHeader className="text-center">
                  <CardTitle>User Not Found</CardTitle>
                  <CardDescription>The user @{username} doesn't exist or couldn't be found.</CardDescription>
               </CardHeader>
               <CardContent className="text-center">
                  <Button onClick={() => router.push("/")}>Return to Home</Button>
               </CardContent>
            </Card>
         </div>
      );
   }

   if (!isAcceptingMessages) {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Card className="w-full max-w-md mx-4">
               <CardHeader className="text-center">
                  <div className="mx-auto bg-gray-200 h-16 w-16 rounded-full flex items-center justify-center mb-4">
                     <User className="h-8 w-8 text-gray-600" />
                  </div>
                  <CardTitle>@{username}</CardTitle>
                  <CardDescription>This user is not currently accepting messages</CardDescription>
               </CardHeader>
               <CardContent className="text-center">
                  <Button onClick={() => router.push("/")}>Return to Home</Button>
               </CardContent>
            </Card>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
         <div className="max-w-md mx-auto">
            <Card className="w-full">
               <CardHeader className="text-center">
                  <div className="mx-auto bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mb-4">
                     <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle>Send message to @{username}</CardTitle>
                  <CardDescription>Your message will be completely anonymous</CardDescription>
               </CardHeader>
               <CardContent>
                  <form onSubmit={sendMessage} className="space-y-4">
                     <div className="space-y-2">
                        <Textarea
                           placeholder="Type your anonymous message here..."
                           value={message}
                           onChange={(e:any) => setMessage(e.target.value)}
                           rows={4}
                           className="resize-none"
                           disabled={isSubmitting}
                        />
                     </div>

                     <div className="flex items-center text-sm text-gray-500">
                        <Shield className="mr-2 h-4 w-4" />
                        Your identity will remain hidden
                     </div>

                     <Button type="submit" className="w-full" disabled={isSubmitting || !isAcceptingMessages}>
                        {isSubmitting ? (
                           <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                           </>
                        ) : (
                           <>
                              <Send className="mr-2 h-4 w-4" />
                              Send Message
                           </>
                        )}
                     </Button>
                  </form>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                     <div className="flex items-center text-sm text-gray-500">
                        <Mail className="mr-2 h-4 w-4" />
                        This message will be delivered anonymously to @{username}
                     </div>
                  </div>
               </CardContent>
            </Card>

            <div className="mt-4 text-center">
               <Button variant="link" onClick={() => router.push("/")} className="text-blue-600">
                  Return to home page
               </Button>
            </div>
         </div>
      </div>
   );
}
