import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";

function DeliveryBoy() {
  const { userData } = useSelector(state => state.user)
  const getAssignments = async (params) => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, { withCredentials: true })
      console.log(result.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getAssignments()
  }, [userData])

  return <div className="flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">
    <Navbar />
    <div className="w-full max-w-[800px] flex flex-col gap-5 items-center mt-20 p-2">
      <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-start items-center w-full border border-orange-100 gap-2 text-center">
        <h1 className="text-xl font-bold text-[#ff4d2d]">Welcome, {userData.fullName}</h1>
        <p className="text-[#ff4d2d]"><span className="font-semibold">Latitude:</span>{userData.location.coordinates[1]},  <span className="font-semibold">Longitude:</span>{userData.location.coordinates[0]}</p>
      </div>
    </div>
  </div>;
}

export default DeliveryBoy;
