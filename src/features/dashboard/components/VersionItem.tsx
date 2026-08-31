import React from 'react';
import type { ReleaseItem } from '../types/version.types';

interface VersionItemProps {
  item: ReleaseItem;
}

export const VersionItem: React.FC<VersionItemProps> = ({ item }) => {
  return (
    <div className="flex items-start gap-3">
      {/* Cyan/Teal Bullet Dot */}
      <span className="w-2 h-2 rounded-full bg-[#00d2b5] mt-1.5 shrink-0 shadow-[0_0_8px_rgba(0,210,181,0.5)]" />
      
      <div className="flex-1">
        {/* Item Title in Bold */}
        <h4 className="font-bold text-gray-200 text-sm md:text-base leading-snug">
          {item.title}
        </h4>
        {/* Item Description */}
        <p className="text-gray-400 text-xs md:text-sm leading-relaxed mt-1">
          {item.description}
        </p>
      </div>
    </div>
  );
};
