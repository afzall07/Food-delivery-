import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            serverSelectionTimeoutMS: 5000, // max 5s wait
        });
        console.log("✅ DB connected successfully");
    } catch (error) {
        console.error("❌ DB connection failed:", error.message);
        throw error;

    }
};

export default connectDb;
