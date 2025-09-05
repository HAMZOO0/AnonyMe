"use client";
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { register } from "module";

// import { Message } from "@/model/user.model";

// here i created a type to fix id error
type Message = {
   _Id: string;
};

const DashboardPage = () => {
   const [messages, setMessages] = useState([]);
   const [loading, setLoading] = useState(false);
   const [switchLoading, setSwitchLoading] = useState(false);

   // handle the delete message , we setMessages except the message which we want to delete
   function handleDeletMessage(messageId: string) {
      setMessages(messages.filter((message: Message) => message._Id !== messageId));
   }

   // get user data form session
   const { data: session } = useSession();
   const user: User = session?.user as User;

   // need to create notes this form
   const form = useForm({
      resolver: zodResolver(acceptMessageSchema),
   });

   const { register, watch, setValue } = form;

   return (
      <div>
         <h1>Dashboard Page</h1>
         <p>Welcome to your dashboard!</p>
      </div>
   );
};

export default DashboardPage;
