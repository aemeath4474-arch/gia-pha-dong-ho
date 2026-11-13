import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AppSection, PROJECT_METADATA } from '../data/archiveData';

interface TopBarProps {
  activeSection: AppSection;
  onNavigate: (section: AppSection) => void;
  onQuickLookup: () => void;
}

const NAV_ITEMS: { id: AppSection; label: string }[] = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'comparator', label: 'Đối chiếu trang' },
  { id: 'genealogy', label: 'Sơ đồ phả hệ' },
  { id: 'dossier', label: 'Hồ sơ & Pháp lý' },
  { id: 'about', label: 'Giới thiệu' },
];

export const TopBar: React.FC<TopBarProps> = ({
  activeSection,
  onNavigate,
  onQuickLookup,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelect = (section: AppSection) => {
    setMobileMenuOpen(false);
    onNavigate(section);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-sm border-b border-[#E5DEC9]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => handleSelect('overview')}
          className="font-display text-lg sm:text-xl font-semibold tracking-tight text-[#1C1917] hover:text-[#8C2D19] transition-colors whitespace-nowrap shrink-0 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8C2D19]"
        >
          {PROJECT_METADATA.appName}
        </button>

        {/* Zone 2: 5 clean single-line text navigation links */}
        <nav
          aria-label="Điều hướng chính"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#57534E]"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8C2D19] ${
                  isActive
                    ? 'text-[#1C1917] font-semibold'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[21px] h-[2px] bg-[#8C2D19]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onQuickLookup();
            }}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold tracking-wide text-[#FBF9F5] bg-[#1C1917] hover:bg-[#8C2D19] transition-colors rounded-sm whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C2D19]"
          >
            Tra cứu 82 trang
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Đóng danh mục điều hướng' : 'Mở danh mục điều hướng'}
            aria-expanded={mobileMenuOpen}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 text-[#1C1917] border border-[#D6CEBE] rounded-sm hover:bg-[#F3EFE6] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5DEC9] bg-[#FBF9F5] px-4 py-4">
          <nav aria-label="Điều hướng di động" className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`w-full text-left px-3 py-3 text-sm font-medium rounded-sm transition-colors ${
                    isActive
                      ? 'bg-[#EBE6DF] text-[#8C2D19] font-semibold'
                      : 'text-[#1C1917] hover:bg-[#F3EFE6]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onQuickLookup();
              }}
              className="mt-2 w-full px-4 py-3 text-xs font-semibold text-[#FBF9F5] bg-[#1C1917] hover:bg-[#8C2D19] rounded-sm text-center transition-colors"
            >
              Tra cứu 82 trang tư liệu
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
