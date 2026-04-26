import React from 'react';

const Skeleton = ({ className, variant = 'rect' }) => {
  const baseClasses = "animate-shimmer bg-slate-200 dark:bg-slate-800/50 rounded-md overflow-hidden relative";
  
  const variantClasses = {
    rect: "",
    circle: "rounded-full",
    text: "h-4 w-full"
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant] || ''} ${className}`}>
      {/* Shimmer overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </div>
  );
};

export default Skeleton;
