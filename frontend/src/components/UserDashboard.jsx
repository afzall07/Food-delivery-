import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";
import { CategoryCardSkeleton, FoodCardSkeleton, ShopCardSkeleton } from "./SpecificSkeletons";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const categScrollRef = useRef();
  const shopScrollRef = useRef();
  const itemsScrollRef = useRef();

  const [showLeftScrollButton, setShowLeftScrollButton] = useState(false);
  const [showRightScrollButton, setShowRightScrollButton] = useState(false);
  const [shopLeftScrollButton, setShopLeftScrollButton] = useState(false);
  const [shopRightScrollButton, setShopRightScrollButton] = useState(false);
  const [updatedItemsList, setUpdatedItemsList] = useState([]);
  const { currentCity, shopsInMyCity, itemsInMyCity, searchItems, loading } = useSelector(
    (state) => state.user
  );
  const navigate = useNavigate()

  const handleFilterByCategory = (category) => {
    if (category == "All") {
      setUpdatedItemsList(itemsInMyCity)
    } else {
      const filteredList = itemsInMyCity?.filter(i => i.category === category)
      setUpdatedItemsList(filteredList)
    }
  };

  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity)

  }, [itemsInMyCity])


  //  Handles updating visibility of scroll buttons
  const updateScrollButton = (ref, setLeftVisible, setRightVisible) => {
    const element = ref.current;
    if (element) {
      setLeftVisible(element.scrollLeft > 0);
      setRightVisible(
        element.scrollLeft + element.clientWidth < element.scrollWidth
      );
    }
  };

  //  Scroll handler for left/right movement
  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  //  Setup event listeners once components mount
  useEffect(() => {
    const handleCategScroll = () => {
      updateScrollButton(
        categScrollRef,
        setShowLeftScrollButton,
        setShowRightScrollButton
      );
    };

    const handleShopScroll = () => {
      updateScrollButton(
        shopScrollRef,
        setShopLeftScrollButton,
        setShopRightScrollButton
      );
    };

    // Initial check
    handleCategScroll();
    handleShopScroll();

    // Add event listeners
    categScrollRef.current?.addEventListener("scroll", handleCategScroll);
    shopScrollRef.current?.addEventListener("scroll", handleShopScroll);

    // Cleanup
    return () => {
      categScrollRef.current?.removeEventListener("scroll", handleCategScroll);
      shopScrollRef.current?.removeEventListener("scroll", handleShopScroll);
    };
  }, [categories]);

  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">
      <Navbar />

      {searchItems && searchItems.length > 0 && (
        <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-5 bg-white shadow-md rounded-2xl mt-4">
          <h1 className="text-gray-800 text-2xl sm:text-3xl font-semibold border-b border-gray-200 pb-2">Search Results</h1>
          <div className="w-full h-auto flex flex-wrap gap-6 justify-center">
            {searchItems.map(item => (
              <FoodCard data={item} key={item._id} />
            ))}
          </div>

        </div>)}

      {/* category cards */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px] mt-20">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">Choose Best Food</h1>
        <div className="w-full relative">
          {showLeftScrollButton && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollHandler(categScrollRef, "left")}
            >
              <FaCircleChevronLeft />
            </button>
          )}

          <div
            className="w-full flex overflow-x-auto gap-4 pb-2 no-scrollbar"
            ref={categScrollRef}
          >
            {categories?.map((categ, index) => (
              <CategoryCard
                key={index}
                name={categ.category}
                image={categ.image}
                onClick={() => handleFilterByCategory(categ.category)}
              />
            ))}
          </div>

          {showRightScrollButton && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollHandler(categScrollRef, "right")}
            >
              <FaCircleChevronRight />
            </button>
          )}
        </div>
      </div>

      {/* shop cards */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Best Shops in {currentCity}
        </h1>
        <div className="w-full relative">
          {shopLeftScrollButton && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollHandler(shopScrollRef, "left")}
            >
              <FaCircleChevronLeft />
            </button>
          )}

          <div
            className="w-full flex overflow-x-auto gap-4 pb-2 no-scrollbar"
            ref={shopScrollRef}
          >
            {loading?.shops ? (
              [...Array(5)].map((_, i) => <ShopCardSkeleton key={i} />)
            ) : shopsInMyCity?.length > 0 ? (
              shopsInMyCity.map((shop, index) => (
                <CategoryCard key={index} name={shop.name} image={shop.image} onClick={() => navigate(`/shop/${shop._id}`)} />
              ))
            ) : (
              <p>No shops available in your city.</p>
            )}
          </div>

          {shopRightScrollButton && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollHandler(shopScrollRef, "right")}
            >
              <FaCircleChevronRight />
            </button>
          )}
        </div>
      </div>

      {/* product cards */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Suggested Food Items
        </h1>
        <div className="w-full h-auto flex flex-wrap gap-[20px] justify-center">
          {loading?.items ? (
            [...Array(8)].map((_, i) => <FoodCardSkeleton key={i} />)
          ) : updatedItemsList?.map((item, index) => (
            <FoodCard data={item} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
