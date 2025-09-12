import React, { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../images/bg-removed-logo.png";

function SignIn() {
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // handleSignUp
  const handleSignIn = async () => {
    // Validation
    try {
      // API call
      const result = await axios.post(
        "http://localhost:7000/api/auth/signin",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      console.log(result.data);
    } catch (error) {
      console.error("Signin error:", error);
      setError(error.response?.data?.message || "Signin failed");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8`}
        style={{ border: `1px solid ${borderColor}` }}
      >
        <div className="brand-logo flex items-center justify-center mb-5">
          <img src={logo} alt="brand-logo" style={{ width: "200px" }} />
        </div>
        <p
          className="text-gray-600 text-center font-semibold my-2"
          style={{ fontSize: "13px" }}
        >
          Sign In to your account.
        </p>

        {/* email */}
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
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            placeholder="Enter your email"
            style={{ border: `1px solid ${borderColor}` }}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            value={email}
          />
          {/* <span className="error  text-red-600">{error}</span> */}
        </div>

        {/* password */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={`${showPassword ? "text" : "password"}`}
              id="password"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none"
              placeholder="Create a strong password"
              style={{ border: `1px solid ${borderColor}` }}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              value={password}
            />
            <span className="error  text-red-600">{error}</span>
            <button
              className="absolute right-3 top-[14px] text-gray-500 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {!showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
          {/* <span className="error  text-red-600">{error}</span> */}
        </div>
        <div className="text-right mb-4">
          <button
            className="cursor-pointer  text-[#ff4d2d] font-medium"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </button>
        </div>
        <button
          className={`w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`}
          onClick={handleSignIn}
        >
          Sign In
        </button>

        <div className="text-center mt-2 " style={{ fontSize: "13px" }}>
          ----------------------------- OR ------------------------------
        </div>
        <button className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 cursor-pointer hover:bg-gray-200">
          <FcGoogle size={20} />
          <span>Continue with Google</span>
        </button>
        <p className="text-center mt-5">
          don't have an account ?{" "}
          <span
            className="text-[#ff4d2d] cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
