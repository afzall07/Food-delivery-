import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setShopData } from "../redux/ownerSlice";

function useGetShop() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await axios.get(
          "http://localhost:7000/api/shop/get-my",
          {
            withCredentials: true,
          }
        );
        dispatch(setShopData(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchShop();
  }, []);
}

export default useGetShop;
