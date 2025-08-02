import { resend } from "../lib/resend";
import VerificationEmailTemplete from "../../../emails/verificationEmailTemplete";
import { ApiResponse } from "../lib/types/apiResponse";

export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
   try {
      const { data, error } = await resend.emails.send({
         from: "Acme <onboarding@resend.dev>",
         to: email,
         subject: "Feeback Project Verification Code",
         react: VerificationEmailTemplete({ username, otp: verifyCode }), // otp is verification code
      });

      return {
         status: true,
         message: "Verification email send successfully.",
      };
   } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      return {
         status: false,
         message: "Failed to send verification email.",
      };
   }
}
