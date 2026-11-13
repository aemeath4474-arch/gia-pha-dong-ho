import { useState } from 'react';
import { AboutView } from './components/AboutView';
import { ComparatorView } from './components/ComparatorView';
import { DossierView } from './components/DossierView';
import { GenealogyView } from './components/GenealogyView';
import { OverviewView } from './components/OverviewView';
import { TopBar } from './components/TopBar';
import { AppSection, ATTRIBUTION_VERBATIM, PROJECT_METADATA } from './data/archiveData';

export default function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('overview');
  const [selectedPage, setSelectedPage] = useState<number>(1);

  const navigateTo = (section: AppSection) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPageInComparator = (pageNumber: number) => {
    setSelectedPage(pageNumber);
    setActiveSection('comparator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1917]">
      <TopBar
        activeSection={activeSection}
        onNavigate={navigateTo}
        onQuickLookup={() => openPageInComparator(selectedPage)}
      />

      <main className="flex-1">
        {activeSection === 'overview' && (
          <OverviewView onNavigate={navigateTo} onOpenPage={openPageInComparator} />
        )}
        {activeSection === 'comparator' && (
          <ComparatorView selectedPage={selectedPage} onSelectPage={setSelectedPage} />
        )}
        {activeSection === 'genealogy' && (
          <GenealogyView onOpenPage={openPageInComparator} />
        )}
        {activeSection === 'dossier' && <DossierView />}
        {activeSection === 'about' && <AboutView onNavigate={navigateTo} />}
      </main>

      <footer className="border-t border-[#D6CEBE] bg-[#F3EFE6] mt-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2 max-w-2xl">
            <div className="font-display text-lg font-semibold text-[#1C1917]">
              {PROJECT_METADATA.appName}
            </div>
            <p className="text-xs text-[#44403C] leading-relaxed">{ATTRIBUTION_VERBATIM}</p>
            <p className="text-xs text-[#57534E]">
              Tư liệu tham chiếu: {PROJECT_METADATA.documentTitle} (ký hiệu{' '}
              <span className="font-mono text-[#1C1917]">{PROJECT_METADATA.callNumber}</span>) ·{' '}
              {PROJECT_METADATA.repository.name}.
            </p>
          </div>

          <nav
            aria-label="Liên kết chân trang"
            className="flex flex-wrap items-center gap-6 text-xs font-medium text-[#57534E] shrink-0"
          >
            <button
              type="button"
              onClick={() => navigateTo('overview')}
              className="hover:text-[#1C1917] transition-colors whitespace-nowrap"
            >
              Tổng quan
            </button>
            <button
              type="button"
              onClick={() => navigateTo('comparator')}
              className="hover:text-[#1C1917] transition-colors whitespace-nowrap"
            >
              Đối chiếu 82 trang
            </button>
            <button
              type="button"
              onClick={() => navigateTo('genealogy')}
              className="hover:text-[#1C1917] transition-colors whitespace-nowrap"
            >
              Sơ đồ phả hệ
            </button>
            <button
              type="button"
              onClick={() => navigateTo('dossier')}
              className="hover:text-[#1C1917] transition-colors whitespace-nowrap"
            >
              Hồ sơ &amp; Pháp lý
            </button>
            <button
              type="button"
              onClick={() => navigateTo('about')}
              className="hover:text-[#1C1917] transition-colors whitespace-nowrap"
            >
              Giới thiệu
            </button>
          </nav>
        </div>
      </footer>
    </div>
  );
}
