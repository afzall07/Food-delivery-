import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import genToken from "../utils/token.js";
import { sendOtpMail } from "../utils/mail.js";

//signup controller
export const signUp = async (req, res) => {
    try {
        const { fullName, email, password, mobile, role } = req.body;
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists." });
        }

        // Validation
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters." });
        }
        if (mobile.length !== 10) {
            return res.status(400).json({ message: "Mobile number must be exactly 10 digits." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        user = await User.create({
            fullName,
            email,
            mobile,
            role,
            password: hashedPassword,
        });

        // Generate token & set cookie
        const token = await genToken(user._id);
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

        return res.status(201).json(user);
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({
            message: "Signup failed",
            error: error.message,
        });
    }
};


// signIn controller
export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist." });
        }

        const isMatchedPassword = await bcrypt.compare(password, user.password);
        if (!isMatchedPassword) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const token = await genToken(user._id);
        res.cookie("token", token, {
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

        const { password: _, ...userData } = user._doc;
        return res.status(200).json(userData);
    } catch (error) {
        console.error("signIn error:", error);
        return res.status(500).json({ message: "Sign In failed", error: error.message });
    }
};


// logout controller
export const logOut = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({ message: "log Out successfully" })
    } catch (error) {
        return res.status(500).json(`log Out error ${error}`)
    }
}

// OTP send controller
export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist." });
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        user.resetOtp = otp
        user.otpExpires = Date.now() + 5 * 60 * 1000
        user.isOtpVerified = false
        await user.save()
        await sendOtpMail(email, otp)
        return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        return res.status(500).json(`otp send error ${error}`)
    }
}

// OTP verify controller
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        const user = await User.findOne({ email })
        if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "invalid/expired OTP" })
        }
        user.resetOtp = undefined
        user.otpExpires = undefined
        user.isOtpVerified = true
        await user.save()
        return res.status(200).json({ message: "OTP verified successfully" })
    } catch (error) {
        return res.status(500).json(`OTP verify error ${error}`)
    }
}

// reset Password controller
export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body
        const user = await User.findOne({ email })
        if (!user || !user.isOtpVerified) {
            return res.status(400).json({ message: "OTP verification required" })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        user.isOtpVerified = false
        await user.save()
        return res.status(200).json({ message: 'password reset successfully' })
    } catch (error) {
        res.status(500).json(`reset password error ${error}`)
    }
}

// google auth controller
export const googleAuth = async (req, res) => {
    try {
        const { email, fullName, mobile, role } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            // Agar signup fields nahi diye to error return karo
            if (!fullName || !mobile || !role) {
                return res
                    .status(400)
                    .json({ message: "User not found, please sign up first." });
            }

            // Agar fields diye gaye hain to new user create karo
            user = await User.create({ fullName, email, mobile, role });
        }

        const token = await genToken(user._id);
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: `googleAuth error: ${error}` });
    }
};
