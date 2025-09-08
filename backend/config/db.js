import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("db connected successfully");
    } catch (error) {
        console.error("db connection failed:", error.message);
        throw error;
    }
};

export default connectDb;
