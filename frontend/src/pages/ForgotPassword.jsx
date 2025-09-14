import React, { useState, useEffect } from "react";
import logo from "../images/bg-removed-logo.png";
import { IoArrowBack } from "react-icons/io5";
import { data, useNavigate } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setSuccess("");
    setError("");
  }, [step]);
  // handle send otp
  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        "http://localhost:7000/api/auth/send-otp",
        {
          email,
        },
        { withCredentials: true }
      );
      console.log(result.data.message);
      setSuccess(result.data.message || "✅ Otp sent successfully");
      setLoading(false);
      setTimeout(() => {
        setStep(2);
      }, 3000);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  // handle verify otp
  const handleVerfyOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        "http://localhost:7000/api/auth/verify-otp",
        {
          email,
          otp,
        },
        { withCredentials: true }
      );
      console.log(result.data.message);
      setSuccess(result.data.message || "✅ OTP verified successfully");
      setLoading(false);
      setTimeout(() => {
        setStep(3);
      }, 3000);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "invalid Otp");
      setLoading(false);
    }
  };

  // handle reset password
  const handleResetPassword = async () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!passwordRegex.test(newPassword)) {
      setError(
        "⚠️ Password must have 6+ chars, include uppercase, lowercase, number & symbol"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("⚠️ Password and Confirm Password do not match");
      return;
    }
    setLoading(true);
    try {
      const result = await axios.post(
        "http://localhost:7000/api/auth/reset-password",
        {
          email,
          newPassword,
        },
        { withCredentials: true }
      );
      console.log(result.data.message);
      setSuccess(result.data.message || "✅ Password changed successfully!");
      setNewPassword("");
      setConfirmPassword("");
      setLoading(false);
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="logo flex items-center justify-center mb-6">
          <img src={logo} alt="logo" className=" w-40 " />
        </div>
        <div className="flex items-center gap-4 mb-6">
          <IoArrowBack
            size={20}
            className="text-[#ff4d2d] cursor-pointer"
            onClick={() => navigate("/signin")}
          />
          <h1 className="text-[#ff4d2d] text-l font-bold text-center">
            Forgot Password
          </h1>
        </div>
        {step == 1 && (
          <div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full border-[1px] border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Enter your email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                value={email}
              />
              {error && <p className="text-red-600">{error}</p>}
              {success && <p className="text-green-600">{success}</p>}
            </div>

            <button
              className={`w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`}
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Send OTP"}
            </button>
          </div>
        )}
        {step == 2 && (
          <div>
            <div className="mb-4">
              <label
                htmlFor="otp"
                className="block text-gray-700 font-medium mb-1"
              >
                OTP
              </label>
              <input
                type="text"
                id="otp"
                className="w-full border-[1px] border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Enter your OTP"
                onChange={(e) => {
                  setOtp(e.target.value);
                }}
                value={otp}
              />
              <div className="flex justify-between">
                {error && <p className="text-red-600">{error}</p>}
                {success && <p className="text-green-600">{success}</p>}
              </div>
            </div>
            <button
              className={`w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`}
              onClick={handleVerfyOtp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Verify"}
            </button>
          </div>
        )}
        {step == 3 && (
          <div>
            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="block text-gray-700 font-medium mb-1"
              >
                New Password
              </label>
              <input
                type="text"
                id="newPassword"
                className="w-full border-[1px] border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Enter New Password"
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                value={newPassword}
              />
              {error && <p className="text-red-600">{error}</p>}
              {success && <p className="text-green-600">{success}</p>}
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-medium mb-1"
              >
                Confirm Password
              </label>
              <input
                type="text"
                id="confirmPassword"
                className="w-full border-[1px] border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Confirm Password"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                value={confirmPassword}
              />
            </div>
            <button
              className={`w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`}
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ClipLoader size={20} color="white" />
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
