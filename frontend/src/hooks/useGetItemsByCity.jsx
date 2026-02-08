import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setShopsInMyCity,
  setUserData,
  setItemsInMyCity,
  setLoading,
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
        dispatch(setLoading({ key: 'items', value: true }));
        const result = await axios.get(
          `http://localhost:7000/api/item/get-by-city/${currentCity}`,
          { withCredentials: true }
        );
        dispatch(setItemsInMyCity(result.data));
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(setLoading({ key: 'items', value: false }));
      }
    };
    fetchItems();
  }, [currentCity, dispatch]);
  return null;
}

export default useGetItemsByCity;
