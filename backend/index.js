import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import connectDb from './config/db.js'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.routes.js'
import cors from "cors"
import userRouter from './routes/user.routes.js'

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
app.use("/api/user", userRouter)

// Server start
app.listen(port, async () => {
    try {
        await connectDb();
        console.log(`✅ Server started at port ${port}`);
    } catch (err) {
        console.error("❌ DB Connection Error:", err);
    }
})


