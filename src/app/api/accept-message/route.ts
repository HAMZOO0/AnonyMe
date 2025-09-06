import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import dbConnect from "@/app/lib/databaseConnect";
import User from "next-auth";
import UserModel from "@/model/user.model";

// toggle user preference for accepting messages ON or OFF
export async function POST(request: Request) {
   dbConnect();
   try {
      //  here we can get the session
      const session = await getServerSession(authOptions);
      console.log("session :: ", session);

      const user = session?.user;

      // if no session
      if (!session || !session.user) {
         return Response.json({ message: "Unauthorized" }, { status: 401 });
      }

      // get user id from session
      const userId = user?._id;

      const { isAcceptingMessage } = await request.json();

      // update user
      const updatedUser = await UserModel.findByIdAndUpdate(
         userId,
         { isAcceptingMessage: isAcceptingMessage },
         { new: true }
      );

      if (!updatedUser) {
         return Response.json(
            {
               success: false,
               message: "User not found",
            },
            {
               status: 404,
            }
         );
      }

      return Response.json(
         {
            success: true,
            message: "User preference updated successfully",
            user: updatedUser,
         },
         { status: 200 }
      );
   } catch (error) {
      console.log("error :: ", error);
      return Response.json(
         {
            success: false,
            message: "Internal Server Error",
         },
         { status: 500 }
      );
   }
}

export async function GET(request: Request) {
   try {
      dbConnect();

      //  here we can get the session
      const session = await getServerSession(authOptions);
      console.log("session :: ", session);

      const user = session?.user;

      // if no session
      if (!session || !session.user) {
         return Response.json({ message: "Unauthorized" }, { status: 401 });
      }

      // get user id from session
      const userId = user?._id;

      // fetch user
      const existingUser = await UserModel.findById(userId).select("-password -verifiedCode -verifiedCodeExpiry");
      if (!existingUser) {
         return Response.json(
            {
               success: false,
               message: "User not found",
            },
            {
               status: 404,
            }
         );
      }
      return Response.json(
         {
            success: true,
            isAcceptingMessages: existingUser?.isAcceptingMessages,
         },
         { status: 200 }
      );
   } catch (error) {
      console.log("error :: ", error);
      return Response.json(
         {
            success: false,
            message: "Internal Server Error",
         },
         { status: 500 }
      );
   }
}
