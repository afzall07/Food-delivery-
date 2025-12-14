import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { TbCurrentLocation } from "react-icons/tb";
import { IoLocationSharp, IoSearchOutline } from "react-icons/io5";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "leaflet/dist/leaflet.css";
import { setAddress, setLocation } from "../redux/mapSlice";
import axios from "axios";
import { useEffect } from "react";
import { MdDeliveryDining } from "react-icons/md";
import { FaMobileScreenButton } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa";
import { addMyOrder } from "../redux/userSlice";

function RecenterMap({ location }) {
  if (location.lat && location.long) {
    const map = useMap();
    map.setView([location.lat, location.long], 15, { animate: true });
  }
  return null;
}

function CheckOut() {
  const { location, address } = useSelector((state) => state.map);
  const { cartItems, totalAmount } = useSelector((state) => state.user);
  const [addressInput, setAddressInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const apiKey = import.meta.env.VITE_GEOAPIKEY;
  const deliveryFee = totalAmount > 500 ? 0 : 50;
  const amountWithDeliveryFee = totalAmount + deliveryFee;

  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng;
    dispatch(setLocation({ lat, long: lng }));
    getAddressByLatLng(lat, lng);
  };

  const getAddressByLatLng = async (lat, lng) => {
    try {
      const location = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`
      );
      dispatch(setAddress(location?.data?.results[0].address_line2));
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      dispatch(setLocation({ lat: latitude, long: longitude }));
      getAddressByLatLng(latitude, longitude);
    });
  };

  const getLatLngByAddress = async () => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          addressInput
        )}&apiKey=${apiKey}`
      );
      const { lat, lon } = result?.data.features[0].properties;
      dispatch(setLocation({ lat, long: lon }));
    } catch (error) {
      console.log(error);
    }
  };

  // place order handler
  const handlePlaceOrder = async () => {
    try {
      const result = await axios.post(
        `http://localhost:7000/api/order/place-order`,
        {
          paymentMethod,
          deliveryAddress: {
            text: addressInput,
            latitude: location.lat,
            longitude: location.long,
          },
          totalAmount,
          cartItems,
        },
        { withCredentials: true }
      );
      dispatch(addMyOrder(result.data))
      navigate('/order-placed')
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setAddressInput(address);
  }, [address]);
  return (
    <div className="min-h-screen bg-[#fff9f6] flex items-center justify-center p-6">
      {/*back icon*/}
      <div
        className="absolute top-[20px] left-[20px] z-[10]"
        onClick={() => navigate("/")}
      >
        <IoIosArrowRoundBack
          size={35}
          className="text-[#ff4d2d] cursor-pointer"
        />
      </div>
      <div className="w-full max-w-[900px] bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
        {/*location section*/}
        <section>
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800">
            <IoLocationSharp className="text-[#ff4d2d]" />
            Delivery Location
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]"
              placeholder="Enter Your Location..."
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
            />
            <button
              className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex items-center justify-center cursor-pointer"
              onClick={getLatLngByAddress}
            >
              <IoSearchOutline size={17} />
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center cursor-pointer"
              onClick={getCurrentLocation}
            >
              <TbCurrentLocation size={17} />
            </button>
          </div>
          {/* map  */}
          <div className="map rounded-xl border overflow-hidden">
            <div className="h-64 w-full flex items-center justify-center">
              <MapContainer
                className={"w-full h-full"}
                center={
                  location?.lat && location?.long
                    ? [location.lat, location.long]
                    : [20.5937, 78.9629]
                }
                zoom={15}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap location={location} />
                {location?.lat && location?.long && (
                  <Marker
                    position={[location.lat, location.long]}
                    draggable
                    eventHandlers={{ dragend: onDragEnd }}
                  />
                )}
              </MapContainer>
            </div>
          </div>
        </section>

        {/* payment section  */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Payment method
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* cod */}
            <div
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition cursor-pointer ${paymentMethod === "cod"
                ? "border-[#ff4d2d] bg-orange-50 shadow"
                : "border-gray-200 hover:border-gray-300"
                }`}
              onClick={() => setPaymentMethod("cod")}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <MdDeliveryDining className="text-green-600 text-xl" />
              </span>
              <div>
                <p className="font-medium text-gray-800">Cash On Delivery</p>
                <p className="text-xs text-gray-500">
                  Pay when your food arrives
                </p>
              </div>
            </div>
            {/* online */}
            <div
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition cursor-pointer ${paymentMethod === "online"
                ? "border-[#ff4d2d] bg-orange-50 shadow"
                : "border-gray-200 hover:border-gray-300"
                }`}
              onClick={() => setPaymentMethod("online")}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <FaMobileScreenButton className="text-purple-700 text-lg" />
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <FaCreditCard className="text-blue-700 text-lg" />
              </span>
              <div>
                <p className="font-medium text-gray-800">
                  UPI / Credit / Debit Card
                </p>
                <p className="text-xs text-gray-500">Pay Securely Online</p>
              </div>
            </div>
          </div>
        </section>

        {/* order summary */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Order Summary
          </h2>
          <div className="rounded-xl border bg-gray-50 p-4 space-y-2">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-sm text-gray-700"
              >
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <hr className="border-gray-300 my-2" />
            <div className="flex justify-between font-medium text-gray-800">
              <span>Subtotal</span>
              {totalAmount}
            </div>
            <div className="flex justify-between font-medium text-gray-700">
              <span>Delivery Fee</span>
              <span>{deliveryFee == 0 ? "Free" : deliveryFee}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-[#ff4d2d] pt-2">
              <span>Total</span>
              <span>{amountWithDeliveryFee}</span>
            </div>
          </div>
        </section>
        <button
          className="w-full bg-[#ff4d2d] hover:bg-[#ff4d2d] text-white p-3 rounded-xl font-semibold cursor-pointer"
          onClick={handlePlaceOrder}
        >
          {paymentMethod == "cod" ? "Place Order" : "Pay & Place Order"}
        </button>
      </div>
    </div>
  );
}

export default CheckOut;
