import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import { FaLocationDot, FaStore } from 'react-icons/fa6'
import { FaUtensils, FaArrowLeft } from 'react-icons/fa'
import FoodCard from '../components/FoodCard'
import { useNavigate } from 'react-router-dom'

function Shop() {
    const navigate = useNavigate()
    const { shopId } = useParams()
    const [items, setItems] = useState([])
    const [shop, setShop] = useState([])
    const [loading, setLoading] = useState(true)
    const handleShop = async () => {
        setLoading(true)
        try {
            const result = await axios.get(`${serverUrl}/api/item/get-by-shop/${shopId}`, { withCredentials: true })
            setShop(result.data.shop)
            setItems(result.data.items)

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    };
    useEffect(() => { handleShop() }
        , [shopId])

    return (
        <div className='min-h-screen bg-gray-50'>
            <button className='absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white px-3 py-2 rounded-full shadow transition' onClick={() => navigate(-1)}>
                <FaArrowLeft />
                <p className='text-sm font-semibold'>Back</p>
            </button>
            {loading ? (
                <div className='relative w-full h-64 md:h-80 lg:h-96 bg-gray-200 animate-pulse flex flex-col justify-center items-center text-center px-4'>
                    <div className='w-16 h-16 bg-gray-300 rounded-full mb-3'></div>
                    <div className='h-10 w-48 bg-gray-300 rounded mb-2'></div>
                    <div className='h-6 w-64 bg-gray-300 rounded'></div>
                </div>
            ) : (
                shop && <div className='relative w-full h-64 md:h-80 lg:h-96'>
                    <img src={shop.image} alt="" className='w-full h-full object-center' />
                    <div className='absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 flex flex-col justify-center items-center text-center px-4'>
                        <FaStore className='text-white text-4xl mb-3 drop-shadow-md' />
                        <h1 className='text-white text-3xl md:text-5xl font-extrabold drop-shadow-lg'>{shop.name}</h1>
                        <div className='flex items-center gap-2 text-gray-200 mt-2'>
                            <FaLocationDot size={22} />
                            <p className=' text-lg md:text-2xl font-semibold drop-shadow-md'>{shop.address}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* food cards  */}
            <div className='max-w-7xl mx-auto px-6 py-10'>
                <h2 className='flex items-center justify-center gap-3 text-3xl font-bold text-gray-800 mb-10'><FaUtensils className='text-[#FF4d2d]' />Our Menu</h2>
                {loading ? (
                    <div className='flex flex-col items-center justify-center py-20'>
                        <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FF4d2d]'></div>
                        <p className='mt-4 text-gray-600 font-medium animate-pulse'>Loading delicious items...</p>
                    </div>
                ) : items.length > 0 ? (
                    <div className='flex flex-wrap justify-center gap-6'>
                        {items.map(item => (
                            <FoodCard data={item} key={item.id} />
                        ))}
                    </div>
                ) : (
                    <p className='text-center text-gray-600 text-lg'> No items found</p>
                )}
            </div>
        </div>
    )
}

export default Shop