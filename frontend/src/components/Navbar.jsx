import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";
import logo from "../images/bg-removed-logo.png";
import { IoCartOutline } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Navbar() {
  const { userData, city } = useSelector((state) => state.user);
  const [popUp, setPopUp] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const dispatch = useDispatch();
  const handleLogOut = async () => {
    try {
      const result = await axios.get("http://localhost:7000/api/auth/logout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full h-20 flex items-center justify-between px-4 md:px-10 fixed top-0 right-0 z-50 bg-[#fff9f6] shadow-sm">
      {/* Toggle Search*/}
      {showSearch && (
        <div className="h-12 w-[90%] bg-white shadow-md rounded-lg fixed top-20 left-[5%] flex">
          {/* City */}
          <div className="flex items-center w-[30%] gap-2 px-3 border-r border-gray-300">
            <FaLocationDot size={18} className="text-[#ff4d2d]" />
            <span className="truncate text-gray-600 text-sm">{city}</span>
          </div>
          {/* Search Input */}
          <div className="flex items-center w-[70%] gap-2 px-3">
            <IoMdSearch size={20} className="text-[#ff4d2d]" />
            <input
              type="text"
              placeholder="Search delicious food..."
              className="w-full text-gray-700 text-sm outline-none"
            />
          </div>
        </div>
      )}
      {/* Left: Logo */}
      <div>
        <img src={logo} alt="logo" className="w-24 md:w-32" />
      </div>
      {/* Middle: Search (hidden on small screens) */}
      <div className="hidden md:flex md:w-[55%] lg:w-[50%] h-12 bg-white shadow-md rounded-lg overflow-hidden">
        {/* City */}
        <div className="flex items-center w-[30%] gap-2 px-3 border-r border-gray-300">
          <FaLocationDot size={18} className="text-[#ff4d2d]" />
          <span className="truncate text-gray-600 text-sm">{city}</span>
        </div>
        {/* Search Input */}
        <div className="flex items-center w-[70%] gap-2 px-3">
          <IoMdSearch size={20} className="text-[#ff4d2d]" />
          <input
            type="text"
            placeholder="Search delicious food..."
            className="w-full text-gray-700 text-sm outline-none"
          />
        </div>
      </div>

      {/* Right: Cart + Orders + Profile */}
      <div className="flex items-center gap-5 md:gap-7">
        {showSearch ? (
          <ImCross
            onClick={() => setShowSearch(false)}
            className="text-[#ff4d2d] md:hidden cursor-pointer"
          />
        ) : (
          <IoMdSearch
            size={25}
            className="text-[#ff4d2d] md:hidden cursor-pointer"
            onClick={() => setShowSearch(true)}
          />
        )}

        {/* Cart */}
        <div className="relative cursor-pointer">
          <IoCartOutline size={25} className="text-[#ff4d2d]" />
          <span className="absolute -right-2 -top-2 text-xs font-bold text-[#ff4d2d]">
            0
          </span>
        </div>

        {/* Orders (only md+) */}
        <button className="hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium">
          My Orders
        </button>

        {/* Profile Circle */}
        <div
          className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#ff4d2d] text-white font-bold text-sm md:text-lg cursor-pointer"
          onClick={() => setPopUp((prev) => !prev)}
        >
          {userData?.fullName?.slice(0, 1).toUpperCase()}
        </div>
        {/* Pop-Up */}
        {popUp && (
          <div className="pop-up fixed top-[80px] right-[20px] md:right-[10%] lg:right-[3%] w-[180px] bg-white shadow-2xl rounded-xl p-[20px] flex flex-col gap-2 z-[9999]">
            <div className="text-[17px] font-semibold">
              {userData.fullName.charAt(0).toUpperCase() +
                userData.fullName.slice(1)}
            </div>
            <div className="md:hidden text-[#ff4d2d] font-semibold cursor-pointer">
              My Orders
            </div>
            <div
              className="text-[#ff4d2d] font-semibold cursor-pointer"
              onClick={handleLogOut}
            >
              Log Out
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
