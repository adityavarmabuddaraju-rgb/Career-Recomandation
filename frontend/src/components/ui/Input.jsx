import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || Math.random().toString(36).substring(7);
  
  const renderIcon = () => {
    if (!icon) return null;
    const colorClass = error ? 'text-red-400' : 'text-slate-400';

    if (React.isValidElement(icon)) {
      return (
        <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${colorClass}`}>
          {icon}
        </div>
      );
    }

    const IconComponent = icon;
    return (
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <IconComponent className={`h-5 w-5 ${colorClass}`} />
      </div>
    );
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {renderIcon()}
        <input
          ref={ref}
          id={inputId}
          className={`block w-full rounded-lg border ${error ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 text-slate-900 focus:ring-indigo-500 focus:border-indigo-500'} ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 text-sm shadow-sm transition-colors bg-white focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600 animate-slideDown">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
