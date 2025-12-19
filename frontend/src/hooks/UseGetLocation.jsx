// import React, { useEffect } from "react";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setCurrentAddress,
//   setCurrentCity,
//   setCurrentState,
//   setUserData,
// } from "../redux/userSlice";
// import { setAddress, setLocation } from "../redux/mapSlice";

// function UseGetLocation() {
//   const dispatch = useDispatch();
//   const { userData } = useSelector((state) => state.user);
//   const apiKey = import.meta.env.VITE_GEOAPIKEY;
//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(async (position) => {
//       const latitude = position.coords.latitude;
//       const longitude = position.coords.longitude;
//       dispatch(setLocation({ lat: latitude, long: longitude }));
//       const location = await axios.get(
//         `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
//       );
//       dispatch(setCurrentCity(location?.data.results[0].city));
//       dispatch(setCurrentState(location?.data.results[0].state));
//       dispatch(
//         setCurrentAddress(
//           location?.data.results[0].address_line2 ||
//             location?.data.results[0].address_line1
//         )
//       );
//       dispatch(setAddress(location?.data.results[0].address_line2));
//     });
//   }, [userData]);
// }

// export default UseGetLocation;

import React, { useEffect, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentAddress,
  setCurrentCity,
  setCurrentState,
} from "../redux/userSlice";
import { setAddress, setLocation } from "../redux/mapSlice";

function UseGetLocation() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const apiKey = import.meta.env.VITE_GEOAPIKEY;
  const handleGeoLocationError = (error) => {
    let errorMessage = "Geolocation error occurred.";
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "User denied the request for Geolocation. Please allow location access.";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        errorMessage = "The request to get user location timed out.";
        break;
      default:
        errorMessage = `An unknown geolocation error occurred: ${error.message}`;
    }
    console.error("Geolocation Error:", errorMessage);
  };

  useEffect(() => {
    if (!apiKey) {
      console.error("VITE_GEOAPIKEY is not defined.");
      return;
    }

    const fetchLocationData = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      dispatch(setLocation({ lat: latitude, long: longitude }));
      try {
        const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`;

        axios.get(url)
          .then((response) => {
            const result = response.data.results[0];
            if (result) {
              dispatch(setCurrentCity(result.city || result.county));
              dispatch(setCurrentState(result.state));
              dispatch(
                setCurrentAddress(
                  result.address_line2 || result.address_line1
                )
              );
              dispatch(setAddress(result.address_line2));
            } else {
              console.warn("Geoapify: No reverse geocoding results found.");
            }
            // console.log("Geoapify Result:", result)
          })
          .catch((axiosError) => {
            console.error("Geoapify API Error:", axiosError.message);
          });

      } catch (error) {
        console.error("General API Fetch Error:", error);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        fetchLocationData,
        handleGeoLocationError,
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 30000
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

  }, [userData, dispatch, apiKey]);

  // Hook कुछ भी रेंडर नहीं करता, इसलिए null रिटर्न करना वैकल्पिक है
  return null;
}

export default UseGetLocation;