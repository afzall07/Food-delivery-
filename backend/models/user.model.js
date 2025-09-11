import mongoose from "mongoose"
const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    mobile: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        enum: ["user", "owner", "deliveryBoy"],
        required: true
    },
    resetOtp: {
        type: String,
    },
    isOtpVarified: {
        type: Boolean,
        default: false
    },
    otpExpires: {
        type: Date
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema)
export default User