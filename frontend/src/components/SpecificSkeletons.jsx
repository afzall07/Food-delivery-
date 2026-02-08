import React from 'react';
import Skeleton from './Skeleton';

export const FoodCardSkeleton = () => (
    <div className="w-[300px] h-[400px] bg-white rounded-2xl shadow-lg p-4 flex flex-col gap-4">
        <Skeleton className="w-full h-48 rounded-xl" />
        <div className="flex flex-col gap-2">
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
        </div>
        <div className="mt-auto flex justify-between items-center">
            <Skeleton variant="text" width="40%" />
            <Skeleton className="w-20 h-8 rounded-full" />
        </div>
    </div>
);

export const CategoryCardSkeleton = () => (
    <div className="min-w-[120px] flex flex-col items-center gap-2">
        <Skeleton variant="circle" className="w-20 h-20" />
        <Skeleton variant="text" width="80%" />
    </div>
);

export const ShopCardSkeleton = () => (
    <div className="min-w-[280px] bg-white rounded-2xl shadow-md p-4 flex flex-col gap-3">
        <Skeleton className="w-full h-40 rounded-xl" />
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="50%" />
    </div>
);

export const OrderCardSkeleton = () => (
    <div className="w-full bg-white p-6 rounded-2xl shadow-md border border-orange-100 mb-4 animate-pulse">
        <div className="flex justify-between mb-4">
            <div className="space-y-2 w-1/3">
                <Skeleton variant="text" />
                <Skeleton variant="text" width="60%" />
            </div>
            <Skeleton className="w-24 h-8 rounded-full" />
        </div>
        <div className="space-y-3">
            <Skeleton className="w-full h-20 rounded-xl" />
            <Skeleton variant="text" width="40%" />
        </div>
    </div>
);

export const ShopBannerSkeleton = () => (
    <div className="relative w-full h-64 md:h-80 lg:h-96 bg-gray-200 animate-pulse flex flex-col justify-center items-center text-center px-4">
        <Skeleton variant="circle" className="w-16 h-16 mb-3" />
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-6 w-48" />
    </div>
);
