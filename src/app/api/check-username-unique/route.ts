import dbConnect from "@/app/lib/databaseConnect";
import User from "@/model/user.model";
import { NextResponse } from "next/server";
import z from "zod";
import { usernameValidation } from "@/schemas/signupSchema";

// to validate the username by using zod schema
// this is object which makesure the usernmae have the same validation as in usernameValidation schema
const usernameQuerySchema = z.object({
   userName: usernameValidation,
});

await dbConnect();
export async function GET(request: Request) {
   try {
      // get the username from the url
      const { searchParams } = new URL(request.url);
      const userName = searchParams.get("userName"); // "hamza"

      // validate the username using zod schema
      const parseResult = usernameQuerySchema.safeParse({ userName });
      console.log("parseResult", parseResult);

      if (!parseResult.success) {
         const usernameErrors = parseResult.error.format().userName?._errors || [];
         return NextResponse.json(
            {
               success: false,
               message: "Invalid username",
               errors: usernameErrors,
            },
            {
               status: 400,
            }
         );
      }

      const { userName: any } = parseResult.data;

      // check if the username already exists in the database
      const existingUser = await User.findOne({ userName });
      // we also add to just check verified user
      if (existingUser) {
         return NextResponse.json(
            {
               success: false,
               message: "Username is already taken",
            },
            {
               status: 200,
            }
         );
      } else {
         return NextResponse.json(
            {
               success: true,
               message: "Username is available",
            },
            {
               status: 200,
            }
         );
      }
   } catch (error) {
      return NextResponse.json(
         {
            success: false,
            message: "Internal server error",
         },
         {
            status: 500,
         }
      );
   }
}
