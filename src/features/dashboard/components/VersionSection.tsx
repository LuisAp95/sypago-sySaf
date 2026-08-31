import React from 'react';
import type { ReleaseSection } from '../types/version.types';
import { VersionItem } from './VersionItem';

interface VersionSectionProps {
  section: ReleaseSection;
}

export const VersionSection: React.FC<VersionSectionProps> = ({ section }) => {
  return (
    <div className="space-y-4">
      {/* Category Section Header */}
      <h3 className="text-gray-300 font-medium text-sm md:text-base tracking-wide">
        {section.title}
      </h3>

      {/* List of items in section */}
      <div className="space-y-4 pl-1">
        {section.items.map((item) => (
          <VersionItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
