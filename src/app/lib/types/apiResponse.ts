import { Message } from "@/app/model/user.model";
export interface ApiResponse {
   status: boolean;
   message: string;
   isAcceptingMessages?: boolean;
   messages?: Array<Message>; // Optional, if the API returns a list of messages 
   data?: any; // Use a more specific type if you know the structure of the data
   errorCode?: string; // Optional error code for more detailed error handling
}
