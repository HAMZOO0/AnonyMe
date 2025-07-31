import { promises } from "dns";
import mongoose from "mongoose";

// user type object
type connectionObject = {
   isConnected?: number;
};

// varbale to hold the connection object
const connection: connectionObject = {};

// void means it can accept any type of value
async function dbConnect(): Promise<void> {
   if (connection.isConnected) {
      console.log("Already connected to the database");
      return;
   }

   try {
      const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
      connection.isConnected = db.connections[0].readyState;
      if (connection.isConnected) {
         console.log("Database connection established successfully");
      } else {
         console.error("Failed to connect to the database");
      }
   } catch (error) {
      console.log("Error", error);
      process.exit(1);
   }
}

export default dbConnect;
