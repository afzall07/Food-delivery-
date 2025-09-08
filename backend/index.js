import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import connectDb from './config/db.js'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.routes.js'
import cors from "cors"

const app = express()
const port = process.env.PORT || 5000

// Middlewares
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use("/api/auth", authRouter)

// Start server
const startServer = async () => {
    try {
        await connectDb(); // yahan DB ka console handle hoga

        app.listen(port, () => {
            console.log(`Server started at port ${port}`);
        });
    } catch (error) {
        console.error("Server not started because DB connection failed");
        process.exit(1);
    }
};

startServer();

