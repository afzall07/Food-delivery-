import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setShopData } from "../redux/ownerSlice";
import { serverUrl } from "../App";

function useGetShop() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/shop/get-my`,
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
  }, [dispatch, userData]);
}

export default useGetShop;
