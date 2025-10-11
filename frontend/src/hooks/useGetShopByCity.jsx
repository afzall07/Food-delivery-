import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setShopsInMyCity, setUserData } from "../redux/userSlice";

function useGetShopByCity() {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchShop = async () => {
      if (!currentCity) {
        return;
      }
      try {
        const result = await axios.get(
          `http://localhost:7000/api/shop/get-by-city/${currentCity}`,
          { withCredentials: true }
        );
        const shopsArray = Array.isArray(result.data)
          ? result.data
          : [result.data];

        dispatch(setShopsInMyCity(shopsArray));
        // console.log("API Result:", shopsArray);
      } catch (error) {
        console.log(error);
      }
    };
    fetchShop();
  }, [currentCity, dispatch]);
  return null;
}

export default useGetShopByCity;
