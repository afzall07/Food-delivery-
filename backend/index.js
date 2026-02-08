import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import connectDb from './config/db.js'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.routes.js'
import cors from "cors"
import userRouter from './routes/user.routes.js'
import shopRouter from './routes/shop.routes.js'
import itemRouter from './routes/items.routes.js'
import orderRouter from './routes/order.routes.js'
import http from 'http'
import { Server } from 'socket.io'
import { sockethandler } from './socket.js'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "https://khaopio.onrender.com",
        credentials: true,
        methods: ["GET", "POST"]
    }
})

app.set("io", io)

const port = process.env.PORT || 5000
// Middlewares
app.use(cors({
    origin: "https://khaopio.onrender.com",
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

// Routes 
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/shop", shopRouter)
app.use("/api/item", itemRouter)
app.use("/api/order", orderRouter)

sockethandler(io)

// Server start
server.listen(port, async () => {
    try {
        await connectDb();
        console.log(`✅ Server started at port ${port}`);
    } catch (err) {
        console.error("❌ DB Connection Error:", err);
    }
})


