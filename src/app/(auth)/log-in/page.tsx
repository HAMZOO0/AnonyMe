"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useDebounceValue } from "usehooks-ts";
import { toast } from "sonner";

export default function Login() {
   const [username, setUsername] = useState("");
   const [usernameMessage, setUsernameMessage] = useState("");
   // const [loading, setLoading] = useState(false);
   const [isCheckingUsername, setIsCheckingUsername] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [debouncedValue, setValue] = useDebounceValue(username, 500);

   // const { data: session } = useSession();
   // if (session) {
   //    return (
   //       <>
   //          Signed in as {session.user.email} <br />
   //          <Button onClick={() => signOut()}>Sign out</Button>
   //       </>
   //    );
   // }
   return (
      <>
         <Button className=" bg-red-600 " onClick={() => signIn()}>
            Sign in
         </Button>
         <Button
            variant="outline"
            onClick={() =>
               toast("Event has been created", {
                  description: "Sunday, December 03, 2023 at 9:00 AM",
                  action: {
                     label: "Undo",
                     onClick: () => console.log("Undo"),
                  },
               })
            }
         >
            Show Toast
         </Button>
      </>
   );
}
