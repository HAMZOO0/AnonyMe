// import { resend } from "../app/lib/resend";
import nodemailer from "nodemailer";
import VerificationEmailTemplete from "../../emails/verificationEmailTemplete";
import { ApiResponse } from "../app/lib/types/apiResponse";
import { render } from "@react-email/render";

export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
   try {
      const transporter = nodemailer.createTransport({
         service: "gmail",
         // port: 465,
         // secure: true,
         auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
         },
      });

      const emailHtml = await render(VerificationEmailTemplete({ username, otp: verifyCode }));

      const options = {
         from: "AnonyMe@gmal.com",
         to: email,
         subject: "Feeback Project Verification Code",
         html: emailHtml,
      };

      await transporter.sendMail(options);

      return {
         status: true,
         message: "Verification email send successfully.",
         text: "",
      };
   } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      return {
         status: false,
         message: "Failed to send verification email.",
         text: "",
      };
   }
}
