import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-transparent',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 border',
    warning: 'bg-amber-50 text-amber-700 border-amber-200 border',
    error: 'bg-red-50 text-red-700 border-red-200 border',
    info: 'bg-indigo-50 text-indigo-700 border-indigo-200 border',
    outline: 'bg-transparent text-slate-600 border-slate-200 border',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
