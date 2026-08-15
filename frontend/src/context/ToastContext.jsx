import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

const Toast = ({ message, type, onClose }) => {
  const config = {
    success: { icon: CheckCircle2, className: 'bg-emerald-50 text-emerald-800 border-emerald-200', iconClass: 'text-emerald-500' },
    error: { icon: XCircle, className: 'bg-red-50 text-red-800 border-red-200', iconClass: 'text-red-500' },
    warning: { icon: AlertCircle, className: 'bg-amber-50 text-amber-800 border-amber-200', iconClass: 'text-amber-500' },
    info: { icon: Info, className: 'bg-indigo-50 text-indigo-800 border-indigo-200', iconClass: 'text-indigo-500' },
  };

  const { icon: Icon, className, iconClass } = config[type] || config.info;

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg w-80 animate-slideInRight pointer-events-auto ${className}`}>
      <Icon className={`h-5 w-5 shrink-0 ${iconClass}`} />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={onClose} className="p-1 rounded opacity-50 hover:opacity-100 transition-opacity">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
