import express from 'express'
import { signUp, signIn, logOut } from '../controllers/auth.controllers.js'

const authRouter = express.Router()

authRouter.post("/signup", signUp)
authRouter.post("/signin", signIn)
authRouter.get("/logout", logOut)

export default authRouter