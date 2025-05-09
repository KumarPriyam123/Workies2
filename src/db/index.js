import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        console.log(process.env.MONGODB_URI)
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDB connected: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.error("MongoDB connection Failed ERROR: ",error)
        process.exit(1)
    }
}
export default connectDB;