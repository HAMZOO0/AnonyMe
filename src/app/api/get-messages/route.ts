import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import dbConnect from "@/app/lib/databaseConnect";
import User from "next-auth";
import UserModel from "@/model/user.model";
import { Types } from "mongoose";

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

      // get user id from session and convert to ObjectId
      const userId = new Types.ObjectId(user?._id);

      // find user by id  and aggregation to get only isAcceptingMessage field
      const existingUser = await UserModel.aggregate([
         {
            // get the user by id
            $match: { _id: userId },
         },
         {
            // array into object
            $unwind: "$messages",
         },
         {
            // sort messages by createdAt in descending order
            $sort: { "messages.createdAt": -1 },
         },
         {
            // group back to user level and get only isAcceptingMessage field and messages array
            $group: {
               _id: "$_id",
               messages: { $push: "$messages" },
            },
         },
      ]);

      console.log("userid", user);
      // console.log("userid", user?._id);
      console.log("existingUser", existingUser);

      if (!existingUser || existingUser.length === 0) {
         return Response.json(
            {
               success: false,
               message: "User not found",
            },
            { status: 404 }
         );
      }

      console.log("existingUser :: ", existingUser);

      return Response.json(
         {
            success: true,
            messages: existingUser[0].messages,
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
