import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg focus:ring-indigo-500',
    secondary: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-indigo-500',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-500',
  };

  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const renderIcon = () => {
    if (loading) {
      return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
    }
    if (!icon) return null;

    if (React.isValidElement(icon)) {
      return <span className="mr-2 inline-flex items-center shrink-0">{icon}</span>;
    }

    const IconComponent = icon;
    return <IconComponent className="mr-2 h-4 w-4 shrink-0" />;
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {renderIcon()}
      {children}
    </button>
  );
};

export default Button;
