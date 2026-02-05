import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import DeliveryBoyTracking from "./DeliveryBoyTracking";

function DeliveryBoy() {
  const { userData, socket } = useSelector(state => state.user);
  const [currentOrder, setCurrentOrder] = useState();
  const [availableAssignments, setAvailableAssignments] = useState(null)
  const [showOtpBox, setShowOtpBox] = useState(false)
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState({
    lat: null,
    lon: null
  })

  useEffect(() => {
    if (!socket || userData.role !== "deliveryBoy") return;
    let watchId;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition((position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        setDeliveryBoyLocation({
          lat: latitude,
          lon: longitude
        })
        socket.emit("updateLocation", {
          latitude,
          longitude,
          userId: userData._id
        });
      }),
        (error) => {
          console.log(`error ${error}`)
        },
      {
        enableHighAccuracy: true
      }
    };
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId)
    }
  }, [socket, userData])


  const getAssignments = async () => {
    try {
      setIsLoading(true)
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, { withCredentials: true })
      setAvailableAssignments(result.data)
    } catch (error) {
      console.log(`getAssignments error ${error}`)
    } finally {
      setIsLoading(false)
    }
  };

  const getCurrentOrder = async () => {
    try {
      setIsLoading(true)
      const result = await axios.get(`${serverUrl}/api/order/get-current-order`, { withCredentials: true })
      setCurrentOrder(result.data)
    } catch (error) {
      console.log(`getCurrentOrder error ${error}`)
    } finally {
      setIsLoading(false)
    }
  };
  const acceptOrder = async (assignmentId) => {
    try {
      setIsLoading(true)
      const result = await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`, { withCredentials: true })
      console.log(result.data)
      await getCurrentOrder()
    } catch (error) {
      console.log(`acceptOrder error ${error}`)
    } finally {
      setIsLoading(false)
    }
  };

  const sendOtp = async () => {
    try {
      setIsLoading(true)
      const result = await axios.post(`${serverUrl}/api/order/send-delivery-otp/`, { orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id }, { withCredentials: true })
      setShowOtpBox(true)
      console.log(result.data)

    } catch (error) {
      console.log(`sendOtp error ${error}`)
    } finally {
      setIsLoading(false)
    }
  };

  const verifyOtp = async () => {
    try {
      setIsLoading(true)
      const result = await axios.post(`${serverUrl}/api/order/verify-delivery-otp/`, { orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id, otp }, { withCredentials: true })
      console.log(result.data)
    } catch (error) {
      console.log(`verifyOtp error ${error}`)
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    getAssignments()
    getCurrentOrder()
  }, [userData])

  useEffect(() => {
    socket?.on("newAssignment", (data) => {
      if (data.sentTo == userData._id) {
        setAvailableAssignments(prev => [...prev, data])
      }
    });

    return () => {
      socket?.off("newAssignment")
    }
  }, [socket])


  return (
    <div className="flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">
      <Navbar />
      <div className="w-full max-w-[800px] flex flex-col gap-5 items-center mt-20 p-2">
        <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-start items-center w-full border border-orange-100 gap-2 text-center">
          <h1 className="text-xl font-bold text-[#ff4d2d]">Welcome, {userData.fullName}</h1>
          <p className="text-[#ff4d2d]"><span className="font-semibold">Latitude: </span>{deliveryBoyLocation?.lat},  <span className="font-semibold">Longitude: </span>{deliveryBoyLocation?.lon}</p>
        </div>
        {!currentOrder && <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
          <h1 className="text-lg font-bold mb-4 flex items-center gap-2">Available Orders</h1>
          <div className="space-y-4">
            {availableAssignments?.length > 0 ? (
              availableAssignments.map((a, i) => (
                <div className="border rounded-lg p-4 flex justify-between items-center" key={i}>
                  <div>
                    <p className="text-sm font-semibold">{a?.shopName}</p>
                    <p className="text-sm text-gray-500"><span className="font-semibold">Delivery Address: </span>{a?.deliveryAddress.text}</p>
                    <p className="text-xs text-gray-400">{a.items.length} items | ₹{a.subTotal}</p>
                  </div>
                  <button className="bg-orange-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-orange-600" onClick={() => acceptOrder(a.assignmentId)}>Accept</button>

                </div>
              ))
            ) : <p className="text-gray-400">No Available Orders</p>}
          </div>

        </div>}

        {currentOrder &&
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100 z-10">
            <h2 className="text-lg font-bold mb-3">📦 Current Order</h2>
            <div className="border rounded-lg p-4 mb-3">
              <p className="font-semibold text-sm">{currentOrder?.shopOrder.shop.name}</p>
              <p className="text-sm text-gray-500">{currentOrder.deliveryAddress.text}</p>
              <p className="text-xs text-gray-400">{currentOrder.shopOrder.shopOrderItems.length} items | ₹{currentOrder.shopOrder.subTotal}</p>
            </div>
            <DeliveryBoyTracking data={{
              deliveryBoyLocation: (deliveryBoyLocation.lat && deliveryBoyLocation.lon) ? deliveryBoyLocation : {
                lat: userData.location.coordinates[1],
                lon: userData.location.coordinates[0],
              },
              customerLocation: {
                lat: currentOrder.deliveryAddress.latitude,
                lon: currentOrder.deliveryAddress.longitude,
              },
            }} />
            {!showOtpBox ? <button className="mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200 cursor-pointer" onClick={sendOtp}>{isLoading ? "Loading..." : "Mark as Delivered"}</button> : <div className="mt-4 p-4 border rounded-xl bg-gray-50">
              <p className="text-sm font-semibold mb-2">Enter OTP send to <span className="text-[#ff4d2d]">{currentOrder.user.fullName}</span></p>
              <input type="text" className="w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} value={otp} />
              <button className="w-full bg-[#ff4d2d] text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all cursor-pointer" onClick={verifyOtp}>{isLoading ? "Loading..." : "Submit OTP"}</button>
            </div>}
          </div>}
      </div>
    </div>
  );
}

export default DeliveryBoy;
