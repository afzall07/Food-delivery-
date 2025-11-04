import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { TbCurrentLocation } from "react-icons/tb";
import { IoLocationSharp, IoSearchOutline } from "react-icons/io5";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "leaflet/dist/leaflet.css";
import { setLocation } from "../redux/mapSlice";

function RecenterMap({ location }) {
  if (location.lat && location.long) {
    const map = useMap();
    map.setView([location.lat, location.long], 15, { animate: true });
  }
  return null;
}

function CheckOut() {
  const { location, address } = useSelector((state) => state.map);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onDragEnd = (e) => {
    console.log(e.target._latlng);
    const { lat, lng } = e.target._latlng;
    dispatch(setLocation({ lat, long: lng }));
  };
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
              value={address}
            />
            <button className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex items-center justify-center">
              <IoSearchOutline size={17} />
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center">
              <TbCurrentLocation size={17} />
            </button>
          </div>
          {/* map  */}
          <div className="map rounded-xl border overflow-hidden">
            <div className="h-64 w-full flex items-center justify-center">
              <MapContainer
                className={"w-full h-full"}
                center={[location?.lat, location?.long]}
                zoom={15}
              >
                {" "}
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap location={location} />
                <Marker
                  position={[location?.lat, location?.long]}
                  draggable
                  eventHandlers={{ dragend: onDragEnd }}
                ></Marker>
              </MapContainer>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default CheckOut;
