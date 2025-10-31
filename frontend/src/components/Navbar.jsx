import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { FaLocationDot, FaPlus } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";
import { ImCross } from "react-icons/im";
import { IoCartOutline } from "react-icons/io5";
import { MdPendingActions } from "react-icons/md";
import logo from "../images/bg-removed-logo.png";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { userData, currentCity, cartItems } = useSelector(
    (state) => state.user
  );
  const { shopData } = useSelector((state) => state.owner);
  const [popUp, setPopUp] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await axios.get("http://localhost:7000/api/auth/logout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-20 flex items-center justify-between px-4 md:px-10 fixed top-0 right-0 z-50 bg-[#fff9f6] shadow-sm">
      {/* Toggle Search */}
      {showSearch && userData.role === "user" && (
        <div className="h-12 w-[90%] bg-white shadow-md rounded-lg fixed top-20 left-[5%] flex">
          {/* City */}
          <div className="flex items-center w-[30%] gap-2 px-3 border-r border-gray-300">
            <FaLocationDot className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff4d2d]" />
            <span className="truncate text-gray-600 text-xs sm:text-sm">
              {currentCity}
            </span>
          </div>
          {/* Search Input */}
          <div className="flex items-center w-[70%] gap-2 px-3">
            <IoMdSearch className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff4d2d]" />
            <input
              type="text"
              placeholder="Search delicious food..."
              className="w-full text-gray-700 text-xs sm:text-sm outline-none"
            />
          </div>
        </div>
      )}

      {/* Left: Logo */}
      <div>
        <img
          src={logo}
          alt="logo"
          className="w-24 sm:w-28 md:w-32 lg:w-36 object-contain"
        />
      </div>

      {/* Middle: Search (only for user, hidden on small screens) */}
      {userData.role === "user" && (
        <div className="hidden md:flex md:w-[55%] lg:w-[50%] h-12 bg-white shadow-md rounded-lg overflow-hidden">
          {/* City */}
          <div className="flex items-center w-[30%] gap-2 px-3 border-r border-gray-300">
            <FaLocationDot className="w-5 h-5 text-[#ff4d2d]" />
            <span className="truncate text-gray-600 text-sm">
              {currentCity}
            </span>
          </div>
          {/* Search Input */}
          <div className="flex items-center w-[70%] gap-2 px-3">
            <IoMdSearch className="w-5 h-5 text-[#ff4d2d]" />
            <input
              type="text"
              placeholder="Search delicious food..."
              className="w-full text-gray-700 text-sm outline-none"
            />
          </div>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-4 sm:gap-5">
        {userData.role === "user" &&
          (showSearch ? (
            <ImCross
              onClick={() => setShowSearch(false)}
              className="w-5 h-5 sm:w-6 sm:h-6 text-[#ff4d2d] md:hidden cursor-pointer"
            />
          ) : (
            <IoMdSearch
              className="w-6 h-6 sm:w-7 sm:h-7 text-[#ff4d2d] md:hidden cursor-pointer"
              onClick={() => setShowSearch(true)}
            />
          ))}

        {userData.role === "owner" ? (
          <>
            {/* Add Item */}
            {shopData && (
              <>
                <button
                  className="hidden md:flex gap-1 items-center cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d] px-2 py-1 text-xs sm:text-sm font-medium"
                  onClick={() => navigate("/add-item")}
                >
                  <FaPlus className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                  <span className="text-xs sm:text-sm lg:text-base">
                    Add Food Item
                  </span>
                </button>
                <button
                  className="md:hidden text-[#ff4d2d] cursor-pointer"
                  onClick={() => navigate("/add-item")}
                >
                  <FaPlus className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}

            {/* Pending Orders */}
            <div className="hidden md:flex items-center gap-1 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d] px-2 py-1 text-xs sm:text-sm font-medium relative">
              <MdPendingActions className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              <span className="text-xs sm:text-sm lg:text-base">
                Pending Orders
              </span>
              <span className="absolute -right-2 -top-2 text-[10px] sm:text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-[5px] py-[1px]">
                0
              </span>
            </div>
            <div className="md:hidden relative text-[#ff4d2d]">
              <MdPendingActions className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer" />
              <span className="absolute -right-2 -top-2 text-[10px] sm:text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-[5px] py-[1px]">
                0
              </span>
            </div>
          </>
        ) : (
          <>
            {/* Cart */}
            {userData.role === "user" && (
              <div
                className="relative cursor-pointer"
                onClick={() => navigate("/cart")}
              >
                <IoCartOutline className="w-6 h-6 sm:w-7 sm:h-7 text-[#ff4d2d]" />
                <span className="absolute -right-2 -top-2 text-[10px] sm:text-xs font-bold text-[#ff4d2d]">
                  {cartItems.length}
                </span>
              </div>
            )}

            {/* Orders */}
            <button className="hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-xs sm:text-sm font-medium">
              My Orders
            </button>
          </>
        )}

        {/* Profile */}
        <div
          className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-[#ff4d2d] text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl cursor-pointer"
          onClick={() => setPopUp((prev) => !prev)}
        >
          {userData?.fullName?.slice(0, 1).toUpperCase()}
        </div>

        {/* Pop-Up */}
        {popUp && (
          <div className="pop-up fixed top-[80px] right-[20px] md:right-[10%] lg:right-[3%] w-[180px] bg-white shadow-2xl rounded-xl p-[20px] flex flex-col gap-2 z-[9999]">
            <div className="text-[15px] sm:text-[16px] md:text-[17px] font-semibold">
              {userData.fullName.charAt(0).toUpperCase() +
                userData.fullName.slice(1)}
            </div>
            {userData.role == "user" && (
              <div className="md:hidden text-[#ff4d2d] font-semibold cursor-pointer">
                My Orders
              </div>
            )}

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
