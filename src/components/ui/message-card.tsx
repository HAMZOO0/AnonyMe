import {
   Card,
   CardAction,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
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

type MessageCardProp = {
   message: Message;

   onMessageDelete: (messageId: string) => void;
};
export default function MessageCard({ message, onMessageDelete }: MessageCardProp) {
   const handleDelte = async () => {
      // ! ADD path here and complete it
      // const res = await axios.delete(`/api/delete-message${}`);
   };

   return (
      <>
         <Card>
            <CardHeader>
               <CardTitle>Card Title</CardTitle>
               <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Button variant="outline">Show Dialog</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                     <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                           This action cannot be undone. This will permanently delete your account and remove your data
                           from our servers.
                        </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelte}>Continue</AlertDialogAction>
                     </AlertDialogFooter>
                  </AlertDialogContent>
               </AlertDialog>
               <CardDescription>Card Description</CardDescription>
               <CardAction>Card Action</CardAction>
            </CardHeader>
            <CardContent>
               <p>Card Content</p>
            </CardContent>
            <CardFooter>
               <p>Card Footer</p>
            </CardFooter>
         </Card>
      </>
   );
}
