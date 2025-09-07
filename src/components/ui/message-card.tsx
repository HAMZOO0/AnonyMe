import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./button";
import { Message } from "@/model/user.model";
import { toast } from "sonner";
import axios from "axios";
import { Trash2, Calendar, Clock, MessageCircle } from "lucide-react";
import { useState } from "react";

type MessageCardProp = {
   message: Message;
   onMessageDelete: (messageId: string) => void;
};

export default function MessageCard({ message, onMessageDelete }: MessageCardProp) {
   const [isDeleting, setIsDeleting] = useState(false);
   // console.log(message);

   const handleDelete = async () => {
      setIsDeleting(true);
      try {
         // Replace with your actual API endpoint
         const res = await axios.delete(`/api/delete-message/${message._id}`);

         if (res.data.success) {
            onMessageDelete(message._id);
            toast.success("Message deleted successfully");
         } else {
            toast.error("Failed to delete message");
         }
      } catch (error) {
         console.error("Error deleting message:", error);
         toast.error("Error deleting message");
      } finally {
         setIsDeleting(false);
      }
   };

   // Format the date for display
   const formatDate = (dateString: string | Date) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
         year: "numeric",
         month: "short",
         day: "numeric",
      });
   };

   // Format the time for display
   const formatTime = (dateString: string | Date) => {
      const date = new Date(dateString);
      return date.toLocaleTimeString("en-US", {
         hour: "2-digit",
         minute: "2-digit",
      });
   };

   return (
      <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-md">
         <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
               <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-full">
                     <MessageCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                     <CardTitle className="text-base">Anonymous Message</CardTitle>
                     <CardDescription>Received on {formatDate(message.createdAt)}</CardDescription>
                  </div>
               </div>

               <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-50"
                     >
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                     <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                           <Trash2 className="h-5 w-5 text-red-500" />
                           Delete Message
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                           Are you sure you want to delete this message? This action cannot be undone.
                        </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                           onClick={handleDelete}
                           disabled={isDeleting}
                           className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
                        >
                           {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                     </AlertDialogFooter>
                  </AlertDialogContent>
               </AlertDialog>
            </div>
         </CardHeader>

         <CardContent className="pb-3">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
               <p className="text-gray-700">{message?.content || "No content available"}</p>
            </div>
         </CardContent>

         <CardFooter className="pt-1 flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(message.createdAt)}</span>
               </div>
               <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(message.createdAt)}</span>
               </div>
            </div>

            <div className="text-xs bg-gray-100 px-2 py-1 rounded">ID: {message._id.slice(-6)}</div>
         </CardFooter>
      </Card>
   );
}
