import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMyOrders, setLoading } from "../redux/userSlice";
import { serverUrl } from "../App";

function useGetMyOrders() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch(setLoading({ key: 'orders', value: true }));
        const result = await axios.get(
          `${serverUrl}/api/order/my-orders`,
          {
            withCredentials: true,
          }
        );
        dispatch(setMyOrders(result.data));
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(setLoading({ key: 'orders', value: false }));
      }
    };
    fetchOrders();
  }, [dispatch, userData]);
}

export default useGetMyOrders;
