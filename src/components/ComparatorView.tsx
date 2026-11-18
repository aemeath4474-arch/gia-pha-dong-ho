import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Contrast,
  Eye,
  EyeOff,
  FileText,
  Info,
  Maximize2,
  Search,
  Sparkles,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import type {
  FolioRecord,
  ManuscriptColumnLine,
  UncertainMark,
} from '../types/archive';
import { ArchivalImage } from './ArchivalImage';
import { StandardArchivalRecordTable } from './StandardArchivalRecordTable';

interface ComparatorViewProps {
  folios: FolioRecord[];
  selectedPage: number;
  onSelectPage: (pageNumber: number) => void;
  onOpenDigitizer: () => void;
}

type ReadingMode = 'three-layer' | 'han-nom' | 'vietnamese' | 'uncertain';
type PartFilter = 'all' | 'phan-1' | 'phan-2' | 'with-image' | 'missing-image';

export const ComparatorView: React.FC<ComparatorViewProps> = ({
  folios,
  selectedPage,
  onSelectPage,
  onOpenDigitizer,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [highContrastInk, setHighContrastInk] = useState<boolean>(false);
  const [showColumnGuides, setShowColumnGuides] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [readingMode, setReadingMode] = useState<ReadingMode>('three-layer');
  const [partFilter, setPartFilter] = useState<PartFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentFolio: FolioRecord =
    folios.find((item) => item.pageNumber === selectedPage) || folios[0];

  const activeColumns: ManuscriptColumnLine[] = currentFolio?.columns || [];
  const uncertainMarks: UncertainMark[] = currentFolio?.uncertainMarks || [];

  const pagesWithImages = useMemo(
    () => folios.filter((f) => Boolean(f.imageUrl && f.imageUrl.trim())),
    [folios]
  );

  const prevImagePage = useMemo(() => {
    const prev = [...pagesWithImages].reverse().find((f) => f.pageNumber < selectedPage);
    return prev?.pageNumber ?? null;
  }, [pagesWithImages, selectedPage]);

  const nextImagePage = useMemo(() => {
    const next = pagesWithImages.find((f) => f.pageNumber > selectedPage);
    return next?.pageNumber ?? null;
  }, [pagesWithImages, selectedPage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const filteredCatalog = useMemo(() => {
    return folios.filter((item) => {
      if (partFilter === 'phan-1' && item.sectionPart !== 'phan-1') return false;
      if (partFilter === 'phan-2' && item.sectionPart !== 'phan-2') return false;
      if (partFilter === 'with-image' && !item.imageUrl) return false;
      if (partFilter === 'missing-image' && Boolean(item.imageUrl)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const inColumns = item.columns.some(
          (c) =>
            c.hanNom.toLowerCase().includes(q) ||
            c.phienAm.toLowerCase().includes(q) ||
            c.dichNghia.toLowerCase().includes(q) ||
            c.ghiChu.toLowerCase().includes(q)
        );
        const inUncertain = item.uncertainMarks.some(
          (u) =>
            u.glyphOrPhrase.toLowerCase().includes(q) ||
            u.reason.toLowerCase().includes(q)
        );
        return (
          String(item.pageNumber).includes(q) ||
          item.folioCode.toLowerCase().includes(q) ||
          (item.identifier || '').toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.sectionLabel.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.transcriptionText.toLowerCase().includes(q) ||
          item.translationText.toLowerCase().includes(q) ||
          (item.archivalRecord?.uncertainPoints || '').toLowerCase().includes(q) ||
          inColumns ||
          inUncertain
        );
      }
      return true;
    });
  }, [folios, partFilter, searchQuery]);

  const handleStepPage = (delta: number) => {
    const next = Math.min(folios.length, Math.max(1, selectedPage + delta));
    onSelectPage(next);
    setActiveColumnId(null);
  };

  if (!currentFolio) return null;

  const hasImage = Boolean(currentFolio.imageUrl && currentFolio.imageUrl.trim());

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Header & Page Navigation Bar */}
      <div className="space-y-4 pb-6 border-b border-[#D6CEBE]">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#57534E]">
          <span>
            Mã định danh:{' '}
            <strong className="font-mono text-[#8C2D19]">{currentFolio.identifier}</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Ký hiệu tờ: <strong className="font-mono text-[#1C1917]">{currentFolio.folioCode}</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-[#1C1917] tabular-nums">
            Trang {String(currentFolio.pageNumber).padStart(2, '0')} / {folios.length}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Trạng thái:{' '}
            <strong className="text-[#8C2D19]">{currentFolio.verificationStatus}</strong>
          </span>
        </div>

        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1C1917]">
              Đối chiếu ảnh trang gốc &amp; văn bản phiên chép
            </h1>
            <p className="mt-2 text-sm text-[#44403C] max-w-2xl leading-relaxed">
              {currentFolio.sectionLabel} — {currentFolio.title}
            </p>
          </div>

          {/* Quick Jump & Stepper */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="flex items-center border border-[#D6CEBE] bg-[#F3EFE6] rounded-sm p-1">
              <button
                type="button"
                onClick={() => {
                  onSelectPage(1);
                  setActiveColumnId(null);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap ${
                  selectedPage === 1
                    ? 'bg-[#1C1917] text-[#FBF9F5]'
                    : 'text-[#44403C] hover:text-[#1C1917]'
                }`}
              >
                Mẫu Tr.01
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectPage(2);
                  setActiveColumnId(null);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap ${
                  selectedPage === 2
                    ? 'bg-[#1C1917] text-[#FBF9F5]'
                    : 'text-[#44403C] hover:text-[#1C1917]'
                }`}
              >
                Mẫu Tr.02
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectPage(43);
                  setActiveColumnId(null);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap ${
                  selectedPage === 43
                    ? 'bg-[#1C1917] text-[#FBF9F5]'
                    : 'text-[#44403C] hover:text-[#1C1917]'
                }`}
              >
                Mẫu Thế thứ (Tr.43)
              </button>
            </div>

            <div className="flex items-center border border-[#D6CEBE] bg-[#FBF9F5] rounded-sm">
              <button
                type="button"
                onClick={() => handleStepPage(-1)}
                disabled={selectedPage <= 1}
                aria-label="Trang trước"
                className="p-2 text-[#1C1917] hover:bg-[#F3EFE6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <select
                aria-label="Chọn số trang"
                value={selectedPage}
                onChange={(e) => {
                  onSelectPage(Number(e.target.value));
                  setActiveColumnId(null);
                }}
                className="px-2 py-1.5 font-mono text-xs text-[#1C1917] bg-transparent focus:outline-none tabular-nums"
              >
                {folios.map((f) => (
                  <option key={f.folioCode} value={f.pageNumber}>
                    Tr. {String(f.pageNumber).padStart(2, '0')} {f.imageUrl ? '●' : '○'}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => handleStepPage(1)}
                disabled={selectedPage >= folios.length}
                aria-label="Trang kế tiếp"
                className="p-2 text-[#1C1917] hover:bg-[#F3EFE6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenDigitizer}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#8C2D19] border border-[#8C2D19] bg-[#FBF9F5] hover:bg-[#8C2D19] hover:text-[#FBF9F5] rounded-sm transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chuyển đổi bản số</span>
            </button>
          </div>
        </div>
      </div>

      {/* Archival Honesty & Status Banner (Điều 63 Luật 2024) */}
      <div className="border border-[#D6CEBE] bg-[#F3EFE6] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3 text-xs sm:text-sm text-[#44403C] leading-relaxed">
          <Info className="w-4 h-4 text-[#8C2D19] shrink-0 mt-0.5" />
          <p>
            <strong className="text-[#1C1917]">Loại bản đang hiển thị (Điều 63 Luật 2024):</strong>{' '}
            {currentFolio.archivalRecord.displayedCopyType}. Phạm vi:{' '}
            {currentFolio.archivalRecord.allowedScope}
          </p>
        </div>
        <span className="font-mono text-[11px] text-[#8C2D19] whitespace-nowrap shrink-0">
          {currentFolio.identifier} · {currentFolio.folioCode}
        </span>
      </div>

      {/* Split-Screen Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Manuscript Folio Image Viewer */}
        <section
          aria-label="Ảnh chụp trang tư liệu"
          className="lg:col-span-6 border border-[#D6CEBE] bg-[#F3EFE6] flex flex-col"
        >
          {/* Viewer Toolbar */}
          <div className="px-4 py-3 border-b border-[#D6CEBE] bg-[#EBE6DF] flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#1C1917]">
              Ảnh trang ({currentFolio.folioCode})
            </span>

            <div className="flex flex-wrap items-center gap-1.5">
              {/* Previous/Next Image Jump */}
              <div className="flex items-center border border-[#D6CEBE] bg-[#FBF9F5] rounded-sm">
                <button
                  type="button"
                  disabled={!prevImagePage}
                  onClick={() => prevImagePage && onSelectPage(prevImagePage)}
                  title="Chuyển tới ảnh trước"
                  className="px-2 py-1 text-[11px] font-medium text-[#1C1917] hover:bg-[#F3EFE6] disabled:opacity-40 whitespace-nowrap"
                >
                  ← Ảnh trước
                </button>
                <span className="h-4 w-px bg-[#D6CEBE]" aria-hidden="true" />
                <button
                  type="button"
                  disabled={!nextImagePage}
                  onClick={() => nextImagePage && onSelectPage(nextImagePage)}
                  title="Chuyển tới ảnh sau"
                  className="px-2 py-1 text-[11px] font-medium text-[#1C1917] hover:bg-[#F3EFE6] disabled:opacity-40 whitespace-nowrap"
                >
                  Ảnh sau →
                </button>
              </div>

              {hasImage && (
                <>
                  {activeColumns.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowColumnGuides((prev) => !prev)}
                      className={`inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-sm border transition-colors whitespace-nowrap ${
                        showColumnGuides
                          ? 'bg-[#1C1917] text-[#FBF9F5] border-[#1C1917]'
                          : 'bg-[#FBF9F5] text-[#1C1917] border-[#D6CEBE] hover:bg-[#F3EFE6]'
                      }`}
                    >
                      {showColumnGuides ? (
                        <Eye className="w-3.5 h-3.5" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                      <span>Cột</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setHighContrastInk((prev) => !prev)}
                    className={`inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-sm border transition-colors whitespace-nowrap ${
                      highContrastInk
                        ? 'bg-[#8C2D19] text-[#FBF9F5] border-[#8C2D19]'
                        : 'bg-[#FBF9F5] text-[#1C1917] border-[#D6CEBE] hover:bg-[#F3EFE6]'
                    }`}
                  >
                    <Contrast className="w-3.5 h-3.5" />
                    <span>Mực</span>
                  </button>

                  <div className="flex items-center border border-[#D6CEBE] bg-[#FBF9F5] rounded-sm">
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.max(50, z - 25))}
                      disabled={zoomLevel <= 50}
                      aria-label="Thu nhỏ ảnh"
                      className="p-1.5 text-[#1C1917] hover:bg-[#F3EFE6] disabled:opacity-40"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-1.5 font-mono text-[11px] text-[#1C1917] tabular-nums">
                      {zoomLevel}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.min(200, z + 25))}
                      disabled={zoomLevel >= 200}
                      aria-label="Phóng to ảnh"
                      className="p-1.5 text-[#1C1917] hover:bg-[#F3EFE6] disabled:opacity-40"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsFullscreen(true)}
                    aria-label="Xem ảnh toàn màn hình"
                    className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-sm border border-[#D6CEBE] bg-[#FBF9F5] text-[#1C1917] hover:bg-[#1C1917] hover:text-[#FBF9F5] transition-colors whitespace-nowrap"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Toàn màn hình</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Image Canvas */}
          <div className="p-4 sm:p-6 overflow-auto max-h-[680px] flex items-center justify-center bg-[#E4DDD2]">
            {hasImage ? (
              <div
                className="relative inline-block transition-transform duration-200 origin-center shadow-sm border border-[#C7BFA9]"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top center',
                }}
              >
                <ArchivalImage
                  src={currentFolio.imageUrl}
                  alt={`${currentFolio.imageCategory || 'Ảnh tư liệu'} trang ${currentFolio.pageNumber} mã ${currentFolio.folioCode}: ${currentFolio.imageCaption}`}
                  imgClassName={`max-w-full w-[460px] h-auto block select-none transition-all duration-200 ${
                    highContrastInk ? 'contrast-125 grayscale-[25%] brightness-95' : ''
                  }`}
                />

                {showColumnGuides &&
                  activeColumns.map((col) => {
                    const isSelected = activeColumnId === col.id;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setActiveColumnId(isSelected ? null : col.id)}
                        title={`Chọn Cột ${col.columnIndex}: ${col.phienAm}`}
                        style={{
                          left: `${col.xPercent}%`,
                          top: `${col.yPercent}%`,
                          width: `${col.widthPercent}%`,
                          height: `${col.heightPercent}%`,
                        }}
                        className={`absolute border transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-[#8C2D19] bg-[#8C2D19]/20'
                            : 'border-[#8C2D19]/45 bg-[#8C2D19]/5 hover:bg-[#8C2D19]/15'
                        }`}
                      >
                        <span className="sr-only">Cột {col.columnIndex}</span>
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[10px] px-1 bg-[#1C1917] text-[#FBF9F5]">
                          {col.columnIndex}
                        </span>
                      </button>
                    );
                  })}
              </div>
            ) : (
              <div className="w-full min-h-[420px] flex flex-col items-center justify-center text-center p-8 bg-[#FBF9F5] border border-dashed border-[#C7BFA9]">
                <FileText className="w-8 h-8 text-[#8C2D19] mb-4 opacity-80" strokeWidth={1.5} />
                <p className="font-display text-xl font-semibold text-[#1C1917]">
                  Khu vực chờ bổ sung ảnh — Trang {String(currentFolio.pageNumber).padStart(2, '0')}
                </p>
                <p className="mt-2 text-sm text-[#57534E] max-w-md leading-relaxed">
                  Mã trang <span className="font-mono text-[#1C1917]">{currentFolio.folioCode}</span>{' '}
                  · Trạng thái: <strong>{currentFolio.verificationStatus}</strong>. Chưa có ảnh chụp
                  thực tế của bản A.1046; không tự tạo ảnh giả làm ảnh gốc.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => onSelectPage(currentFolio.sectionPart === 'phan-2' ? 43 : 1)}
                    className="px-4 py-2 text-xs font-semibold text-[#FBF9F5] bg-[#1C1917] hover:bg-[#8C2D19] rounded-sm transition-colors"
                  >
                    Xem mẫu đối chiếu {currentFolio.sectionPart === 'phan-2' ? 'Trang 43' : 'Trang 01'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Image Metadata Footer */}
          <div className="px-4 py-3 border-t border-[#D6CEBE] bg-[#FBF9F5] text-xs space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[#1C1917]">
              <span className="font-medium">{currentFolio.imageCaption}</span>
              <span className="font-mono text-[11px] text-[#8C2D19]">
                {currentFolio.imageCategory || 'Chưa phân loại ảnh'}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-[#57534E]">
              <span>Nguồn: {currentFolio.imageSource}</span>
            </div>
          </div>
        </section>

        {/* Right Pane: Synchronized Digital Transcription & 3-Layer Reading */}
        <section
          aria-label="Văn bản phiên chép số"
          className="lg:col-span-6 border border-[#D6CEBE] bg-[#FBF9F5] flex flex-col"
        >
          {/* Transcription Mode Toolbar */}
          <div className="px-4 py-3 border-b border-[#D6CEBE] bg-[#F6F2EA] flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#1C1917]">
              Nội dung phiên chép &amp; Dịch nghĩa
            </span>

            <div className="flex flex-wrap items-center gap-1 p-0.5 border border-[#D6CEBE] bg-[#EBE6DF] rounded-sm">
              {(
                [
                  { id: 'three-layer', label: 'Song song 3 lớp' },
                  { id: 'han-nom', label: 'Phiên chép Hán Nôm' },
                  { id: 'vietnamese', label: 'Dịch nghĩa' },
                  {
                    id: 'uncertain',
                    label: `Chưa đọc / Xác minh (${uncertainMarks.length})`,
                  },
                ] as { id: ReadingMode; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setReadingMode(tab.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-sm transition-colors whitespace-nowrap ${
                    readingMode === tab.id
                      ? 'bg-[#FBF9F5] text-[#1C1917] shadow-xs'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Transcription Body */}
          <div className="p-5 sm:p-6 space-y-5">
            <div className="pb-4 border-b border-[#E5DEC9] space-y-3">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#57534E]">
                  <span>{currentFolio.sectionLabel}</span>
                  <span className="font-mono text-[#8C2D19]">
                    {currentFolio.identifier} · {currentFolio.folioCode}
                  </span>
                </div>
                <h2 className="mt-1 font-display text-xl font-semibold text-[#1C1917]">
                  {currentFolio.title}
                </h2>
                <p className="mt-1.5 text-sm text-[#44403C] leading-relaxed">
                  {currentFolio.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                <div className="border border-[#D6CEBE] bg-[#F6F2EA] p-2.5">
                  <span className="font-semibold text-[#8C2D19] uppercase tracking-wider">
                    Kiểm chứng Phiên âm:
                  </span>{' '}
                  <span className="text-[#292524]">
                    {currentFolio.archivalRecord.transcriptionAndTranslation.phienAmVerification}
                  </span>
                </div>
                <div className="border border-[#D6CEBE] bg-[#F6F2EA] p-2.5">
                  <span className="font-semibold text-[#57534E] uppercase tracking-wider">
                    Kiểm chứng Dịch nghĩa:
                  </span>{' '}
                  <span className="text-[#292524]">
                    {currentFolio.archivalRecord.transcriptionAndTranslation.dichNghiaVerification}
                  </span>
                </div>
              </div>
            </div>

            {readingMode === 'three-layer' && (
              <div className="space-y-4">
                <div className="border border-[#E5DEC9] bg-[#F6F2EA] p-3 flex items-center gap-4">
                  <div className="w-16 h-20 shrink-0 border border-[#D6CEBE] bg-[#EBE6DF] overflow-hidden flex items-center justify-center">
                    {hasImage ? (
                      <ArchivalImage
                        src={currentFolio.imageUrl}
                        alt={`Ảnh gốc thu gọn ${currentFolio.folioCode}`}
                        imgClassName="w-full h-full object-cover"
                      />
                    ) : (
                      <FileText className="w-5 h-5 text-[#78716C]" />
                    )}
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-semibold text-[#1C1917]">
                      Lớp 1 · Ảnh trang ({currentFolio.folioCode})
                    </p>
                    <p className="text-[#57534E]">
                      {hasImage
                        ? `${currentFolio.imageCategory || 'Ảnh bản sao số hóa'} — đối chiếu trực tiếp với khung ảnh bên trái.`
                        : 'Đang chờ bổ sung ảnh chụp gốc từ đơn vị lưu giữ.'}
                    </p>
                  </div>
                </div>

                {activeColumns.length > 0 ? (
                  <div className="divide-y divide-[#E5DEC9]">
                    {activeColumns.map((col) => {
                      const isHighlighted = activeColumnId === col.id;
                      return (
                        <button
                          key={col.id}
                          type="button"
                          onClick={() => setActiveColumnId(isHighlighted ? null : col.id)}
                          className={`w-full text-left py-4 px-3 -mx-3 rounded-sm transition-colors ${
                            isHighlighted ? 'bg-[#8C2D19]/8' : 'hover:bg-[#F6F2EA]'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#57534E]">
                            <span className="font-mono text-[#8C2D19] font-medium">
                              Cột {String(col.columnIndex).padStart(2, '0')}
                              {col.isUncertain ? ' · Có chữ cần xác minh' : ''}
                            </span>
                            <span>
                              {isHighlighted ? 'Đang định vị trên ảnh' : 'Nhấp để đối chiếu cột'}
                            </span>
                          </div>

                          <div className="mt-2 space-y-2">
                            <div>
                              <span className="text-[11px] uppercase tracking-wider text-[#78716C]">
                                Lớp 2 · Phiên chép Hán Nôm
                              </span>
                              <p className="font-display text-lg text-[#1C1917] tracking-wide mt-0.5">
                                {col.hanNom}
                              </p>
                              <p className="text-xs font-medium italic text-[#57534E] mt-0.5">
                                Phiên âm: {col.phienAm}
                              </p>
                            </div>
                            <div>
                              <span className="text-[11px] uppercase tracking-wider text-[#78716C]">
                                Lớp 3 · Dịch nghĩa tiếng Việt
                              </span>
                              <p className="text-sm text-[#292524] leading-relaxed mt-0.5">
                                {col.dichNghia}
                              </p>
                            </div>
                            {col.isUncertain && col.uncertainNote && (
                              <p className="text-xs text-[#8C2D19] bg-[#8C2D19]/6 px-2.5 py-1.5 border border-[#8C2D19]/25">
                                Lưu ý chữ chưa xác minh: {col.uncertainNote}
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : currentFolio.transcriptionText || currentFolio.translationText ? (
                  <div className="space-y-4">
                    <div className="border border-[#E5DEC9] p-4 bg-[#FBF9F5]">
                      <p className="text-xs uppercase tracking-wider text-[#78716C]">
                        Lớp 2 · Phiên chép Hán Nôm
                      </p>
                      <p className="mt-2 font-display text-base text-[#1C1917] whitespace-pre-line leading-relaxed">
                        {currentFolio.transcriptionText || 'Chưa có văn bản phiên chép Hán Nôm.'}
                      </p>
                    </div>
                    <div className="border border-[#E5DEC9] p-4 bg-[#FBF9F5]">
                      <p className="text-xs uppercase tracking-wider text-[#78716C]">
                        Lớp 3 · Dịch nghĩa tiếng Việt
                      </p>
                      <p className="mt-2 text-sm text-[#292524] whitespace-pre-line leading-relaxed">
                        {currentFolio.translationText || 'Chưa có nội dung dịch nghĩa tiếng Việt.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <EmptyTranscriptionNotice folio={currentFolio} />
                )}
              </div>
            )}

            {readingMode === 'han-nom' && (
              <div className="space-y-4">
                {activeColumns.length > 0 ? (
                  <div className="divide-y divide-[#E5DEC9]">
                    {activeColumns.map((col) => (
                      <div key={col.id} className="py-3.5 space-y-1">
                        <span className="font-mono text-xs text-[#8C2D19]">
                          Cột {String(col.columnIndex).padStart(2, '0')}
                        </span>
                        <p className="font-display text-lg text-[#1C1917]">{col.hanNom}</p>
                        <p className="text-xs italic text-[#57534E]">Phiên âm: {col.phienAm}</p>
                      </div>
                    ))}
                  </div>
                ) : currentFolio.transcriptionText ? (
                  <p className="font-display text-base text-[#1C1917] whitespace-pre-line leading-relaxed">
                    {currentFolio.transcriptionText}
                  </p>
                ) : (
                  <EmptyTranscriptionNotice folio={currentFolio} />
                )}
              </div>
            )}

            {readingMode === 'vietnamese' && (
              <div className="space-y-4">
                {activeColumns.length > 0 ? (
                  <div className="divide-y divide-[#E5DEC9]">
                    {activeColumns.map((col) => (
                      <div key={col.id} className="py-3.5 space-y-1">
                        <p className="text-xs font-semibold text-[#57534E]">
                          Cột {String(col.columnIndex).padStart(2, '0')} · {col.phienAm}
                        </p>
                        <p className="text-sm text-[#1C1917] leading-relaxed">{col.dichNghia}</p>
                        <p className="text-xs text-[#57534E]">Ghi chú: {col.ghiChu}</p>
                      </div>
                    ))}
                  </div>
                ) : currentFolio.translationText ? (
                  <p className="text-sm text-[#1C1917] whitespace-pre-line leading-relaxed">
                    {currentFolio.translationText}
                  </p>
                ) : (
                  <EmptyTranscriptionNotice folio={currentFolio} />
                )}
              </div>
            )}

            {readingMode === 'uncertain' && (
              <div className="space-y-5">
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Danh mục những chữ Hán Nôm khó đọc, bị mờ nhòe, viết kiêng húy hoặc chưa thể xác
                  minh khi chưa đối chiếu trực tiếp bản lưu giữ A.1046.
                </p>

                {uncertainMarks.length === 0 ? (
                  <div className="border border-dashed border-[#D6CEBE] p-5 text-center text-xs text-[#57534E]">
                    Chưa có đánh dấu chữ chưa đọc cho trang {currentFolio.folioCode}.
                  </div>
                ) : (
                  <ul className="divide-y divide-[#E5DEC9] border-y border-[#E5DEC9]">
                    {uncertainMarks.map((mark) => (
                      <li key={mark.id} className="py-3.5 space-y-1.5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-display text-base font-semibold text-[#1C1917]">
                              {mark.glyphOrPhrase}
                            </p>
                            <p className="text-xs text-[#57534E]">Vị trí: {mark.locationNote}</p>
                          </div>
                          <span
                            className={`text-xs font-medium shrink-0 ${
                              mark.resolved ? 'text-[#14532D]' : 'text-[#8C2D19]'
                            }`}
                          >
                            {mark.resolved ? 'Đã xác minh' : 'Chưa xác minh'}
                          </span>
                        </div>
                        <p className="text-xs text-[#44403C] leading-relaxed">{mark.reason}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* 20-Field Standardized Record for Active Folio */}
      <section className="border border-[#D6CEBE] bg-[#FBF9F5] p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-[#E5DEC9]">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[#8C2D19] font-medium">
              Biên mục 20 trường chuẩn theo mẫu dự án B02
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-[#1C1917]">
              Hồ sơ trang {currentFolio.identifier} ({currentFolio.folioCode})
            </h2>
          </div>
          <span className="font-mono text-xs text-[#57534E]">
            Tệp đính kèm: {currentFolio.identifier}-anh-01.jpg
          </span>
        </div>

        <StandardArchivalRecordTable
          record={currentFolio.archivalRecord}
          onSelectRecordCode={(code) => {
            if (code.startsWith('B02-001')) {
              const pageNum = Number(code.slice(4)) - 100;
              if (pageNum >= 1 && pageNum <= folios.length) {
                onSelectPage(pageNum);
                setActiveColumnId(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }
          }}
        />
      </section>

      {/* 82-Page Inventory & Image Status Ledger */}
      <section className="pt-4 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-[#D6CEBE]">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[#57534E]">
              Tìm kiếm nội dung phiên chép &amp; Trạng thái ảnh 82 trang
            </p>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#1C1917]">
              Danh mục {folios.length} trang (B02-00101 – B02-00182 · A.1046-T01 – T82)
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm nội dung Hán Nôm, dịch nghĩa, mã trang..."
                aria-label="Tìm kiếm nội dung phiên chép trong 82 trang"
                className="pl-9 pr-3 py-2 text-xs bg-[#FBF9F5] border border-[#D6CEBE] rounded-sm text-[#1C1917] placeholder:text-[#78716C] focus:outline-none focus:border-[#8C2D19] w-72"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1 p-1 bg-[#EBE6DF] border border-[#D6CEBE] rounded-sm">
              {(
                [
                  { id: 'all', label: `Tất cả (${folios.length})` },
                  { id: 'with-image', label: `Đã có ảnh (${pagesWithImages.length})` },
                  {
                    id: 'missing-image',
                    label: `Chờ ảnh (${folios.length - pagesWithImages.length})`,
                  },
                  { id: 'phan-1', label: 'Phần I' },
                  { id: 'phan-2', label: 'Phần II' },
                ] as { id: PartFilter; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPartFilter(tab.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-sm transition-colors whitespace-nowrap ${
                    partFilter === tab.id
                      ? 'bg-[#FBF9F5] text-[#1C1917]'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Clean Tabular Ledger */}
        <div className="border border-[#D6CEBE] bg-[#FBF9F5] overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[740px]">
            <thead>
              <tr className="border-b border-[#D6CEBE] bg-[#F3EFE6] text-xs uppercase tracking-[0.08em] text-[#57534E]">
                <th className="py-3 px-4 font-semibold w-20">Trang</th>
                <th className="py-3 px-4 font-semibold w-32">Mã trang</th>
                <th className="py-3 px-4 font-semibold">Tiêu đề &amp; Trích đoạn phiên chép</th>
                <th className="py-3 px-4 font-semibold w-44">Ảnh trang</th>
                <th className="py-3 px-4 font-semibold w-36">Xác minh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DEC9] text-sm">
              {filteredCatalog.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 px-4 text-center text-[#57534E]">
                    Không tìm thấy trang tư liệu phù hợp với từ khóa "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredCatalog.map((item) => {
                  const isCurrent = item.pageNumber === selectedPage;
                  return (
                    <tr
                      key={item.folioCode}
                      onClick={() => {
                        onSelectPage(item.pageNumber);
                        setActiveColumnId(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`cursor-pointer transition-colors ${
                        isCurrent ? 'bg-[#8C2D19]/8' : 'hover:bg-[#F6F2EA]'
                      }`}
                    >
                      <td className="py-3 px-4 font-mono text-xs text-[#1C1917] tabular-nums font-medium">
                        Tr. {String(item.pageNumber).padStart(2, '0')}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-[#57534E] tabular-nums">
                        <div className="font-semibold text-[#8C2D19]">{item.identifier}</div>
                        <div className="text-[11px]">{item.folioCode}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#1C1917]">{item.title}</div>
                        <div className="text-xs text-[#57534E] mt-0.5 line-clamp-1">
                          {item.transcriptionText ? item.transcriptionText : item.sectionLabel}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {item.imageUrl ? (
                          <span className="font-medium text-[#1C1917]">
                            {item.imageCategory || 'Đã gắn ảnh'}
                          </span>
                        ) : (
                          <span className="text-[#78716C] italic">Chờ bổ sung ảnh</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs">
                        <span
                          className={
                            item.verificationStatus === 'Dữ liệu mẫu' ||
                            item.verificationStatus === 'Đã xác minh'
                              ? 'font-semibold text-[#8C2D19]'
                              : 'text-[#57534E]'
                          }
                        >
                          {item.verificationStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && hasImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Chế độ xem ảnh tư liệu toàn màn hình"
          className="fixed inset-0 z-50 bg-[#1C1917]/95 text-[#FBF9F5] flex flex-col"
        >
          <div className="px-6 py-4 border-b border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm">
              <span className="font-mono text-[#E5DEC9]">{currentFolio.folioCode}</span>
              <span aria-hidden="true">·</span>
              <span className="font-display font-semibold">{currentFolio.title}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(50, z - 25))}
                className="px-2.5 py-1.5 text-xs border border-white/25 hover:bg-white/10 rounded-sm"
              >
                Thu nhỏ
              </button>
              <span className="font-mono text-xs tabular-nums">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(200, z + 25))}
                className="px-2.5 py-1.5 text-xs border border-white/25 hover:bg-white/10 rounded-sm"
              >
                Phóng to
              </button>
              <button
                type="button"
                onClick={() => setHighContrastInk((prev) => !prev)}
                className="px-2.5 py-1.5 text-xs border border-white/25 hover:bg-white/10 rounded-sm"
              >
                {highContrastInk ? 'Mực chuẩn' : 'Tăng mực'}
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#8C2D19] hover:bg-white hover:text-[#1C1917] rounded-sm transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Đóng</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 flex flex-col items-center overflow-auto gap-3">
              <img
                src={currentFolio.imageUrl}
                alt={`Xem toàn màn hình ${currentFolio.identifier} (${currentFolio.folioCode})`}
                referrerPolicy="no-referrer"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                className={`select-none max-w-full w-[640px] h-auto transition-transform duration-200 ${
                  highContrastInk ? 'contrast-125 grayscale-[25%] brightness-95' : ''
                }`}
              />
              <p className="text-[11px] text-[#D6CEBE] text-center">
                Ảnh giảm kích thước phục vụ học tập phi lợi nhuận — không cho tải ảnh độ phân giải cao (Điều 63 Luật 2024).
              </p>
            </div>

            <div className="lg:col-span-4 border border-white/15 bg-white/5 p-5 space-y-4 text-sm">
              <p className="text-xs uppercase tracking-widest text-[#D6CEBE]">
                Văn bản phiên chép đối chiếu
              </p>
              {activeColumns.length > 0 ? (
                <div className="space-y-4">
                  {activeColumns.map((col) => (
                    <div key={col.id} className="pb-3 border-b border-white/10 space-y-1">
                      <span className="font-mono text-xs text-[#E5DEC9]">
                        Cột {String(col.columnIndex).padStart(2, '0')}
                      </span>
                      <p className="font-display text-base text-white">{col.hanNom}</p>
                      <p className="text-xs italic text-[#D6CEBE]">{col.phienAm}</p>
                      <p className="text-xs text-white/85 leading-relaxed">{col.dichNghia}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#D6CEBE] whitespace-pre-line">
                  {currentFolio.transcriptionText ||
                    currentFolio.translationText ||
                    'Chưa có nội dung phiên chép cho trang này.'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EmptyTranscriptionNotice: React.FC<{
  folio: FolioRecord;
}> = ({ folio }) => (
  <div className="py-6 space-y-4">
    <div className="flex items-start gap-2.5 border border-[#D6CEBE] bg-[#F6F2EA] p-4 text-xs text-[#44403C]">
      <AlertCircle className="w-4 h-4 text-[#8C2D19] shrink-0 mt-0.5" />
      <p>
        Trang <strong>{folio.folioCode}</strong> chưa có dữ liệu phiên chép Hán Nôm và dịch nghĩa
        tiếng Việt. Không tự tạo văn bản thay thế bản gốc.
      </p>
    </div>
    <dl className="divide-y divide-[#E5DEC9] border-y border-[#E5DEC9] text-sm">
      <div className="py-3 flex justify-between gap-4">
        <dt className="text-[#57534E]">Mã trang biên mục</dt>
        <dd className="font-mono text-[#1C1917]">{folio.folioCode}</dd>
      </div>
      <div className="py-3 flex justify-between gap-4">
        <dt className="text-[#57534E]">Trạng thái xác minh</dt>
        <dd className="text-[#8C2D19] font-medium">{folio.verificationStatus}</dd>
      </div>
      <div className="py-3 flex justify-between gap-4">
        <dt className="text-[#57534E]">Phân đoạn tài liệu</dt>
        <dd className="text-[#1C1917]">{folio.sectionLabel}</dd>
      </div>
    </dl>
  </div>
);
