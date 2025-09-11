import express from 'express'
import { signUp, signIn, logOut, sendOtp, verifyOtp, resetPassword } from '../controllers/auth.controllers.js'

const authRouter = express.Router()

authRouter.post("/signup", signUp)

authRouter.post("/signin", signIn)
authRouter.get("/logout", logOut)

authRouter.post("/send-otp", sendOtp)
authRouter.post("/verify-otp", verifyOtp)
authRouter.post("/reset-password", resetPassword)

export default authRouter