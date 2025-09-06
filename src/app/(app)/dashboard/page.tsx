"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/app/lib/types/apiResponse";
import { Message } from "@/model/user.model";
import MessageCard from "@/components/ui/message-card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw, Copy, Link as LinkIcon, MessageSquare, User as UserIcon } from "lucide-react";

const DashboardPage = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isLoading, setLoading] = useState(false);
   const [switchLoading, setSwitchLoading] = useState(false);

   // Handle message deletion
   function handleDeleteMessage(messageId: string) {
      setMessages(messages.filter((message: Message) => message.id !== messageId));
      toast.success("Message deleted successfully");
   }

   // Get user data from session
   const { data: session } = useSession();
   const user: User = session?.user as User;

   // Form setup
   const form = useForm({
      resolver: zodResolver(acceptMessageSchema),
   });

   const { register, watch, setValue } = form;
   const acceptMessages = watch("isAcceptingMessage");

   const fetchAcceptanceStatus = useCallback(async () => {
      setLoading(true);
      try {
         const res = await axios.get<ApiResponse>(`/api/accept-message`);
         setValue("isAcceptingMessage", res.data.isAcceptingMessage as boolean);
      } catch (error) {
         const axiosError = error as AxiosError<ApiResponse>;
         toast.error(axiosError.response?.data.message || "Failed to fetch acceptance status.");
      } finally {
         setLoading(false);
      }
   }, [setValue]);

   const fetchMessages = useCallback(
      async (refresh: boolean = false) => {
         setLoading(true);
         setSwitchLoading(true);
         try {
            const res = await axios.get<ApiResponse>(`/api/get-messages`);
            setMessages(res.data.messages || []);

            if (refresh) {
               toast.info("Messages refreshed successfully");
            }
         } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message || "Failed to fetch messages.");
         } finally {
            setLoading(false);
            setSwitchLoading(false);
         }
      },
      [setLoading, setMessages, toast]
   );

   // Toggle message acceptance
   const handleSwitchChange = async () => {
      try {
         const res = await axios.post<ApiResponse>(`/api/accept-message`, {
            isAcceptingMessage: !acceptMessages,
         });
         setValue("isAcceptingMessage", !acceptMessages);
         toast.success(res?.data?.message || "Message preference updated");
      } catch (error) {
         const axiosError = error as AxiosError<ApiResponse>;
         toast.error(axiosError.response?.data.message || "Failed to update preference");
      }
   };

   useEffect(() => {
      if (!session || !session.user) {
         return;
      }
      fetchAcceptanceStatus();
      fetchMessages();
   }, [session, setValue, fetchMessages, fetchAcceptanceStatus]);

   if (!session || !session.user) {
      return (
         <div className="flex items-center justify-center min-h-screen text-foreground">
            Please login to access dashboard
         </div>
      );
   }

   const baseUrl = `${window.location.protocol}//${window.location.host}`;
   const profileUrl = `${baseUrl}/u/${user?.userName}`;

   const copyToClipboard = () => {
      navigator.clipboard.writeText(profileUrl);
      toast.success("Link copied to clipboard!");
   };

   return (
      <div className="min-h-screen bg-background py-8 px-4 md:px-8">
         <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="bg-card rounded-xl shadow-sm p-6 mb-6">
               <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                     <h1 className="text-3xl font-bold text-card-foreground">Dashboard</h1>
                     <p className="text-muted-foreground mt-2">Manage your anonymous feedback</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Left Column - User Info and Controls */}
               <div className="lg:col-span-1 space-y-6">
                  {/* User Profile Card */}
                  <div className="bg-card rounded-xl shadow-sm p-6">
                     <div className="flex items-center">
                        <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center">
                           <UserIcon className="h-8 w-8 text-primary" />
                        </div>
                        <div className="ml-4">
                           <h2 className="font-semibold text-card-foreground">{user?.name || "User"}</h2>
                           <p className="text-muted-foreground text-sm">@{user?.userName}</p>
                        </div>
                     </div>

                     <Separator className="my-4" />

                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center">
                              <MessageSquare className="h-5 w-5 text-muted-foreground mr-2" />
                              <span className="text-card-foreground">Total Messages</span>
                           </div>
                           <span className="bg-muted text-muted-foreground rounded-full py-1 px-3 text-sm">
                              {messages.length}
                           </span>
                        </div>

                        <div className="flex items-center justify-between">
                           <div className="flex items-center">
                              <span className="text-card-foreground">Accepting Messages</span>
                           </div>
                           <Switch
                              {...register("isAcceptingMessage")}
                              checked={acceptMessages}
                              onCheckedChange={handleSwitchChange}
                              disabled={switchLoading}
                           />
                        </div>
                     </div>
                  </div>

                  {/* Share Link Card */}
                  <div className="bg-card rounded-xl shadow-sm p-6">
                     <h3 className="font-semibold text-card-foreground mb-4 flex items-center">
                        <LinkIcon className="h-5 w-5 mr-2 text-primary" />
                        Your Feedback Link
                     </h3>
                     <p className="text-muted-foreground text-sm mb-4">Share this link to receive anonymous feedback</p>

                     <div className="flex items-center">
                        <input
                           type="text"
                           value={profileUrl}
                           disabled
                           className="flex-1 bg-muted border border-border rounded-l-lg py-2 px-3 text-sm text-card-foreground"
                        />
                        <Button onClick={copyToClipboard} className="rounded-l-none">
                           <Copy className="h-4 w-4" />
                        </Button>
                     </div>

                     <Button
                        className="w-full mt-4"
                        onClick={(e) => {
                           e.preventDefault();
                           fetchMessages(true);
                        }}
                        disabled={isLoading}
                     >
                        {isLoading ? (
                           <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                           <RefreshCcw className="h-4 w-4 mr-2" />
                        )}
                        Refresh Messages
                     </Button>
                  </div>
               </div>

               {/* Right Column - Messages */}
               <div className="lg:col-span-2">
                  <div className="bg-card rounded-xl shadow-sm p-6">
                     <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-card-foreground">Your Messages</h2>
                        <div className="text-sm text-muted-foreground">
                           {messages.length} {messages.length === 1 ? "message" : "messages"}
                        </div>
                     </div>

                     {messages.length > 0 ? (
                        <div className="space-y-4">
                           {messages.map((message) => (
                              <MessageCard key={message._id} message={message} onMessageDelete={handleDeleteMessage} />
                           ))}
                        </div>
                     ) : (
                        <div className="text-center py-12">
                           <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                           <h3 className="text-lg font-medium text-muted-foreground">No messages yet</h3>
                           <p className="text-muted-foreground mt-2">
                              Share your link to start receiving anonymous feedback
                           </p>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default DashboardPage;
