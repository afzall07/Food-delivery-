import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import genToken from "../utils/token.js"

// signUp controller
export const signUp = async (req, res) => {
    try {
        const { fullName, email, password, mobile, role } = req.body
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User Already Exist." })
        }
        if (password.lenght > 6) {
            return res.status(400).json({ message: "password must be at least 6 characters." })
        }
        if (mobile.lenght > 10) {
            return res.status(400).json({ message: "mobile number must be at least 10 digits." })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        user = await User.create({
            fullName,
            email,
            mobile,
            role,
            password: hashedPassword

        })

        const token = await genToken(user._id)
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })

        return res.status(201).json(user)
    } catch (error) {
        return res.status(500).json(`sign up error ${error}`)
    }
}

// signIn controller
export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User doesn't  exist." })
        }

        const isMatchedPassword = await bcrypt.compare(password, user.password)
        if (isMatchedPassword) {
            return res.status(400).json({ message: "incorrect password" })
        }


        const token = await genToken(user._id)
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })

        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json(`sign In error ${error}`)
    }
}

// logout controller
export const logOut = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({ message: "log Out successfully" })
    } catch (error) {
        return res.status(500).json(`log Out error ${error}`)
    }
}