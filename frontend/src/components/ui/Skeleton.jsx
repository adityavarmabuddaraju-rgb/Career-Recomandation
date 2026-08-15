import React from 'react';

export const Skeleton = ({ variant = 'text', className = '' }) => {
  const variants = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'h-32 w-full rounded-2xl',
  };

  return (
    <div className={`shimmer-bg ${variants[variant]} ${className}`} />
  );
};

export default Skeleton;
