import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setShopsInMyCity, setLoading } from "../redux/userSlice";
import { serverUrl } from "../App";

function useGetShopByCity() {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchShop = async () => {
      if (!currentCity) {
        return;
      }
      try {
        dispatch(setLoading({ key: 'shops', value: true }));
        const result = await axios.get(
          `${serverUrl}/api/shop/get-by-city/${currentCity}`,
          { withCredentials: true }
        );
        const shopsArray = Array.isArray(result.data)
          ? result.data
          : [result.data];

        dispatch(setShopsInMyCity(shopsArray));
        // console.log("API Result:", shopsArray);
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(setLoading({ key: 'shops', value: false }));
      }

    };
    fetchShop();
  }, [currentCity, dispatch]);
  return null;
}

export default useGetShopByCity;
