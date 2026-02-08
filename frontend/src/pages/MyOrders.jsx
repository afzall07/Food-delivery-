import React from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import UserOrderCard from '../components/UserOrderCard';
import OwnerOrderCard from '../components/OwnerOrderCard';
import { useEffect } from 'react';
import { setMyOrders, updateRealTimeOrderStatus } from '../redux/userSlice';
import { OrderCardSkeleton } from '../components/SpecificSkeletons';
function MyOrders() {
    const { userData, myOrders, socket, loading } = useSelector(state => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        socket?.on("newOrder", (data) => {
            if (data.shopOrders?.owner._id == userData._id) {
                dispatch(setMyOrders([data, ...myOrders]))
            };
        });
        socket?.on("update-status", ({ orderId, shopId, status, userId }) => {
            if (userId == userData._id) {
                dispatch(updateRealTimeOrderStatus({ orderId, shopId, status, userId }))
            }
        });
        return () => {
            socket?.off("newOrder")
            socket?.off("update-status")
        };
    }, [socket])
    return (
        <div className='w-full min-h-screen bg-[#fff9f6] flex justify-center px-4'>
            <div className='w-full max-w-[800px] p-4'>
                <div className="flex items-center gap-[20px] mb-6">
                    {/*back icon*/}
                    <div className=" z-[10]" onClick={() => navigate("/")}>
                        <IoIosArrowRoundBack
                            size={35}
                            className="text-[#ff4d2d] cursor-pointer"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-start">My Orders</h1>
                </div>
                <div className="space-y-6">
                    {loading?.orders ? (
                        [...Array(3)].map((_, i) => <OrderCardSkeleton key={i} />)
                    ) : myOrders?.length > 0 ? (
                        myOrders.map((order, index) => (
                            userData.role == "user" ? (
                                <UserOrderCard data={order} key={index} />
                            ) :
                                userData.role == "owner" ? (
                                    <OwnerOrderCard data={order} key={index} />
                                ) : null
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No orders found.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MyOrders