import NextAuth, { DefaultSession } from "next-auth";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 */

declare module "next-auth" {
   interface User {
      // <- This is just telling TypeScript what shape user objects should have
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

// 2nd method like mention or specify {next-auth/jwt} which interface you want to extend
declare module "next-auth/jwt" {
   interface JWT {
      _id?: string;
      userName?: string;
      email?: string;
      isVerified?: boolean;
      isAcceptingMessage?: boolean;
      // messages?: Array<any>;
   }
}

//! i dont get 2 things 1 : user vs User and 2nd is DefaultSession
// User is interface user obejct
// DefaultSession is the default session object provided by next auth
