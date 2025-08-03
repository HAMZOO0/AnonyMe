import dbConnect from "@/app/lib/databaseConnect";
import { sendVerificationEmail } from "@/app/helpers/sendVerficationEmail";
import { success } from "zod";
import UserModel from "@/app/model/user.model";
import bcrypt from "bcryptjs";

export async function POST(requst: Request) {
   try {
      await dbConnect();

      const { userName, email, password } = await requst.json();

      //find if user already exists
      const existingUserVerifiedByUsername = await UserModel.findOne({
         userName: userName,
         isVerified: true,
      });
      if (existingUserVerifiedByUsername) {
         return Response.json(
            {
               success: false,
               message: "Username already exists. Please choose a different username.",
            },
            {
               status: 400,
            }
         );
      }

      const existingUserByEmail = await UserModel.findOne({
         email: email,
         // isVerified: true, // !
      });
      const verifiedCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit verification
      if (existingUserByEmail) {
         // If user exists and is verified
         if (existingUserByEmail.isVerified) {
            return Response.json(
               {
                  success: false,
                  message: "Email already exists. Please choose a different email.",
               },
               {
                  status: 400,
               }
            );
         }
         // Update existing user but not verified
         else {
            const hashPassword = await bcrypt.hash(password, 10);
            existingUserByEmail.password = hashPassword;

            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            await existingUserByEmail.save();
         }
      }
      //create new user
      else {
         const hashPassword = await bcrypt.hash(password, 10);
         const expiryDate = new Date();
         expiryDate.setHours(expiryDate.getHours() + 1); // Set expiry to 1 hour from now

         const newUser = await new UserModel({
            userName,
            email,
            password: hashPassword,
            verifiedCode,
            verifiedCodeExpiry: expiryDate,
            isVerified: false,
            isAcceptingMessage: true,
            messages: [],
         });

         await newUser.save();
      }

      // Send verification email
      const emailResponce = await sendVerificationEmail(email, userName, verifiedCode);
      if (emailResponce.status) {
         return Response.json(
            {
               success: true,
               message: "User registered successfully. Please check your email for verification code.",
            },
            {
               status: 201,
            }
         );
      } else {
         return Response.json(
            {
               success: false,
               message: "Failed to send verification email. Please try again later.",
            },
            {
               status: 500,
            }
         );
      }
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
