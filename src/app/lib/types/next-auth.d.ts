import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
   interface User {
      _id?: string;
      userName?: string;
      email?: string;
      isVerified?: boolean;
      isAcceptingMessage?: boolean;
      // messages?: Array<any>;
   }
   interface Session {
      user: {
         _id?: string;
         userName?: string;
         email?: string;
         isVerified?: boolean;
         isAcceptingMessage?: boolean;
         // messages?: Array<any>;}
      } & DefaultSession["user"];
   }
}

//! i dont get 2 things 1 : user vs User and 2nd is DefaultSession
