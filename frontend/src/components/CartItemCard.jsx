import React from "react";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";

function CartItemCard({ data }) {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow border">
      {/* left-section */}
      <div className="flex items-center gap-4 ">
        <img
          src={data.image}
          alt=""
          className="w-20 h-20 object-cover rounded-lg border"
        />
        <div>
          <h1 className="font-medium text-gray-800">{data.name}</h1>
          <p className="text-sm text-gray-500">
            ₹{data.price} x {data.quantity}
          </p>
          <p className="font-bold text-gray-900">
            ₹{data.price * data.quantity}
          </p>
        </div>
      </div>
      {/* right-section */}
      <div className="flex items-center gap-3">
        <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer">
          <FaMinus size={12} />
        </button>
        <span>{data.quantity}</span>
        <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer">
          <FaPlus size={12} />
        </button>
        <button className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 cursor-pointer">
          <FaRegTrashAlt size={17} />
        </button>
      </div>
    </div>
  );
}

export default CartItemCard;
