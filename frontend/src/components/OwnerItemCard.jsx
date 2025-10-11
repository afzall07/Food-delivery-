import axios from "axios";
import React from "react";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setShopData } from "../redux/ownerSlice";

function OwnerItemCard({ data }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleDelete = async () => {
    try {
      const result = await axios.get(
        `http://localhost:7000/api/item/delete/${data._id}`,
        { withCredentials: true }
      );
      dispatch(setShopData(result.data));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex bg-white rounded-lg shadow-md overflow-hidden border border-[#ff4d2d] w-full max-w-2xl">
      <div className="w-36 flex-shrink-0 bg-gray-50">
        <img src={data.image} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col justify-between p-3 flex-1">
        <div className="item-details">
          <h2 className="text-xl font-semibold text-[#ff4d2d] ">
            {data.name[0].toUpperCase() + data.name.slice(1)}
          </h2>
          <p>
            <span className="font-medium text-gray-70">Category:</span>{" "}
            {data.category}
          </p>
          <p>
            <span className="font-medium text-gray-70">Food Type:</span>{" "}
            {data.foodType}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="text-[#ff4d2d] font-bold">&#8377;{data.price}</div>
          <div className="flex items-center gap-2">
            <div
              className="  p-2 rounded-full hover:bg-[#ff4d2d]/10 text-[#ff4d2d] cursor-pointer"
              onClick={() => navigate(`/edit-item/${data._id}`)}
            >
              <FaPen size={17} />
            </div>
            <div
              className="  p-2 rounded-full hover:bg-[#ff4d2d]/10 text-[#ff4d2d] cursor-pointer"
              onClick={handleDelete}
            >
              <FaTrashAlt size={17} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerItemCard;
