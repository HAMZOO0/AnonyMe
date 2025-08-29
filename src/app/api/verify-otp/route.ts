import dbConnect from "@/app/lib/databaseConnect";
import { sendVerificationEmail } from "@/helpers/sendVerficationEmail";
import { success } from "zod";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";

export async function POST(requst: Request) {
   try {
      await dbConnect();

      const { userName, otp } = await requst.json();

      const decodedUsername = decodeURIComponent(userName);

      //find if user already exists
      // const existingUserVerifiedByUsername = await UserModel.findOne({
      //    $and: [{ userName: decodedUsername, verifiedCode: otp }],
      // });

      const user = await UserModel.findOne({ userName: decodedUsername });
      console.log("user", user);
      if (!user) {
         return Response.json(
            {
               success: false,
               message: "Username is required",
            },
            {
               status: 400,
            }
         );
      }

      // const existingUserVerifiedByUsername = await UserModel.findOne({ verifiedCode: otp, userName: decodedUsername });

      // if (!existingUserVerifiedByUsername) {
      //    return Response.json(
      //       {
      //          success: false,
      //          message: "OTP is required",
      //       },
      //       {
      //          status: 400,
      //       }
      //    );
      // }
      console.log("user.verifiedCode", user.verifiedCode);

      if (user.verifiedCode !== otp) {
         return Response.json(
            {
               success: false,
               message: "Invalid OTP",
            },
            {
               status: 400,
            }
         );
      }

      //check code expiry date
      if (user.verifiedCodeExpiry < new Date()) {
         return Response.json(
            {
               success: false,
               message: "OTP has expired. Please request a new one.",
            },
            {
               status: 400,
            }
         );
      }

      // Update the user's verified status and clear the verifiedCode
      await UserModel.updateOne({ _id: user._id }, { $set: { isVerified: true }, $unset: { verifiedCode: "" } });

      return Response.json(
         {
            success: true,
            message: "OTP verified successfully. User is now verified.",
            user: {
               userName: user.userName,
               email: user.email,
               id: user._id,
            },
         },
         {
            status: 200,
         }
      );
   } catch (error) {
      console.error("Error in OTP verification", error);
      return Response.json(
         {
            success: false,
            message: "Internal server error while Verifing the otp .Please try again later. ",
         },
         {
            status: 500,
         }
      );
   }
}
