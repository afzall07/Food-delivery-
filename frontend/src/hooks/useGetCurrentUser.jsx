import React, { useEffect } from "react";
import axios from "axios";

function useGetCurrentUser() {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(
          "http://localhost:7000/api/user/current",
          { withCredentials: true }
        );
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);
}

export default useGetCurrentUser;
