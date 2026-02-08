import React from 'react';

const Skeleton = ({ className = '', variant = 'rectangle', width, height }) => {
    const baseStyles = 'bg-gray-200 animate-pulse';
    const variantStyles = {
        rectangle: 'rounded-md',
        circle: 'rounded-full',
        text: 'rounded h-4 w-full mb-2',
    };

    const style = {
        width: width || undefined,
        height: height || undefined,
    };

    return (
        <div
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            style={style}
        />
    );
};

export default Skeleton;
