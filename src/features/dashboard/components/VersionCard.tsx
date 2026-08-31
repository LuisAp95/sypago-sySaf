import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { VersionRelease } from '../types/version.types';
import { VersionSection } from './VersionSection';

interface VersionCardProps {
  release: VersionRelease;
}

export const VersionCard: React.FC<VersionCardProps> = ({ release }) => {
  const [isOpen, setIsOpen] = useState<boolean>(release.defaultExpanded ?? false);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="bg-tertiary border border-[#3A393C] rounded-xl overflow-hidden shadow-md transition-all duration-200">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={toggleOpen}
        className="w-full flex items-center justify-between p-5 md:px-6 md:py-4 text-left cursor-pointer hover:bg-[#343334] transition-colors group select-none focus:outline-none"
      >
        <span className="font-bold text-white text-base md:text-lg tracking-wide">
          {release.version}
        </span>
        <div className="text-gray-400 group-hover:text-gray-200 transition-colors">
          {isOpen ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </button>

      {/* Expanded Release Content */}
      {isOpen && (
        <div className="border-t border-[#3A393C]">
          <div className="p-5 md:p-6 space-y-6">
            {release.sections.map((section) => (
              <VersionSection key={section.id} section={section} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
