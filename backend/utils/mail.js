import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465, // gmail port
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
});


export const sendOtpMail = async (to, otp) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to,
            subject: "Reset Your Password",
            html: `<p>Your OTP for password reset is <b>${otp}</b>. It expires in 5 minutes.</p>`,
        });
        console.log("✅ OTP mail sent to", to);
    } catch (error) {
        console.error("❌ OTP send error:", error);
        throw error; // taaki frontend ko pata chale
    }
};