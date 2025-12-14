import React, { useEffect, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";


function useUpdateLocation() {
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user);
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
        const updateLocation = async (lat, long) => {
            try {
                const result = await axios.post(`${serverUrl}/api/user/update-location`, { lat, long }, { withCredentials: true });
                console.log("Location update success:", result.data);
            } catch (error) {
                const status = error.response ? error.response.status : 'N/A';
                const message = error.response ? error.response.data : error.message;
                console.error(`Server Error (${status}) while updating location:`, message);
            }
        };

        let watchId;

        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    updateLocation(pos.coords.latitude, pos.coords.longitude)
                },
                handleGeoLocationError,
                {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 27000,
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }

        // 3. Cleanup function: कंपोनेंट अनमाउंट होने पर watchPosition को बंद करें
        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };

    }, [userData, dispatch, handleGeoLocationError]); // Dependency array में handleGeoLocationError जोड़ा गया

    // Hook कुछ भी रेंडर नहीं करता, इसलिए null रिटर्न करना वैकल्पिक है
    return null;
}

export default useUpdateLocation;