import { useCallback, useEffect, useState } from 'react';
import { fetchArchive } from './api/archiveClient';
import { AboutView } from './components/AboutView';
import { ComparatorView } from './components/ComparatorView';
import { DigitizerView } from './components/DigitizerView';
import { DossiersCatalogView } from './components/DossiersCatalogView';
import { DossierView } from './components/DossierView';
import { GenealogyView } from './components/GenealogyView';
import { OverviewView } from './components/OverviewView';
import { TopBar } from './components/TopBar';
import { INITIAL_DATABASE } from './data/seedData';
import type { AppSection, ArchiveDatabase } from './types/archive';

export default function App() {
  const [db, setDb] = useState<ArchiveDatabase>(INITIAL_DATABASE);
  const [loadingArchive, setLoadingArchive] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<AppSection>('overview');
  const [selectedPage, setSelectedPage] = useState<number>(1);

  const refreshArchive = useCallback(async () => {
    try {
      const data = await fetchArchive();
      setDb(data);
    } catch {
      // Fallback to initial snapshot if network temporarily fails
    } finally {
      setLoadingArchive(false);
    }
  }, []);

  useEffect(() => {
    void refreshArchive();
  }, [refreshArchive]);

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
        appName={db.aboutInfo.appName}
        activeSection={activeSection}
        onNavigate={navigateTo}
      />

      <main className="flex-1">
        {loadingArchive && (
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 pt-4 text-xs text-[#57534E]">
            Đang đồng bộ dữ liệu tư liệu...
          </div>
        )}

        {activeSection === 'overview' && (
          <OverviewView db={db} onNavigate={navigateTo} onOpenPage={openPageInComparator} />
        )}

        {activeSection === 'comparator' && (
          <ComparatorView
            folios={db.folios}
            selectedPage={selectedPage}
            onSelectPage={setSelectedPage}
            onOpenDigitizer={() => navigateTo('digitize')}
          />
        )}

        {activeSection === 'digitize' && (
          <DigitizerView
            folios={db.folios}
            selectedPage={selectedPage}
            onOpenPage={openPageInComparator}
          />
        )}

        {activeSection === 'genealogy' && (
          <GenealogyView characters={db.characters} onOpenPage={openPageInComparator} />
        )}

        {activeSection === 'dossiers' && (
          <DossiersCatalogView
            dossiers={db.dossiers}
            characters={db.characters}
            totalFolioPages={db.folios.length}
            onOpenPage={openPageInComparator}
            onOpenGenealogy={() => navigateTo('genealogy')}
          />
        )}

        {activeSection === 'dossier' && (
          <DossierView
            legalInfo={db.legalInfo}
            sources={db.sources}
            imageProvenance={db.imageProvenance}
            mediaImages={db.mediaImages}
            dossierCount={db.dossiers.length}
            folioCount={db.folios.length}
          />
        )}

        {activeSection === 'about' && (
          <AboutView aboutInfo={db.aboutInfo} sources={db.sources} onNavigate={navigateTo} />
        )}
      </main>

      <footer className="border-t border-[#D6CEBE] bg-[#F3EFE6] mt-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2 max-w-2xl">
            <div className="font-display text-lg font-semibold text-[#1C1917]">
              {db.aboutInfo.appName}
            </div>
            <p className="text-xs text-[#44403C] leading-relaxed">
              {db.aboutInfo.attributionVerbatim}
            </p>
            <p className="text-xs text-[#57534E]">
              Tư liệu tham chiếu: {db.legalInfo.documentName} (ký hiệu{' '}
              <span className="font-mono text-[#1C1917]">{db.legalInfo.callNumber}</span>) ·{' '}
              {db.legalInfo.repositoryName}.
            </p>
          </div>

          <nav
            aria-label="Liên kết chân trang"
            className="flex flex-wrap items-center gap-5 text-xs font-medium text-[#57534E] shrink-0"
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
              onClick={() => navigateTo('digitize')}
              className="hover:text-[#8C2D19] transition-colors whitespace-nowrap"
            >
              Chuyển đổi bản số
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
              onClick={() => navigateTo('dossiers')}
              className="hover:text-[#1C1917] transition-colors whitespace-nowrap"
            >
              21 Hồ sơ
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
