import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserModel from "@/model/user.model";
import dbConnect from "@/app/lib/databaseConnect";
import { createPortal } from "react-dom";

export const authOptions: NextAuthOptions = {
   providers: [
      CredentialsProvider({
         id: "Credentials",
         name: "Credentials",
         // behind the seens login function
         credentials: {
            userName: { label: "Email", type: "text", placeholder: "Your username" },
            password: { label: "Password", type: "password", placeholder: "Your password" },
         },

         async authorize(credentials: any): Promise<any> {
            await dbConnect();

            try {
               // find user by username and email
               const user = await UserModel.findOne({
                  $or: [{ email: credentials.userName }, { userName: credentials.userName }],
               });

               // if user not found or not verified
               if (!user) {
                  throw new Error("Invalid username or email");
               }
               if (!user.isVerified) {
                  throw new Error("Please verify your email to login");
               }

               // compare password
               const isPasswordCurrect = await bcrypt.compare(credentials.password, user.password);
               if (!isPasswordCurrect) {
                  throw new Error("Invalid password");
               }
               return user;
            } catch (error: any) {
               throw new Error(error.message);
            }
         },
      }),
   ],

   callbacks: {
      async session({ session, token }) {
         if (token && session.user) {
            session.user._id = token._id?.toString();
            session.user.userName = token.userName as string;
            session.user.email = token.email as string;
            session.user.isVerified = token.isVerified as boolean;
            // session.use.isAcceptingMessage = token.isAcceptingMessage as string;
         }
         return session;
      },

      // make token more powerful
      async jwt({ token, user }) {
         if (user) {
            token.id = user._id?.toString();
            token.userName = user.userName;
            token.email = user.email;
            token.isVerified = user.isVerified;
            token.isAcceptingMessage = user.isAcceptingMessage;
         }
         return token;
      },
   },
   // the routes will handle by next auth , i dont need to create my own route :) hehe
   pages: {
      signIn: "/log-in",
   },
   session: {
      strategy: "jwt",
   },
   secret: process.env.NEXTAUTH_SECRET,
};
