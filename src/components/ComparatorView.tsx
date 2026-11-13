import React, { useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Contrast,
  Eye,
  EyeOff,
  FileText,
  Info,
  Search,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { FOLIO_CATALOG, FolioRecord, ManuscriptColumnLine } from '../data/archiveData';
import { ArchivalImage } from './ArchivalImage';

interface ComparatorViewProps {
  selectedPage: number;
  onSelectPage: (pageNumber: number) => void;
}

type ReadingMode = 'parallel' | 'vietnamese' | 'notes';
type PartFilter = 'all' | 'phan-1' | 'phan-2' | 'prototype';

export const ComparatorView: React.FC<ComparatorViewProps> = ({
  selectedPage,
  onSelectPage,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [highContrastInk, setHighContrastInk] = useState<boolean>(false);
  const [showColumnGuides, setShowColumnGuides] = useState<boolean>(true);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [readingMode, setReadingMode] = useState<ReadingMode>('parallel');
  const [partFilter, setPartFilter] = useState<PartFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentFolio: FolioRecord =
    FOLIO_CATALOG.find((item) => item.pageNumber === selectedPage) || FOLIO_CATALOG[0];

  const activeColumns: ManuscriptColumnLine[] = currentFolio.columns || [];

  const filteredCatalog = useMemo(() => {
    return FOLIO_CATALOG.filter((item) => {
      if (partFilter === 'phan-1' && item.sectionPart !== 'phan-1') return false;
      if (partFilter === 'phan-2' && item.sectionPart !== 'phan-2') return false;
      if (partFilter === 'prototype' && item.status !== 'prototype') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchNumber = String(item.pageNumber).includes(q) || item.folioCode.toLowerCase().includes(q);
        const matchText =
          item.title.toLowerCase().includes(q) ||
          item.sectionLabel.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q);
        return matchNumber || matchText;
      }
      return true;
    });
  }, [partFilter, searchQuery]);

  const handleStepPage = (delta: number) => {
    const next = Math.min(82, Math.max(1, selectedPage + delta));
    onSelectPage(next);
    setActiveColumnId(null);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-10 space-y-12">
      {/* Header & Page Navigation Bar */}
      <div className="space-y-4 pb-6 border-b border-[#D6CEBE]">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#57534E]">
          <span>Ký hiệu A.1046</span>
          <span aria-hidden="true">·</span>
          <span>Bối Khê Trạng nguyên gia phả</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-[#1C1917] tabular-nums">
            Trang {String(currentFolio.pageNumber).padStart(2, '0')} / 82
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
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
                onClick={() => onSelectPage(1)}
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
                onClick={() => onSelectPage(2)}
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
                onClick={() => onSelectPage(43)}
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
              <span className="px-3 font-mono text-xs text-[#1C1917] tabular-nums">
                {String(selectedPage).padStart(2, '0')} / 82
              </span>
              <button
                type="button"
                onClick={() => handleStepPage(1)}
                disabled={selectedPage >= 82}
                aria-label="Trang kế tiếp"
                className="p-2 text-[#1C1917] hover:bg-[#F3EFE6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Archival Honesty & Status Banner */}
      <div className="border border-[#D6CEBE] bg-[#F3EFE6] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3 text-xs sm:text-sm text-[#44403C] leading-relaxed">
          <Info className="w-4 h-4 text-[#8C2D19] shrink-0 mt-0.5" />
          <p>
            <strong className="text-[#1C1917]">Trạng thái bản A.1046:</strong>{' '}
            {currentFolio.status === 'prototype'
              ? 'Đang hiển thị bản mẫu mô phỏng quy trình đối chiếu cột Hán Nôm – Quốc ngữ. Ảnh chụp gốc của bản A.1046 sẽ được cập nhật sau khi được Thư viện Viện Nghiên cứu Hán Nôm cho phép tiếp cận và sao chụp.'
              : `Trang ${String(currentFolio.pageNumber).padStart(2, '0')} nằm trong danh mục ~82 trang dự kiến số hóa. Hiện chưa có ảnh chụp gốc và văn bản phiên chép do quyền tiếp cận tư liệu đang trong quá trình xác minh.`}
          </p>
        </div>
        <span className="font-mono text-[11px] text-[#8C2D19] whitespace-nowrap shrink-0">
          {currentFolio.folioCode}
        </span>
      </div>

      {/* Split-Screen Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Manuscript Folio Viewer */}
        <section
          aria-label="Ảnh chụp trang tư liệu"
          className="lg:col-span-6 border border-[#D6CEBE] bg-[#F3EFE6] flex flex-col"
        >
          {/* Viewer Toolbar */}
          <div className="px-4 py-3 border-b border-[#D6CEBE] bg-[#EBE6DF] flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#1C1917]">
              Ảnh trang tư liệu
            </span>

            <div className="flex flex-wrap items-center gap-2">
              {currentFolio.status === 'prototype' && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowColumnGuides((prev) => !prev)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-sm border transition-colors whitespace-nowrap ${
                      showColumnGuides
                        ? 'bg-[#1C1917] text-[#FBF9F5] border-[#1C1917]'
                        : 'bg-[#FBF9F5] text-[#1C1917] border-[#D6CEBE] hover:bg-[#F3EFE6]'
                    }`}
                  >
                    {showColumnGuides ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>Khung cột</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHighContrastInk((prev) => !prev)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-sm border transition-colors whitespace-nowrap ${
                      highContrastInk
                        ? 'bg-[#8C2D19] text-[#FBF9F5] border-[#8C2D19]'
                        : 'bg-[#FBF9F5] text-[#1C1917] border-[#D6CEBE] hover:bg-[#F3EFE6]'
                    }`}
                  >
                    <Contrast className="w-3.5 h-3.5" />
                    <span>Tăng nét mực</span>
                  </button>

                  <div className="flex items-center border border-[#D6CEBE] bg-[#FBF9F5] rounded-sm">
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.max(100, z - 25))}
                      disabled={zoomLevel <= 100}
                      aria-label="Thu nhỏ ảnh"
                      className="p-1.5 text-[#1C1917] hover:bg-[#F3EFE6] disabled:opacity-40"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 font-mono text-[11px] text-[#1C1917] tabular-nums">
                      {zoomLevel}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.min(175, z + 25))}
                      disabled={zoomLevel >= 175}
                      aria-label="Phóng to ảnh"
                      className="p-1.5 text-[#1C1917] hover:bg-[#F3EFE6] disabled:opacity-40"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Image Canvas */}
          <div className="p-4 sm:p-6 overflow-auto max-h-[680px] flex items-center justify-center bg-[#E4DDD2]">
            {currentFolio.status === 'prototype' && currentFolio.imageUrl ? (
              <div
                className="relative inline-block transition-transform duration-200 origin-center shadow-sm border border-[#C7BFA9]"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top center',
                }}
              >
                <ArchivalImage
                  src={currentFolio.imageUrl}
                  alt={`Minh họa tờ giấy bản trang ${currentFolio.pageNumber} ký hiệu ${currentFolio.folioCode}`}
                  imgClassName={`max-w-full w-[460px] h-auto block select-none transition-all duration-200 ${
                    highContrastInk ? 'contrast-125 grayscale-[25%] brightness-95' : ''
                  }`}
                />

                {/* Interactive Column Overlays */}
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
                  Trang {String(currentFolio.pageNumber).padStart(2, '0')} — Chờ ảnh chụp tư liệu gốc
                </p>
                <p className="mt-2 text-sm text-[#57534E] max-w-md leading-relaxed">
                  Vị trí lưu giữ ảnh số hóa của tờ số {currentFolio.pageNumber} trong tài liệu{' '}
                  <span className="font-mono text-[#1C1917]">A.1046</span>. Sẽ được nạp sau khi có
                  sự đồng ý sao chụp từ Thư viện Viện Nghiên cứu Hán Nôm.
                </p>
                <button
                  type="button"
                  onClick={() => onSelectPage(currentFolio.sectionPart === 'phan-2' ? 43 : 1)}
                  className="mt-5 px-4 py-2 text-xs font-semibold text-[#FBF9F5] bg-[#1C1917] hover:bg-[#8C2D19] rounded-sm transition-colors"
                >
                  Xem mẫu đối chiếu {currentFolio.sectionPart === 'phan-2' ? 'Trang 43' : 'Trang 01'}
                </button>
              </div>
            )}
          </div>

          <div className="px-4 py-2.5 border-t border-[#D6CEBE] bg-[#FBF9F5] text-xs text-[#57534E] flex flex-wrap items-center justify-between gap-2">
            <span>
              {currentFolio.status === 'prototype'
                ? 'Nhấp vào các khung cột đánh số (1–4) trên ảnh để đối chiếu trực tiếp với văn bản bên phải.'
                : 'Khung chờ ảnh chụp độ phân giải cao (TIFF/JPEG lưu trữ).'}
            </span>
            <span className="font-mono text-[11px] tabular-nums">
              {currentFolio.sectionPart === 'phan-1' ? 'Phần I (Tr. 01–42)' : 'Phần II (Tr. 43–82)'}
            </span>
          </div>
        </section>

        {/* Right Pane: Synchronized Digital Transcription */}
        <section
          aria-label="Văn bản phiên chép số"
          className="lg:col-span-6 border border-[#D6CEBE] bg-[#FBF9F5] flex flex-col"
        >
          {/* Transcription Mode Toolbar */}
          <div className="px-4 py-3 border-b border-[#D6CEBE] bg-[#F6F2EA] flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#1C1917]">
              Nội dung phiên chép số
            </span>

            <div className="flex items-center gap-1 p-0.5 border border-[#D6CEBE] bg-[#EBE6DF] rounded-sm">
              <button
                type="button"
                onClick={() => setReadingMode('parallel')}
                className={`px-2.5 py-1 text-xs font-medium rounded-sm transition-colors whitespace-nowrap ${
                  readingMode === 'parallel'
                    ? 'bg-[#FBF9F5] text-[#1C1917] shadow-xs'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                Song song 3 lớp
              </button>
              <button
                type="button"
                onClick={() => setReadingMode('vietnamese')}
                className={`px-2.5 py-1 text-xs font-medium rounded-sm transition-colors whitespace-nowrap ${
                  readingMode === 'vietnamese'
                    ? 'bg-[#FBF9F5] text-[#1C1917] shadow-xs'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                Dịch nghĩa
              </button>
              <button
                type="button"
                onClick={() => setReadingMode('notes')}
                className={`px-2.5 py-1 text-xs font-medium rounded-sm transition-colors whitespace-nowrap ${
                  readingMode === 'notes'
                    ? 'bg-[#FBF9F5] text-[#1C1917] shadow-xs'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                Khảo dị
              </button>
            </div>
          </div>

          {/* Transcription Body */}
          <div className="p-5 sm:p-6 space-y-4">
            <div className="pb-4 border-b border-[#E5DEC9]">
              <p className="text-xs text-[#57534E]">{currentFolio.sectionLabel}</p>
              <h2 className="mt-1 font-display text-xl font-semibold text-[#1C1917]">
                {currentFolio.title}
              </h2>
              <p className="mt-1.5 text-sm text-[#44403C] leading-relaxed">
                {currentFolio.summary}
              </p>
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
                      <div className="flex items-center justify-between gap-2 text-xs text-[#57534E]">
                        <span className="font-mono text-[#8C2D19] font-medium">
                          Cột {String(col.columnIndex).padStart(2, '0')}
                        </span>
                        <span>{isHighlighted ? 'Đang chọn đối chiếu' : 'Nhấp để định vị trên ảnh'}</span>
                      </div>

                      {readingMode === 'parallel' && (
                        <div className="mt-2 space-y-1.5">
                          <p className="font-display text-lg text-[#1C1917] tracking-wide">
                            {col.hanNom}
                          </p>
                          <p className="text-sm font-medium italic text-[#44403C]">
                            Phiên âm: {col.phienAm}
                          </p>
                          <p className="text-sm text-[#292524] leading-relaxed">
                            Dịch nghĩa: {col.dichNghia}
                          </p>
                        </div>
                      )}

                      {readingMode === 'vietnamese' && (
                        <div className="mt-2 space-y-1">
                          <p className="text-sm font-semibold text-[#1C1917]">{col.phienAm}</p>
                          <p className="text-sm text-[#292524] leading-relaxed">{col.dichNghia}</p>
                        </div>
                      )}

                      {readingMode === 'notes' && (
                        <div className="mt-2 space-y-1">
                          <p className="text-sm font-medium text-[#1C1917]">{col.phienAm}</p>
                          <p className="text-sm text-[#44403C] leading-relaxed">{col.ghiChu}</p>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 space-y-4">
                <p className="text-sm font-medium text-[#1C1917]">
                  Khung dữ liệu dự kiến cho trang {String(currentFolio.pageNumber).padStart(2, '0')}:
                </p>
                <dl className="divide-y divide-[#E5DEC9] border-y border-[#E5DEC9] text-sm">
                  <div className="py-3 flex justify-between gap-4">
                    <dt className="text-[#57534E]">Mã trang biên mục</dt>
                    <dd className="font-mono text-[#1C1917]">{currentFolio.folioCode}</dd>
                  </div>
                  <div className="py-3 flex justify-between gap-4">
                    <dt className="text-[#57534E]">Nguyên tác chữ Hán Nôm</dt>
                    <dd className="text-[#57534E] italic">Chờ phiên chép sau tiếp cận</dd>
                  </div>
                  <div className="py-3 flex justify-between gap-4">
                    <dt className="text-[#57534E]">Phiên âm &amp; Dịch nghĩa</dt>
                    <dd className="text-[#57534E] italic">Chờ hiệu đính chuyên môn</dd>
                  </div>
                  <div className="py-3 flex justify-between gap-4">
                    <dt className="text-[#57534E]">Trích xuất thế thứ phả hệ</dt>
                    <dd className="text-[#1C1917]">
                      {currentFolio.sectionPart === 'phan-2'
                        ? 'Thuộc phần Thế thứ (đầu vào cây phả hệ)'
                        : 'Thuộc phần Hành trạng / Gia phả'}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* 82-Page Inventory Ledger */}
      <section className="pt-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#D6CEBE]">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[#57534E]">
              Danh mục biên mục dự kiến
            </p>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#1C1917]">
              Mục lục 82 trang tư liệu A.1046
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm số trang hoặc tiêu đề..."
                aria-label="Tìm kiếm trong 82 trang tư liệu"
                className="pl-9 pr-3 py-2 text-xs bg-[#FBF9F5] border border-[#D6CEBE] rounded-sm text-[#1C1917] placeholder:text-[#78716C] focus:outline-none focus:border-[#8C2D19] w-56"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1 p-1 bg-[#EBE6DF] border border-[#D6CEBE] rounded-sm">
              {(
                [
                  { id: 'all', label: 'Tất cả (82)' },
                  { id: 'phan-1', label: 'Phần I (1–42)' },
                  { id: 'phan-2', label: 'Phần II (43–82)' },
                  { id: 'prototype', label: 'Trang mẫu (3)' },
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
          <table className="w-full text-left border-collapse min-w-[680px]">
            <thead>
              <tr className="border-b border-[#D6CEBE] bg-[#F3EFE6] text-xs uppercase tracking-[0.08em] text-[#57534E]">
                <th className="py-3 px-4 font-semibold w-24">Trang</th>
                <th className="py-3 px-4 font-semibold w-32">Mã định danh</th>
                <th className="py-3 px-4 font-semibold">Nội dung dự kiến</th>
                <th className="py-3 px-4 font-semibold w-64">Tình trạng xử lý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DEC9] text-sm">
              {filteredCatalog.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 px-4 text-center text-[#57534E]">
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
                        {item.folioCode}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#1C1917]">{item.title}</div>
                        <div className="text-xs text-[#57534E] mt-0.5">{item.sectionLabel}</div>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        <span
                          className={
                            item.status === 'prototype'
                              ? 'font-semibold text-[#8C2D19]'
                              : 'text-[#57534E]'
                          }
                        >
                          {item.statusLabel}
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
    </div>
  );
};
