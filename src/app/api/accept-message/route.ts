import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import dbConnect from "@/app/lib/databaseConnect";
import User from "next-auth";
import UserModel from "@/model/user.model";

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
