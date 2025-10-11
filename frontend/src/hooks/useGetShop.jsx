import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setShopData } from "../redux/ownerSlice";

function useGetShop() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
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
  }, [userData]);
}

export default useGetShop;
