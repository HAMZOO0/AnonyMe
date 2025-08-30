import mongoose, { Schema, Document } from "mongoose";
import { Content } from "next/font/google";

export interface Message extends Document {
   content: string;
   createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
   content: {
      type: String,

      required: true,
   },

   createdAt: {
      type: Date,
      required: true,
      default: Date.now,
   },
});

export interface User extends Document {
   userName: string;
   email: string;
   password: string;
   verifiedCode: string;
   verifiedCodeExpiry: Date;
   isVerified: boolean;
   isAcceptingMessage: boolean;
   messages: Message[]; // message is array of Message type
}

const UserSchema: Schema<User> = new Schema({
   userName: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      unique: true,
   },
   email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      match: [
         /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
         "Please enter a valid email address",
      ],
   },
   password: {
      type: String,
      required: [true, "Password is required"],
   },
   verifiedCode: {
      type: String,
      required: false, // <-- change this
   },
   verifiedCodeExpiry: {
      type: Date,
      required: false, // <-- change this
   },
   isVerified: {
      type: Boolean,
      default: false,
   },
   isAcceptingMessage: {
      type: Boolean,
      default: true,
   },
   messages: [MessageSchema],
});

// hot-reload safe
// is user model exists  || create user model
const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;
