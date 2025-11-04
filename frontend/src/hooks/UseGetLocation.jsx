import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentAddress,
  setCurrentCity,
  setCurrentState,
  setUserData,
} from "../redux/userSlice";
import { setAddress, setLocation } from "../redux/mapSlice";

function UseGetLocation() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const apiKey = import.meta.env.VITE_GEOAPIKEY;
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      dispatch(setLocation({ lat: latitude, long: longitude }));
      const location = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
      );
      dispatch(setCurrentCity(location?.data.results[0].city));
      dispatch(setCurrentState(location?.data.results[0].state));
      dispatch(
        setCurrentAddress(
          location?.data.results[0].address_line2 ||
            location?.data.results[0].address_line1
        )
      );
      dispatch(setAddress(location?.data.results[0].address_line2));
    });
  }, [userData]);
}

export default UseGetLocation;
