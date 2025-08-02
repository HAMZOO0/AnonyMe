import dbConnect from "@/app/lib/databaseConnect";
import { sendVerificationEmail } from "@/app/helpers/sendVerficationEmail";
import { success } from "zod";

export async function POST(requst: Request) {
   try {
      await dbConnect();

      const { userName, email, password } = await requst.json();
   } catch (error) {
      console.error("Error in sign-up route:", error);
      return Response.json(
         {
            success: false,
            message: "Internal server error while registering user. Please try again later. ",
         },
         {
            status: 500,
         }
      );
   }
}
