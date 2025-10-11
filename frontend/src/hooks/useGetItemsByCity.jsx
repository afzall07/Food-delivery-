import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setShopsInMyCity,
  setUserData,
  setItemsInMyCity,
} from "../redux/userSlice";

function useGetItemsByCity() {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchItems = async () => {
      if (!currentCity) {
        return;
      }
      try {
        const result = await axios.get(
          `http://localhost:7000/api/item/get-by-city/${currentCity}`,
          { withCredentials: true }
        );
        // const itemsArray = Array.isArray(result.data)
        //   ? result.data
        //   : [result.data];
        dispatch(setItemsInMyCity(result.data));
        // console.log("API Result:", itemsArray);
      } catch (error) {
        console.log(error);
      }
    };
    fetchItems();
  }, [currentCity, dispatch]);
  return null;
}

export default useGetItemsByCity;
