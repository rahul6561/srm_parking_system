import React from 'react';
import { STATUS_CONFIG } from '../../utils/parkingUtils';

const StatusBadge = ({ status = 'AVAILABLE', size = 'md', showDot = true, className = '' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.AVAILABLE;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold tracking-wider',
    md: 'px-2.5 py-1 text-xs font-semibold tracking-wider',
    lg: 'px-3.5 py-1.5 text-sm font-bold tracking-wider'
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full uppercase transition-all duration-200 ${config.badgeClass} ${sizeClasses[size]} ${className}`}
    >
      {showDot && (
        <span className="relative flex h-2 w-2 items-center justify-center">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dotClass}`}
          />
          <span className={`relative inline-flex rounded-full ${dotSizes[size]} ${config.dotClass}`} />
        </span>
      )}
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
