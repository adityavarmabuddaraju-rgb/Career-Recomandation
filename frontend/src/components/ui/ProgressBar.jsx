import React, { useEffect, useState } from 'react';

export const ProgressBar = ({
  value = 0,
  max = 100,
  label,
  showPercentage = false,
  color = 'indigo',
  size = 'md',
  className = ''
}) => {
  const [progress, setProgress] = useState(0);
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  useEffect(() => {
    // Animate progress on mount
    const timer = setTimeout(() => setProgress(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  const colors = {
    indigo: 'from-indigo-500 to-purple-500',
    emerald: 'from-emerald-400 to-emerald-600',
    amber: 'from-amber-400 to-amber-600',
    cyan: 'from-cyan-400 to-cyan-600',
    rose: 'from-rose-400 to-rose-600'
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
          {showPercentage && <span className="text-sm font-medium text-slate-500">{Math.round(progress)}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
