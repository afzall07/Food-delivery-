import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function useGetCurrentUser() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(
          "http://localhost:7000/api/user/current",
          { withCredentials: true }
        );
        dispatch(setUserData(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);
}

export default useGetCurrentUser;
