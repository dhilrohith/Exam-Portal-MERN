import mongoose from "mongoose";
import { MONGODB_URI, PORT } from "./utils/config.js";
import app from "./app.js";

const connectDB = async () => {
    try {
      const conn = await mongoose.connect(MONGODB_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);

      app.listen(PORT, ()=>{
        console.log(`Server is running on port http://localhost:3001`)
      });
    } catch (error) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
      process.exit(1);
    }
  };

  connectDB();