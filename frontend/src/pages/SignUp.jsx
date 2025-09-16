import { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../images/bg-removed-logo.png";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firbase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function SignUp() {
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  // handleSignUp
  const handleSignUp = async () => {
    // clear old errors
    setSignUpError("");
    setFullNameError("");
    setEmailError("");
    setMobileError("");
    setPasswordError("");
    // all fields empty
    if (!fullName && !email && !mobile && !password) {
      setSignUpError("⚠️ All fields are required");
      return;
    }
    // Name validation
    if (!fullName.trim()) {
      setFullNameError("⚠️ Full name is required");
      return;
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("⚠️ Email is required");
      return;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError("⚠️ Enter a valid email address");
      return;
    }
    // Mobile validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobile.trim()) {
      setMobileError("⚠️ Mobile number is required");
      return;
    } else if (!mobileRegex.test(mobile.trim())) {
      setMobileError("⚠️ Mobile number must be exactly 10 digits");
      return;
    }
    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!password.trim()) {
      setPasswordError("⚠️ Password is required");
      return;
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        "⚠️ Password must have 6+ chars, include uppercase, lowercase, number & symbol"
      );
      return;
    }
    setLoading(true);
    try {
      // API call
      const result = await axios.post(
        "http://localhost:7000/api/auth/signup",
        {
          fullName: fullName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          password,
          role,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));

      setLoading(false);
    } catch (error) {
      console.error("Signup error:", error);
      setSignUpError(error.response?.data?.message || "Signup failed");
      setLoading(false);
    }
  };

  // handleGoogleAuth
  const handleGoogleAuth = async () => {
    // Mobile validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobile.trim()) {
      return setMobileError("⚠️ Mobile number is required");
    } else if (!mobileRegex.test(mobile.trim())) {
      return setMobileError("⚠️ Mobile number must be exactly 10 digits");
    }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    try {
      const { data } = await axios.post(
        "http://localhost:7000/api/auth/google-auth",
        {
          fullName: result.user.displayName,
          email: result.user.email,
          role,
          mobile,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(data));
      setPasswordError("");
    } catch (error) {
      console.log(error.response?.data?.message);
      setSignUpError(error.response?.data?.message);
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
        <p className="text-gray-600 text-center font-bold">
          Create your account
        </p>
        <p
          className="text-gray-600 text-center font-semibold my-2"
          style={{ fontSize: "13px" }}
        >
          Sign up to get started.
        </p>
        {/* fullName */}
        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-gray-700 font-medium mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            placeholder="Enter your full name"
            style={{ border: `1px solid ${borderColor}` }}
            onChange={(e) => {
              setFullName(e.target.value);
              setFullNameError("");
            }}
            value={fullName}
            required
          />
          <span className="name-error  text-red-600">{fullNameError}</span>
        </div>
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
              setEmailError("");
            }}
            value={email}
            required
          />
          <span className="email-error  text-red-600">{emailError}</span>
        </div>
        {/* mobile */}
        <div className="mb-4">
          <label
            htmlFor="mobile"
            className="block text-gray-700 font-medium mb-1"
          >
            Mobile
          </label>
          <input
            type="text"
            id="mobile"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            placeholder="Enter your number"
            style={{ border: `1px solid ${borderColor}` }}
            onChange={(e) => {
              setMobile(e.target.value);
              setMobileError("");
            }}
            value={mobile}
            required
          />
          <span className="mobile-error  text-red-600">{mobileError}</span>
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
                setPasswordError("");
              }}
              value={password}
              required
            />
            <span className="password-error  text-red-600">
              {passwordError}
            </span>
            <button
              className="absolute right-3 top-[14px] text-gray-500 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {!showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
        </div>
        {/* role */}
        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-gray-700 font-medium mb-1"
          >
            Role
          </label>
          <div className="flex gap-2">
            {["user", "owner", "deliveryBoy"].map((r) => (
              <button
                className="flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors cursor-pointer"
                onClick={() => setRole(r)}
                style={
                  role == r
                    ? { backgroundColor: primaryColor, color: "white" }
                    : {
                        border: `1px solid ${primaryColor}`,
                        color: primaryColor,
                      }
                }
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <button
          className={`w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`}
          onClick={handleSignUp}
          disabled={loading}
        >
          {" "}
          {loading ? <ClipLoader size={20} color="white" /> : "Sign Up"}
        </button>
        <p className="signup-error text-red-600 text-center mt-2">
          {signUpError}
        </p>
        <div className="text-center mt-2 " style={{ fontSize: "13px" }}>
          ----------------------------- OR ------------------------------
        </div>
        <button
          className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 cursor-pointer hover:bg-gray-200"
          onClick={handleGoogleAuth}
        >
          <FcGoogle size={20} />
          <span>Continue with Google</span>
        </button>
        <p className="text-center mt-5">
          Already have an account ?{" "}
          <span
            className="text-[#ff4d2d] cursor-pointer"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
