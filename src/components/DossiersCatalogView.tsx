import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  FileText,
  GitFork,
  Info,
  Search,
} from 'lucide-react';
import type {
  DocumentDossier,
  DossierContentType,
  GenealogyNode,
} from '../types/archive';
import { ArchivalImage } from './ArchivalImage';
import { StandardArchivalRecordTable } from './StandardArchivalRecordTable';

interface DossiersCatalogViewProps {
  dossiers: DocumentDossier[];
  characters: GenealogyNode[];
  totalFolioPages: number;
  onOpenPage: (pageNumber: number) => void;
  onOpenGenealogy: () => void;
}

const CONTENT_TYPES: ('all' | DossierContentType)[] = [
  'all',
  'Phả tự & Mở đầu',
  'Hành trạng Trạng nguyên',
  'Thế thứ dòng họ',
  'Biểu ghi & Hậu ký',
  'Pháp lý & Lưu trữ',
];

const VERIFICATION_FILTERS = [
  'all',
  'Dữ liệu mẫu',
  'Đang xác minh',
  'Đã xác minh',
] as const;

export const DossiersCatalogView: React.FC<DossiersCatalogViewProps> = ({
  dossiers,
  characters,
  totalFolioPages,
  onOpenPage,
  onOpenGenealogy,
}) => {
  const [selectedId, setSelectedId] = useState<string>(dossiers[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | DossierContentType>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredDossiers = useMemo(() => {
    return dossiers.filter((d) => {
      if (typeFilter !== 'all' && d.contentType !== typeFilter) return false;
      if (statusFilter !== 'all' && d.verificationStatus !== statusFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.trim().toLowerCase();
        const rec = d.archivalRecord;
        return (
          d.dossierCode.toLowerCase().includes(q) ||
          d.documentName.toLowerCase().includes(q) ||
          d.generationInfo.toLowerCase().includes(q) ||
          d.relatedPages.toLowerCase().includes(q) ||
          (rec?.dating || '').toLowerCase().includes(q) ||
          (rec?.relations || '').toLowerCase().includes(q) ||
          (rec?.uncertainPoints || '').toLowerCase().includes(q) ||
          (rec?.currentRepository || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [dossiers, typeFilter, statusFilter, searchTerm]);

  const selectedDossier =
    dossiers.find((d) => d.id === selectedId) || filteredDossiers[0] || dossiers[0];

  const linkedChars = useMemo(() => {
    if (!selectedDossier) return [];
    return characters.filter((c) =>
      selectedDossier.linkedCharacterIds.includes(c.characterCode)
    );
  }, [characters, selectedDossier]);

  const handleSelectRecordCode = (code: string) => {
    const matchedDossier = dossiers.find(
      (d) => d.dossierCode.toUpperCase() === code.toUpperCase()
    );
    if (matchedDossier) {
      setSelectedId(matchedDossier.id);
      return;
    }
    if (code.startsWith('B02-001')) {
      const pageNum = Number(code.slice(4)) - 100;
      if (pageNum >= 1 && pageNum <= totalFolioPages) {
        onOpenPage(pageNum);
      }
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Header */}
      <header className="space-y-4 pb-6 border-b border-[#D6CEBE]">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#57534E]">
          <span>Dự án B02</span>
          <span aria-hidden="true">·</span>
          <span>Chuẩn biên mục 20 trường</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-[#1C1917]">B02-00001 – B02-00021 · Ký hiệu A.1046</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1C1917]">
              Hệ thống {dossiers.length} bản ghi tư liệu chuẩn 20 trường
            </h1>
            <p className="mt-2 text-sm text-[#44403C] max-w-3xl leading-relaxed">
              Quản lý có cấu trúc {dossiers.length} bản ghi mã định danh cố định (
              <span className="font-mono text-[#1C1917]">B02-00001</span> đến{' '}
              <span className="font-mono text-[#1C1917]">B02-00021</span>) cho ~{totalFolioPages}{' '}
              trang tập tư liệu <em>Bối Khê Trạng nguyên gia phả</em>, tuân thủ Điều 63 Luật Di sản
              văn hóa / Luật Lưu trữ 2024 và tách riêng mức kiểm chứng Phiên âm &amp; Dịch nghĩa.
            </p>
          </div>
        </div>
      </header>

      {/* Distinction Strip: 21 Records vs 82 Pages vs Verification Policy */}
      <div className="border border-[#D6CEBE] bg-[#F6F2EA]">
        <dl className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#D6CEBE]">
          <div className="p-5">
            <dt className="text-xs uppercase tracking-[0.1em] text-[#57534E]">
              Mã định danh bản ghi cố định
            </dt>
            <dd className="mt-1.5 font-display text-2xl font-semibold text-[#1C1917] tabular-nums">
              {dossiers.length} bản ghi (B02-00001 – 00021)
            </dd>
            <p className="mt-1 text-xs text-[#57534E]">
              Mã đề tài B02 kết hợp số thứ tự, cố định suốt đời bản ghi
            </p>
          </div>
          <div className="p-5">
            <dt className="text-xs uppercase tracking-[0.1em] text-[#57534E]">
              Quy mô trang đối chiếu A.1046
            </dt>
            <dd className="mt-1.5 font-display text-2xl font-semibold text-[#1C1917] tabular-nums">
              ~{totalFolioPages} trang (B02-00101 – 00182)
            </dd>
            <p className="mt-1 text-xs text-[#57534E]">
              Tách bạch giữa bản ghi nội dung (21 hồ sơ) và từng tờ trang (~82 trang)
            </p>
          </div>
          <div className="p-5">
            <dt className="text-xs uppercase tracking-[0.1em] text-[#57534E]">
              Nguyên tắc kiểm chứng &amp; công bố
            </dt>
            <dd className="mt-1.5 font-display text-xl font-semibold text-[#8C2D19]">
              20 trường · Điều 63 Luật 2024
            </dd>
            <p className="mt-1 text-xs text-[#57534E]">
              Tách riêng Phiên âm &amp; Dịch nghĩa; không cho tải ảnh độ phân giải cao
            </p>
          </div>
        </dl>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm mã định danh (B02-000...) hoặc nhan đề..."
              aria-label="Tìm kiếm theo nhan đề và mã định danh"
              className="pl-9 pr-3 py-2 text-xs bg-[#FBF9F5] border border-[#D6CEBE] rounded-sm text-[#1C1917] placeholder:text-[#78716C] focus:outline-none focus:border-[#8C2D19] w-72"
            />
          </div>

          <select
            aria-label="Lọc theo loại nội dung"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'all' | DossierContentType)}
            className="px-3 py-2 text-xs bg-[#FBF9F5] border border-[#D6CEBE] rounded-sm text-[#1C1917] focus:outline-none focus:border-[#8C2D19]"
          >
            {CONTENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t === 'all' ? 'Tất cả loại nội dung' : t}
              </option>
            ))}
          </select>

          <select
            aria-label="Lọc theo trạng thái xác minh"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#FBF9F5] border border-[#D6CEBE] rounded-sm text-[#1C1917] focus:outline-none focus:border-[#8C2D19]"
          >
            {VERIFICATION_FILTERS.map((st) => (
              <option key={st} value={st}>
                {st === 'all' ? 'Tất cả trạng thái' : st}
              </option>
            ))}
          </select>
        </div>

        <p className="text-xs text-[#57534E] tabular-nums">
          Đang hiển thị {filteredDossiers.length} / {dossiers.length} bản ghi
        </p>
      </div>

      {/* Split Master-Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 21 Records List */}
        <div className="lg:col-span-5 border border-[#D6CEBE] bg-[#FBF9F5] divide-y divide-[#E5DEC9] max-h-[860px] overflow-y-auto">
          {filteredDossiers.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#57534E]">
              Không tìm thấy bản ghi nào phù hợp.
            </div>
          ) : (
            filteredDossiers.map((dossier) => {
              const isSelected = selectedDossier?.id === dossier.id;
              return (
                <button
                  key={dossier.id}
                  type="button"
                  onClick={() => setSelectedId(dossier.id)}
                  className={`w-full text-left p-4 transition-colors ${
                    isSelected ? 'bg-[#8C2D19]/8 border-l-2 border-[#8C2D19]' : 'hover:bg-[#F6F2EA]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-mono font-semibold text-[#8C2D19]">
                      {dossier.dossierCode}
                    </span>
                    <span className="text-[#57534E]">{dossier.verificationStatus}</span>
                  </div>
                  <h2 className="mt-1.5 font-display text-base font-semibold text-[#1C1917]">
                    {dossier.documentName}
                  </h2>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-[#57534E]">
                    <span>{dossier.contentType}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{dossier.relatedPages}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Right: 20-Field Standardized Archival Record */}
        {selectedDossier && (
          <section className="lg:col-span-7 border border-[#D6CEBE] bg-[#FBF9F5] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#E5DEC9]">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E]">
                  <span className="font-mono font-semibold text-[#8C2D19]">
                    {selectedDossier.dossierCode}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedDossier.contentType}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{selectedDossier.relatedPages}</span>
                </div>
                <h2 className="font-display text-2xl font-semibold text-[#1C1917]">
                  {selectedDossier.documentName}
                </h2>
              </div>

              {selectedDossier.imagePath && (
                <div className="w-24 h-20 shrink-0 border border-[#D6CEBE] bg-[#EBE6DF] overflow-hidden">
                  <ArchivalImage
                    src={selectedDossier.imagePath}
                    alt={`Ảnh minh họa cấu trúc ${selectedDossier.dossierCode}`}
                  />
                </div>
              )}
            </div>

            {/* Archival Honesty & Verification Separation Notice */}
            <div className="border border-[#D6CEBE] bg-[#F6F2EA] p-4 flex items-start gap-3 text-xs text-[#44403C]">
              <Info className="w-4 h-4 text-[#8C2D19] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-[#1C1917]">
                  Hồ sơ biên mục 20 trường chuẩn ({selectedDossier.verificationStatus})
                </p>
                <p className="leading-relaxed">
                  <strong>Loại bản đang hiển thị:</strong>{' '}
                  {selectedDossier.archivalRecord.displayedCopyType}. Phần <strong>Phiên âm</strong>{' '}
                  và <strong>Dịch nghĩa</strong> được gắn nhãn kiểm chứng độc lập bên dưới để bảo đảm
                  tính trung thực học thuật.
                </p>
              </div>
            </div>

            {/* Quick Navigation & Linked Genealogy */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenPage(selectedDossier.primaryPage)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#FBF9F5] bg-[#1C1917] hover:bg-[#8C2D19] rounded-sm transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>
                  Mở trang {String(selectedDossier.primaryPage).padStart(2, '0')} trong Đối chiếu
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {linkedChars.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={onOpenGenealogy}
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs border border-[#D6CEBE] bg-[#F6F2EA] hover:border-[#8C2D19] rounded-sm transition-colors"
                >
                  <GitFork className="w-3.5 h-3.5 text-[#8C2D19]" />
                  <span>
                    {c.characterCode}: {c.name}
                  </span>
                </button>
              ))}
            </div>

            {/* 20 Standardized Archival Metadata Fields */}
            <StandardArchivalRecordTable
              record={selectedDossier.archivalRecord}
              onSelectRecordCode={handleSelectRecordCode}
            />
          </section>
        )}
      </div>
    </div>
  );
};
