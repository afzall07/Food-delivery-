import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMyOrders } from "../redux/userSlice";

function useGetMyOrders() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await axios.get(
          "http://localhost:7000/api/order/my-orders",
          {
            withCredentials: true,
          }
        );
        dispatch(setMyOrders(result.data));
        // console.log(result.data)
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrders();
  }, [dispatch, userData]);
}

export default useGetMyOrders;
