import React from 'react';

export const Card = ({
  children,
  padding = 'p-6',
  hover = false,
  glow = false,
  className = '',
}) => {
  const hoverClass = hover ? 'hover-lift hover:border-indigo-100' : '';
  const glowClass = glow ? 'relative before:absolute before:-inset-0.5 before:bg-gradient-to-r before:from-indigo-500 before:to-purple-500 before:rounded-[17px] before:blur before:opacity-20 before:transition-opacity hover:before:opacity-30' : '';
  
  return (
    <div className={`${glowClass} relative group`}>
      <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 transition-all ${padding} ${hoverClass} ${className} relative z-10 h-full`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
