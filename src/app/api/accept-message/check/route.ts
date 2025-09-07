import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import dbConnect from "@/app/lib/databaseConnect";
import User from "next-auth";
import UserModel from "@/model/user.model";

export async function POST(request: Request) {
   try {
      dbConnect();

      const { username } = await request.json();
      // console.log("usernmae  in accept mesge route:: ", username);

      // if no session then nested we check username in db
      if (!username) {
         return Response.json({ message: "Unauthorized" }, { status: 401 });
      }
      const user = await UserModel.findOne({ userName: username });
      if (!user) {
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
      console.log(user);

      return Response.json(
         {
            success: true,
            isAcceptingMessage: user?.isAcceptingMessage,
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
