"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Shield, Sparkles, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/app/lib/types/apiResponse";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function UserProfilePage() {
   const params = useParams();
   const [message, setMessage] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
   const [isAccepting, setIsAccepting] = useState<boolean | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [isLoadingAcceptance, setIsLoadingAcceptance] = useState(false);

   const username = params.username as string;

   const getSuggestedMessages = async () => {
      try {
         const res = await axios.post<ApiResponse>("/api/suggested-message");
         if (res.data.text && typeof res.data.text === "string") {
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
   };

   const checkAcceptingMessages = async (showToast = false) => {
      setIsLoadingAcceptance(true);
      try {
         const res = await axios.post<ApiResponse>("/api/accept-message/check", {
            username,
         });
         setIsAccepting(res?.data?.isAcceptingMessage!);
         if (showToast) {
            toast.success(`Message acceptance status: ${res.data.isAcceptingMessage ? 'On' : 'Off'}`)
         }

         if (res?.data?.isAcceptingMessage) {
            getSuggestedMessages();
         }
      } catch (error) {
         const axiosError = error as AxiosError<ApiResponse>;
         toast.error(axiosError.response?.data.message || "Error checking settings");
         setIsAccepting(false);
      } finally {
         setIsLoadingAcceptance(false);
      }
   };

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

   useEffect(() => {
      async function initialCheck() {
         setIsLoading(true);
         await checkAcceptingMessages();
         setIsLoading(false);
      }
      initialCheck();
   }, []);

   if (isLoading) {
      return (
         <div className="flex justify-center items-center min-h-screen bg-background">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-background font-sans antialiased">
         <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-2xl shadow-lg border-border/40">
               <CardHeader className="text-center p-6 sm:p-8">
                  <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary/10">
                     <AvatarFallback className="bg-primary/20 text-primary">
                        <User className="w-12 h-12" />
                     </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-4xl font-bold tracking-tight">@{username}</CardTitle>
                  <CardDescription className="text-lg text-muted-foreground mt-2">
                     Send a secret message. It's completely anonymous.
                  </CardDescription>
               </CardHeader>
               <CardContent className="p-6 sm:p-8 pt-0">
                  {isAccepting ? (
                     <div className="space-y-8">
                        <div className="space-y-4">
                           <Textarea
                              placeholder={`Whisper something to @${username}...`}
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              className="min-h-[150px] text-base p-4 bg-background/50"
                           />
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                           <Button size="lg" onClick={sendMessage} disabled={!message.trim() || isSubmitting} className="w-full sm:w-auto">
                              {isSubmitting ? (
                                 <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                                 </>
                              ) : (
                                 <>
                                    <Send className="mr-2 h-4 w-4" /> Send Anonymously
                                 </>
                              )}
                           </Button>
                        </div>

                        {suggestedMessages.length > 0 && (
                           <div className="space-y-6 pt-6 border-t border-border/40">
                              <div className="flex items-center justify-center gap-3 text-sm font-medium text-muted-foreground">
                                 <Sparkles className="w-6 h-6 text-yellow-500" />
                                 <span className="text-base">Need inspiration? Try one of these.</span>
                              </div>
                              <div className="flex flex-wrap justify-center gap-3">
                                 {suggestedMessages.map((suggestion, index) => (
                                    <Button
                                       key={index}
                                       variant="outline"
                                       size="sm"
                                       onClick={() => handleSuggestionClick(suggestion)}
                                       className="text-xs md:text-sm"
                                    >
                                       {suggestion}
                                    </Button>
                                 ))}
                              </div>
                           </div>
                        )}
                     </div>
                  ) : (
                     <div className="text-center space-y-6">
                        <p className="text-muted-foreground text-lg">This user is not currently accepting messages.</p>
                        <Button onClick={() => checkAcceptingMessages(true)} disabled={isLoadingAcceptance}>
                           {isLoadingAcceptance ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           ) : null}
                           Check Again
                        </Button>
                     </div>
                  )}
               </CardContent>
            </Card>
            <div className="text-center p-4 text-sm text-muted-foreground border-t border-border/40">
               Curious about who sent you a message? Create an account to find out.
               <Link href="/sign-up" className="text-primary font-semibold hover:underline ml-1">
                  Get Started
               </Link>
            </div>
         </div>
      </div>
   );
}