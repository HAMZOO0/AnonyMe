import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import dbConnect from "@/app/lib/databaseConnect";
import UserModel from "@/model/user.model";
import { Types } from "mongoose";
import { messageSchema } from "@/schemas/messageSchema";
import { Message } from "@/model/user.model";
import { z } from "zod";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
   try {
      await dbConnect(); // Make sure to await the database connection

      const { content, userName } = await request.json();

      // Validate the content using zod schema first
      const parseResult = messageSchema.safeParse({ content });

      if (!parseResult.success) {
         const messageErrors = parseResult.error.format().content?._errors || [];
         return NextResponse.json(
            {
               success: false,
               message: "Invalid message content",
               errors: messageErrors,
            },
            {
               status: 400,
            }
         );
      }

      // Find user by username
      const user = await UserModel.findOne({ userName: userName });
      if (!user) {
         return NextResponse.json(
            {
               success: false,
               message: "User not found",
            },
            {
               status: 404,
            }
         );
      }

      // Check if user is accepting messages
      if (!user.isAcceptingMessages) {
         return NextResponse.json(
            {
               success: false,
               message: "User is not accepting messages at the moment",
            },
            {
               status: 403,
            }
         );
      }

      // Create new message object
      const newMessage = {
         content,
         createdAt: new Date(),
      };

      // Add the message to user's messages array
      user.messages.push(newMessage as Message);

      // Save the updated user document
      await user.save();

      return NextResponse.json(
         {
            success: true,
            message: "Message sent successfully",
            data: newMessage,
         },
         {
            status: 201,
         }
      );
   } catch (error) {
      console.log("error :: ", error);
      return NextResponse.json(
         {
            success: false,
            message: "Internal Server Error",
         },
         { status: 500 }
      );
   }
}
