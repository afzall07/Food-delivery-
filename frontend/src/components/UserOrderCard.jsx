import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App';
import { FaStar } from 'react-icons/fa';

function UserOrderCard({ data }) {
    const navigate = useNavigate()
    const [selectedRating, setSelectedRating] = useState({}) //itemId:rating
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-GB', {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const handleRating = async (itemId, rating) => {
        try {
            const result = await axios.post(`${serverUrl}/api/item/rating`, { itemId, rating }, { withCredentials: true })
            setSelectedRating(prev => ({
                ...prev,
                [itemId]: rating
            }))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='bg-white rounded-lg shadow p-4 space-y-4'>
            <div className="flex justify-between border-b pb-2">
                <div>
                    <p className="font-semibold">order #{data._id.slice(-6)}</p>
                    <p className="text-sm text-gray-500">
                        Date: {formatDate(data.createdAt)}
                    </p>
                </div>
                <div className='text-right'>
                    {data.paymentMethod == "cod" ? <p className='text-gray-600'>Payment Mode: {data.paymentMethod?.toUpperCase()}</p> : <p className='text-gray-600 font-semibold'>Payment : {data.payment ? <span className='capitalize text-green-600'>paid</span> : <span className='capitalize text-[#ff4d2d]'>pending</span>}</p>}
                    <p className="font-medium text-gray-600">Order Status: <span className='capitalize text-[#ff4d2d]'>{data.shopOrders?.[0].status}</span></p>
                </div>
            </div>
            {data.shopOrders.map((shopOrder, i) => (
                <div key={i} className='border rounded-lg bg-[#fffaf7] p-3 space-y-3'><p>{shopOrder.shop.name}</p>
                    <div className='flex space-x-4 overflow-x-auto pb-2'>
                        {shopOrder.shopOrderItems.map((item, i) => (
                            <div key={i} className='flex-shrink-0 w-40 border rounded-lg p-2 bg-white'>
                                <img src={item.item.image} alt="" className='w-full h-24 object-cover rounded' />
                                <p className="text-sm font-semibold mt-1 text-center">{item.name}</p>
                                <p className="text-xs text-gray-600">Qty: {item.quantity} x &#8377;{item.price}</p>

                                {shopOrder.status == "delivered" && <div className='flex space-x-1 mt-2'>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} className={`text-lg cursor-pointer ${selectedRating[item.item._id] >= star ? "text-yellow-500" : "text-gray-300"}`}
                                            onClick={() => handleRating(item.item._id, star)}><FaStar /></button>
                                    ))}
                                </div>}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center border-t pt-2">
                        <p className="font-semibold">Subtotal: {shopOrder.subTotal}</p>
                        <p className='text-sm font-medium text-blue-600'>{shopOrder.status}</p>
                    </div>
                </div>
            ))}
            <div className="flex justify-between items-center border-t pt-2"><p className='font-semibold'>Total: &#8377;{data.totalAmount}</p>
                <button className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-4 py-2 rounded-lg text-sm cursor-pointer' onClick={() => navigate(`/track-order/${data._id}`)}>Track Order</button></div>
        </div>
    )
}

export default UserOrderCard