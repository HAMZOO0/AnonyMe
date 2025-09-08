import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import dbConnect from "@/app/lib/databaseConnect";
import User from "next-auth";
import UserModel from "@/model/user.model";
import { Types } from "mongoose";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
   try {
      dbConnect();
      const session = await getServerSession(authOptions);
      const user = session?.user;

      const messageId = params.id;
      // console.log("Deleting message with id:", messageId);

      // if no session
      if (!session || !session.user) {
         return Response.json({ message: "Unauthorized" }, { status: 401 });
      }

      // if messge id is missing
      if (!messageId) {
         return Response.json({ message: "Message not found" }, { status: 404 });
      }

      const userId = new Types.ObjectId(user?._id);
      const main_user = await UserModel.findById(userId);
      if (!main_user) {
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
      // console.log(main_user);

      // find message
      const updatedUser = await UserModel.findOneAndUpdate(
         { _id: main_user._id }, // find the logged-in user
         {
            $pull: { messages: { _id: messageId } },
         },
         {
            new: true,
         } // return new doc
      );
      if (!updatedUser) {
         return Response.json({ success: false, message: "Message not found" }, { status: 404 });
      }
      return Response.json({ success: true, message: "Message deleted successfully" }, { status: 200 });
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
