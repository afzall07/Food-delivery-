import { useEffect } from "react";
import { useSelector } from "react-redux";
import UserDashboard from "../components/UserDashboard";
import OwnerDashboard from "../components/OwnerDashboard";
import DeliveryBoy from "../components/DeliveryBoy";

function Home() {
  useEffect(() => {
    document.title = "KhaoPio - Home";
  }, []);
  const { userData } = useSelector((state) => state.user);
  return (
    <div className="w-[100vw] min-h-[100vh] p-[50px] flex flex-col  bg-[#fff9f6]">
      {userData.role == "user" && <UserDashboard />}
      {userData.role == "owner" && <OwnerDashboard />}
      {userData.role == "deliveryBoy" && <DeliveryBoy />}
    </div>
  );
}

export default Home;
