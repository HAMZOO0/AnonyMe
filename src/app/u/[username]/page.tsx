"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, User, Send, Shield, Mail, Sparkles, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/app/lib/types/apiResponse";
import { Textarea } from "@/components/ui/textarea";

export default function UserProfilePage() {
   const params = useParams();
   const [message, setMessage] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
   const [isAccepting, setIsAccepting] = useState<boolean | null>(null);
   const [isLoadingAcceptance, setIsLoadingAcceptance] = useState(false);

   const username = params.username as string;

   // check if user accepts messages
   const checkAcceptingMessages = async () => {
      setIsLoadingAcceptance(true);
      try {
         const res = await axios.post<ApiResponse>("/api/accept-message/check", {
            username,
         });
         setIsAccepting(res?.data?.isAcceptingMessage!);

         if (!res?.data?.isAcceptingMessage) {
            toast.warning("This user is not currently accepting messages");
         }
      } catch (error) {
         const axiosError = error as AxiosError<ApiResponse>;
         toast.error(axiosError.response?.data.message || "Error checking settings");
      } finally {
         setIsLoadingAcceptance(false);
      }
   };

   // send message
   const sendMessage = async () => {
      if (!message.trim()) {
         toast.error("Please enter a message");
         return;
      }

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

   const getSuggestedMessages = async () => {
      try {
         const res = await axios.post<ApiResponse>("/api/suggested-message");
         if (res.data.text && typeof res.data.text === "string") {
            // Split the text by "||" to get individual messages
            const messages = res.data.text
               .split("||")
               .map((msg) => msg.trim())
               .filter((msg) => msg);
            setSuggestedMessages(messages);
         }
      } catch (error) {
         const axiosError = error as AxiosError<ApiResponse>;
         console.error("AI text fetching error:", axiosError.response?.data.message);
      }
   };

   const handleSuggestionClick = (suggestion: string) => {
      setMessage(suggestion);
      // Optional: focus on the textarea after selecting a suggestion
      const textarea = document.querySelector("textarea");
      if (textarea) {
         textarea.focus();
      }
   };

   useEffect(() => {
      checkAcceptingMessages();
      getSuggestedMessages();
   }, []);

   if (isAccepting === false) {
      return (
         <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
            <Card className="w-full max-w-md shadow-xl rounded-2xl">
               <CardHeader className="text-center">
                  <div className="flex justify-center mb-3">
                     <Shield className="w-14 h-14 text-amber-500" />
                  </div>
                  <CardTitle className="text-2xl font-semibold">@{username}</CardTitle>
                  <CardDescription>This user is not currently accepting messages</CardDescription>
               </CardHeader>
               <CardContent className="text-center">
                  <Button onClick={checkAcceptingMessages} disabled={isLoadingAcceptance}>
                     {isLoadingAcceptance ? "Checking..." : "Check Again"}
                  </Button>
               </CardContent>
            </Card>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
         <div className="max-w-3xl mx-auto">
            <Card className="w-full shadow-xl rounded-2xl overflow-hidden border-0">
               {/* Profile Header */}
               <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
                  <div className="flex flex-col items-center text-center">
                     <div className="bg-white/20 p-4 rounded-full mb-4">
                        <User className="w-12 h-12" />
                     </div>
                     <CardTitle className="text-2xl md:text-3xl font-bold mb-2">@{username}</CardTitle>
                     <CardDescription className="text-blue-100">Send an anonymous message to this user</CardDescription>
                  </div>
               </div>

               <CardContent className="p-6">
                  <div className="flex flex-col gap-6">
                     {/* Message Input */}
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Your Message</label>
                        <Textarea
                           placeholder="Write your message here..."
                           value={message}
                           onChange={(e) => setMessage(e.target.value)}
                           className="min-h-[120px] resize-none text-lg p-4"
                        />
                     </div>

                     {/* Suggested Messages */}
                     {suggestedMessages.length > 0 && (
                        <div className="space-y-3">
                           <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                              <Sparkles className="w-4 h-4 text-amber-500" />
                              <span>Suggested Messages</span>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {suggestedMessages.map((suggestion, index) => (
                                 <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="text-left p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all duration-200 group"
                                 >
                                    <div className="flex items-start gap-2">
                                       <ChevronRight className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                                       <span className="text-sm text-gray-700 group-hover:text-blue-700">
                                          {suggestion}
                                       </span>
                                    </div>
                                 </button>
                              ))}
                           </div>
                        </div>
                     )}

                     {/* Action Buttons */}
                     <div className="flex flex-col gap-3">
                        <Button
                           onClick={sendMessage}
                           disabled={!message || isSubmitting}
                           className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                           <Send className="w-5 h-5 mr-2" />
                           {isSubmitting ? "Sending..." : "Send Message Anonymously"}
                        </Button>

                        <Button
                           onClick={checkAcceptingMessages}
                           variant="outline"
                           disabled={isLoadingAcceptance}
                           className="w-full"
                        >
                           <Shield className="w-4 h-4 mr-2" />
                           {isLoadingAcceptance ? "Checking..." : "Verify Message Acceptance"}
                        </Button>
                     </div>

                     {/* Privacy Note */}
                     <div className="flex items-center gap-2 text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <span>Your message will be completely anonymous</span>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
