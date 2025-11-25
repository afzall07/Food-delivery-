import React from 'react'
import { MdPhone } from "react-icons/md"
import { FaMapMarkerAlt } from "react-icons/fa";
import { CgMail } from "react-icons/cg";

function OwnerOrderCard({ data }) {
  return (
    <div className='bg-white rounded-lg shadow p-4 space-y-4'><div>
      <h2 className='text-2xl font-semibold text-gray-800 mb-1'>{data.user.fullName}</h2>
      <p className="flex items-center gap-2 text-gray-600 "><CgMail size={20} />
        <span>{data.user.email}</span></p>
      <p className="flex items-center gap-2 text-gray-600 mt-1"><MdPhone size={20} />
        <span>{data.user.mobile}</span></p>
    </div>
      <div className="flex items-start flex-col gap-2 text-gray-600">
        <p className="flex items-center gap-2 text-gray-600"><FaMapMarkerAlt size={20} />
          <span>{data?.deliveryAddress?.text}</span></p>
        <p className=" to-gray-500">Lat: {data?.deliveryAddress.latitude}, Lon: {data?.deliveryAddress.longitude}</p>
      </div>
      <div className='flex space-x-4 overflow-x-auto pb-2'>
        {data.shopOrders.shopOrderItems.map((item, i) => (
          <div key={i} className='flex-shrink-0 w-40 border rounded-lg p-2 bg-white'>
            <img src={item.item.image} alt="" className='w-full h-24 object-cover rounded' />
            <p className="text-sm font-semibold mt-1 text-center">{item.name}</p>
            <p className="text-xs text-gray-600">Qty: {item.quantity} x &#8377;{item.price}</p>
          </div>
        ))}
      </div>
      <div className='flex justify-between items-center mt-auto pt-3 border-t border-gray-100'>
        <span className='text-sm'>Status: <span className='font-semibold capitalize text-[#ff4d2d]'>{data.shopOrders.status}</span></span>
        <select name="" id="" value={data.shopOrders.status} className='rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 border-[#ff4d2d] text-[#ff4d2d]'>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="out of delivery">Out of Delivery</option>
        </select>
      </div>
      <div className='text-right font-bold text-gray-800 text-sm'>Total: ₹{ data.shopOrders.subTotal}</div>
    </div>
  )
}

export default OwnerOrderCard