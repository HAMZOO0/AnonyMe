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
import { register } from "module";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/app/lib/types/apiResponse";
import { Message } from "@/model/user.model";
import MessageCard from "@/components/ui/message-card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";

// here i created a type to fix id error
// type Message = {
//    id: string;
// };

const DashboardPage = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isLoading, setLoading] = useState(false);
   const [switchLoading, setSwitchLoading] = useState(false);

   // handle the delete message , we setMessages except the message which we want to delete
   function handleDeletMessage(messageId: string) {
      setMessages(messages.filter((message: Message) => message.id !== messageId));
   }

   // get user data form session
   const { data: session } = useSession();
   const user: User = session?.user as User;

   // need to create notes this form
   const form = useForm({
      resolver: zodResolver(acceptMessageSchema),
   });

   const { register, watch, setValue } = form;

   const acceptMessages = watch("isAcceptingMessage");

   const isFetchMessagesAccept = useCallback(async () => {
      setLoading(true);
      try {
         const res = await axios.get<ApiResponse>(`/api/accept-message`);
         setValue("isAcceptingMessage", res.data.isAcceptingMessages as boolean);
      } catch (error) {
         const axiosError = error as AxiosError<ApiResponse>;
         toast.error(axiosError.response?.data.message || "Failed to Accept Messages.");
      } finally {
         setLoading(false);
      }
   }, [setValue, toast]);

   const FetchMessages = useCallback(
      async (refresh: boolean = false) => {
         setLoading(true);
         setSwitchLoading(true);
         try {
            const res = await axios.get<ApiResponse>(`/api/get-messages`);
            setMessages(res.data.messages || []);

            if (refresh) {
               toast.info("Refreshed Messages.");
            }
         } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message || "Failed to Fetcb Messages.");
         } finally {
            setLoading(false);
            setSwitchLoading(false);
         }
      },
      [setLoading, setMessages, toast]
   );

   // toggle
   const handleSwitchChange = async () => {
      try {
         const res = await axios.post<ApiResponse>(`/api/accept-message`, {
            isAcceptingMessage: !acceptMessages,
         });
         setValue("isAcceptingMessage", !acceptMessages);
         toast.success(res?.data?.message || "preference Changed");
      } catch (error) {
         const axiosError = error as AxiosError<ApiResponse>;
         toast.error(axiosError.response?.data.message || "Message Toggle Error");
      }
   };

   // in useeffect depedency am using fucntion (usecallback -> store in memory ) so when these fucnitn depednyc array change then use effect run also
   useEffect(() => {
      if (!session || !session.user) {
         return;
      }
      isFetchMessagesAccept();
      FetchMessages();

      // handle switch change
   }, [session, setValue, FetchMessages, isFetchMessagesAccept]);

   if (!session || !session.user) {
      return <>please Login</>;
   }

   const baseUrl = `${window.location.protocol}//${window.location.host}`;
   const profileUrl = `${baseUrl}//${user?.name}`;

   const copyToClipboard = () => {
      navigator.clipboard.writeText(profileUrl);
   };

   return (
      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
         <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

         <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
            <div className="flex items-center">
               <input type="text" value={profileUrl} disabled className="input input-bordered w-full p-2 mr-2" />
               <Button onClick={copyToClipboard}>Copy</Button>
            </div>
         </div>

         <div className="mb-4">
            <Switch
               {...register("isAcceptingMessage")}
               checked={acceptMessages}
               onCheckedChange={handleSwitchChange}
               disabled={switchLoading}
            />
            <span className="ml-2">Accept Messages: {acceptMessages ? "On" : "Off"}</span>
         </div>
         <Separator />

         <Button
            className="mt-4"
            variant="outline"
            onClick={(e) => {
               e.preventDefault();
               FetchMessages(true);
            }}
         >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
         </Button>
         <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.length > 0 ? (
               messages.map((message, index) => (
                  <MessageCard key={message._id} message={message} onMessageDelte={handleDeletMessage} />
               ))
            ) : (
               <p>No messages to display.</p>
            )}
         </div>
      </div>
   );
};

export default DashboardPage;
