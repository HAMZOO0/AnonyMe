import { Message } from "@/model/user.model";
export interface ApiResponse<T = any> {
   status: boolean;
   message: string;
   text:string
   isAcceptingMessage?: boolean;
   messages?: Array<Message>; // Optional, if the API returns a list of messages
   data?: T; // Use the generic type 'T' for data
   errorCode?: string; // Optional error code for more detailed error handling
}
