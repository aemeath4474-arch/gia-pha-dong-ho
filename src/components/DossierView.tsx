import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Image as ImageIcon,
  Layers,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { checkReferenceSources } from '../api/archiveClient';
import { ARCHIVE_IMAGES } from '../data/seedData';
import type {
  ImageCategory,
  ImageProvenanceItem,
  LegalRightsInfo,
  MediaImageAsset,
  ReferenceSource,
  SourceCheckResult,
} from '../types/archive';
import { ArchivalImage } from './ArchivalImage';
import { StandardArchivalRecordTable } from './StandardArchivalRecordTable';

interface DossierViewProps {
  legalInfo: LegalRightsInfo;
  sources: ReferenceSource[];
  imageProvenance: ImageProvenanceItem[];
  mediaImages: MediaImageAsset[];
  dossierCount: number;
  folioCount: number;
}

const IMAGE_CATEGORIES: ImageCategory[] = [
  'Ảnh tư liệu gốc',
  'Ảnh bản sao số hóa',
  'Ảnh minh họa',
  'Ảnh sơ đồ',
  'Ảnh tài liệu tham khảo',
];

export const DossierView: React.FC<DossierViewProps> = ({
  legalInfo,
  sources,
  imageProvenance,
  mediaImages,
  dossierCount,
  folioCount,
}) => {
  const [checkingAll, setCheckingAll] = useState(false);
  const [checkingSourceId, setCheckingSourceId] = useState<number | null>(null);
  const [checkResults, setCheckResults] = useState<Record<number, SourceCheckResult>>({});
  const [checkError, setCheckError] = useState<string | null>(null);

  const [categoryFilter, setCategoryFilter] = useState<ImageCategory | 'all'>('all');
  const [mediaQuery, setMediaQuery] = useState('');

  const handleCheckSources = async (sourceIds?: number[]) => {
    setCheckError(null);
    if (sourceIds && sourceIds.length === 1) {
      setCheckingSourceId(sourceIds[0]);
    } else {
      setCheckingAll(true);
    }

    try {
      const res = await checkReferenceSources(sourceIds);
      setCheckResults((prev) => {
        const next = { ...prev };
        for (const item of res.results) {
          next[item.id] = item;
        }
        return next;
      });
    } catch (err) {
      setCheckError(
        err instanceof Error ? err.message : 'Không thể kiểm tra trạng thái nguồn tham khảo.'
      );
    } finally {
      setCheckingAll(false);
      setCheckingSourceId(null);
    }
  };

  const legalEvidenceImages = useMemo(() => {
    return mediaImages.filter(
      (item) =>
        item.category === 'Ảnh tài liệu tham khảo' &&
        (item.imageUrl.startsWith('/uploads/') ||
          item.dossierCode === 'B02-00021' ||
          /xác nhận|pháp lý|giấy phép|công văn|quyền/i.test(`${item.name} ${item.caption}`))
    );
  }, [mediaImages]);

  const filteredMediaImages = useMemo(() => {
    const q = mediaQuery.trim().toLowerCase();
    return mediaImages.filter((item) => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }
      if (!q) return true;
      return `${item.imageCode} ${item.dossierCode} ${item.folioCode} ${item.name} ${item.caption} ${item.source}`
        .toLowerCase()
        .includes(q);
    });
  }, [mediaImages, categoryFilter, mediaQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: mediaImages.length };
    for (const c of IMAGE_CATEGORIES) counts[c] = 0;
    for (const item of mediaImages) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, [mediaImages]);

  const institutionalIllustrations = [
    {
      id: 'ill-storage',
      title: 'Không gian lưu trữ & bảo quản tài liệu cổ',
      category: 'Ảnh minh họa' as ImageCategory,
      imageUrl: ARCHIVE_IMAGES.readingRoom,
      caption:
        'Ảnh minh họa không gian tủ kệ lưu trữ thư tịch Hán Nôm và khu vực tra cứu thư viện chuyên ngành.',
      source: 'Ảnh minh họa chuyên đề lưu trữ — dự án B02',
    },
    {
      id: 'ill-manuscript',
      title: 'Quy cách bản chép tay gia phả Hán Nôm',
      category: 'Ảnh minh họa' as ImageCategory,
      imageUrl: ARCHIVE_IMAGES.heroManuscript,
      caption:
        'Ảnh minh họa sách gia phả chữ Hán Nôm đóng gáy chỉ trên giấy dó cổ truyền (không phải bản scan A.1046).',
      source: 'Ảnh minh họa di sản văn bản Hán Nôm — dự án B02',
    },
    {
      id: 'ill-digitization',
      title: 'Quy trình chụp & biên mục số hóa tư liệu',
      category: 'Ảnh minh họa' as ImageCategory,
      imageUrl: ARCHIVE_IMAGES.digitizationStudio,
      caption:
        'Ảnh minh họa bàn chụp bảo tồn sử dụng ánh sáng dịu để số hóa từng tờ gia phả giấy dó mà không gây hư hại gáy sách.',
      source: 'Ảnh minh họa quy trình số hóa — dự án B02',
    },
    {
      id: 'ill-dossier',
      title: 'Hồ sơ quản lý danh mục & phiếu yêu cầu tiếp cận',
      category: 'Ảnh minh họa' as ImageCategory,
      imageUrl: ARCHIVE_IMAGES.archivalDossier,
      caption:
        'Ảnh minh họa bìa hồ sơ nghiệp vụ lưu trữ, phiếu mô tả biên mục và giấy tờ đăng ký nghiên cứu tư liệu.',
      source: 'Ảnh minh họa hồ sơ lưu trữ — dự án B02',
    },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-10 space-y-16">
      {/* Header */}
      <header className="space-y-4 pb-6 border-b border-[#D6CEBE]">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#57534E]">
          <span>Hồ sơ &amp; Pháp lý</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-[#1C1917]">{legalInfo.callNumber}</span>
          <span aria-hidden="true">·</span>
          <span>{legalInfo.repositoryName}</span>
          <span aria-hidden="true">·</span>
          <span
            className={`font-semibold ${
              legalInfo.verificationStatus === 'Đã xác minh' ? 'text-[#14532D]' : 'text-[#8C2D19]'
            }`}
          >
            {legalInfo.verificationStatus}
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1C1917] max-w-3xl [text-wrap:balance]">
          Hồ sơ tư liệu, quyền sử dụng &amp; chứng thực nguồn gốc hình ảnh
        </h1>
        <p className="text-sm sm:text-base text-[#44403C] max-w-3xl leading-relaxed">
          Tổng hợp thông tin biên mục, mô tả nội dung, kế hoạch số hóa ({dossierCount} hồ sơ quản
          lý cho ~{folioCount} trang tư liệu), tình trạng quyền tiếp cận – sao chụp – công khai và
          hệ thống chứng thực nguồn gốc từng hình ảnh sử dụng trên website.
        </p>
      </header>

      {/* Verification Status Banner */}
      {legalInfo.verificationStatus === 'Đã xác minh' ? (
        <div className="border border-[#14532D]/35 bg-[#14532D]/6 p-5 flex items-start gap-3 text-xs sm:text-sm text-[#1C1917]">
          <CheckCircle2 className="w-5 h-5 text-[#14532D] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-[#14532D]">
              Trạng thái xác minh hồ sơ pháp lý: Đã xác minh
            </p>
            <p className="text-[#44403C] leading-relaxed">
              Thông tin biên mục, đơn vị lưu giữ (<strong>{legalInfo.repositoryName}</strong>), ký
              hiệu tài liệu <span className="font-mono text-[#1C1917]">{legalInfo.callNumber}</span>,
              quyền công khai dữ liệu học thuật phi lợi nhuận và nguồn gốc toàn bộ hình ảnh trên
              website đã được rà soát, phân loại tách bạch và xác minh đầy đủ.
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-[#8C2D19]/35 bg-[#8C2D19]/6 p-5 flex items-start gap-3 text-xs sm:text-sm text-[#1C1917]">
          <AlertTriangle className="w-5 h-5 text-[#8C2D19] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-[#8C2D19]">
              Thông báo đối với các dữ liệu chưa xác minh
            </p>
            <p className="text-[#44403C] leading-relaxed">
              Hiện tại, thông tin xác nhận đồng ý công khai, quyền sao chụp và bản chụp gốc của tài
              liệu <span className="font-mono text-[#1C1917]">{legalInfo.callNumber}</span> vẫn đang
              trong quá trình liên hệ xác minh với <strong>{legalInfo.repositoryName}</strong>. Hệ
              thống tuyệt đối không tự tạo tên văn bản pháp lý, số giấy phép hay văn bản xác nhận giả.
            </p>
          </div>
        </div>
      )}

      {/* Archival & Digitization Visual Context (4 requested themes) */}
      <section className="space-y-6">
        <div className="pb-4 border-b border-[#D6CEBE]">
          <p className="text-xs uppercase tracking-[0.14em] text-[#8C2D19] font-medium">
            Minh họa quy trình lưu trữ &amp; số hóa
          </p>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#1C1917]">
            Hình ảnh lưu trữ tư liệu cổ, sách gia phả &amp; quy trình số hóa
          </h2>
          <p className="mt-1 text-xs text-[#57534E]">
            Tất cả hình ảnh dưới đây được phân loại rõ là <strong>Ảnh minh họa</strong> phục vụ trình
            bày nghiệp vụ lưu trữ, tách biệt hoàn toàn với ảnh chụp bản gốc A.1046.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {institutionalIllustrations.map((ill) => (
            <figure
              key={ill.id}
              className="border border-[#D6CEBE] bg-[#FBF9F5] flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[4/3] bg-[#EBE6DF] border-b border-[#D6CEBE] overflow-hidden">
                  <ArchivalImage src={ill.imageUrl} alt={ill.title} caption={ill.caption} />
                </div>
                <div className="p-4 space-y-2">
                  <div className="text-[11px] font-mono text-[#57534E] uppercase tracking-[0.06em]">
                    {ill.category}
                  </div>
                  <h3 className="font-display text-base font-semibold text-[#1C1917]">
                    {ill.title}
                  </h3>
                  <figcaption className="text-xs text-[#44403C] leading-relaxed">
                    {ill.caption}
                  </figcaption>
                </div>
              </div>
              <div className="px-4 py-2.5 border-t border-[#E5DEC9] bg-[#F6F2EA] text-[11px] text-[#57534E]">
                Nguồn: {ill.source}
              </div>
            </figure>
          ))}
        </div>
      </section>

      {/* Sections 1 to 6: Document Info, Call Number, Repository, Cataloging, Content, Plan */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-2">
          <p className="text-xs uppercase tracking-[0.14em] text-[#8C2D19] font-medium">
            Mục 01 – 06
          </p>
          <h2 className="font-display text-2xl font-semibold text-[#1C1917]">
            Biên mục &amp; Kế hoạch số hóa
          </h2>
          <p className="text-sm text-[#57534E] leading-relaxed">
            Thông số tư liệu <em>Bối Khê Trạng nguyên gia phả</em> phục vụ công tác liên hệ và đối
            chiếu lưu trữ.
          </p>
        </div>

        <div className="lg:col-span-8 border-t border-[#D6CEBE]">
          <dl className="divide-y divide-[#D6CEBE]">
            <div className="py-5 grid grid-cols-1 sm:grid-cols-12 gap-3">
              <dt className="sm:col-span-4 text-xs uppercase tracking-[0.1em] font-semibold text-[#57534E]">
                1. Thông tin tư liệu
              </dt>
              <dd className="sm:col-span-8 text-sm font-semibold text-[#1C1917]">
                {legalInfo.documentName}
              </dd>
            </div>

            <div className="py-5 grid grid-cols-1 sm:grid-cols-12 gap-3">
              <dt className="sm:col-span-4 text-xs uppercase tracking-[0.1em] font-semibold text-[#57534E]">
                2. Ký hiệu tài liệu
              </dt>
              <dd className="sm:col-span-8 font-mono text-sm font-semibold text-[#8C2D19]">
                {legalInfo.callNumber}
              </dd>
            </div>

            <div className="py-5 grid grid-cols-1 sm:grid-cols-12 gap-3">
              <dt className="sm:col-span-4 text-xs uppercase tracking-[0.1em] font-semibold text-[#57534E]">
                3. Đơn vị lưu giữ
              </dt>
              <dd className="sm:col-span-8 text-sm text-[#1C1917] space-y-1.5">
                <p className="font-semibold">{legalInfo.repositoryName}</p>
                <p className="flex items-start gap-2 text-[#44403C]">
                  <MapPin className="w-4 h-4 text-[#8C2D19] shrink-0 mt-0.5" />
                  <span>
                    {legalInfo.repositoryAddress} ({legalInfo.repositoryAddressNote})
                  </span>
                </p>
              </dd>
            </div>

            <div className="py-5 grid grid-cols-1 sm:grid-cols-12 gap-3">
              <dt className="sm:col-span-4 text-xs uppercase tracking-[0.1em] font-semibold text-[#57534E]">
                4. Thông tin biên mục
              </dt>
              <dd className="sm:col-span-8 text-sm text-[#44403C] leading-relaxed">
                {legalInfo.catalogingInfo}
              </dd>
            </div>

            <div className="py-5 grid grid-cols-1 sm:grid-cols-12 gap-3">
              <dt className="sm:col-span-4 text-xs uppercase tracking-[0.1em] font-semibold text-[#57534E]">
                5. Mô tả nội dung tài liệu
              </dt>
              <dd className="sm:col-span-8 text-sm text-[#44403C] leading-relaxed">
                {legalInfo.contentDescription}
              </dd>
            </div>

            <div className="py-5 grid grid-cols-1 sm:grid-cols-12 gap-3">
              <dt className="sm:col-span-4 text-xs uppercase tracking-[0.1em] font-semibold text-[#57534E]">
                6. Kế hoạch số hóa
              </dt>
              <dd className="sm:col-span-8 text-sm text-[#44403C] leading-relaxed">
                {legalInfo.digitizationPlan}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Master 20-Field Standardized Archival Record */}
      <section className="border border-[#D6CEBE] bg-[#FBF9F5] p-6 sm:p-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#D6CEBE]">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[#8C2D19] font-medium">
              Biểu mẫu chuẩn 20 trường · Dự án B02
            </p>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#1C1917]">
              Hồ sơ biên mục tổng thể ({legalInfo.archivalMasterRecord.identifier})
            </h2>
          </div>
          <span className="font-mono text-xs text-[#57534E]">
            Số đăng ký: {legalInfo.archivalMasterRecord.repositoryRegNo}
          </span>
        </div>

        <StandardArchivalRecordTable record={legalInfo.archivalMasterRecord} />
      </section>

      {/* Sections 8, 9, 10, 12: Access, Copy, Public Rights & Official Approval */}
      <section className="border border-[#D6CEBE] bg-[#F6F2EA] p-6 sm:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#D6CEBE]">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#8C2D19] font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Mục 08, 09, 10 &amp; 12 · Quyền sử dụng tư liệu</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1C1917]">
              Tình trạng quyền tiếp cận, sao chụp &amp; công khai
            </h2>
          </div>
          <span className="font-mono text-xs text-[#8C2D19] font-semibold">
            Trạng thái: {legalInfo.verificationStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-[#D6CEBE] bg-[#FBF9F5] p-5 space-y-2">
            <h3 className="font-display text-lg font-semibold text-[#1C1917]">
              8. Thông tin quyền tiếp cận
            </h3>
            <p className="text-sm text-[#44403C] leading-relaxed">{legalInfo.accessRights}</p>
          </div>

          <div className="border border-[#D6CEBE] bg-[#FBF9F5] p-5 space-y-2">
            <h3 className="font-display text-lg font-semibold text-[#1C1917]">
              9. Thông tin quyền sao chụp
            </h3>
            <p className="text-sm text-[#44403C] leading-relaxed">{legalInfo.copyRights}</p>
          </div>

          <div className="border border-[#D6CEBE] bg-[#FBF9F5] p-5 space-y-2">
            <h3 className="font-display text-lg font-semibold text-[#1C1917]">
              10. Thông tin quyền công khai
            </h3>
            <p className="text-sm text-[#44403C] leading-relaxed">{legalInfo.publicRights}</p>
          </div>

          <div className="border border-[#8C2D19]/35 bg-[#FBF9F5] p-5 space-y-2">
            <h3 className="font-display text-lg font-semibold text-[#8C2D19]">
              12. Xác nhận đồng ý công khai
            </h3>
            <p className="text-sm text-[#1C1917] leading-relaxed">
              {legalInfo.officialApprovalConfirmation}
            </p>
          </div>
        </div>

        {/* Dedicated Legal Confirmation / Permission Evidence Image Zone */}
        <div className="border border-[#D6CEBE] bg-[#FBF9F5] p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5DEC9]">
            <h3 className="font-display text-lg font-semibold text-[#1C1917]">
              Khu vực hình ảnh minh chứng &amp; tài liệu xác nhận quyền sử dụng
            </h3>
            <span className="font-mono text-xs text-[#8C2D19]">
              {legalEvidenceImages.length > 0
                ? `${legalEvidenceImages.length} ảnh minh chứng`
                : 'Chưa có văn bản xác nhận chính thức'}
            </span>
          </div>

          {legalEvidenceImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {legalEvidenceImages.map((ev) => (
                <div
                  key={ev.id}
                  className="border border-[#D6CEBE] bg-[#F6F2EA] p-4 flex flex-col sm:flex-row gap-4"
                >
                  <div className="w-full sm:w-36 aspect-[4/3] bg-[#EBE6DF] border border-[#D6CEBE] shrink-0 overflow-hidden">
                    <ArchivalImage src={ev.imageUrl} alt={ev.name} caption={ev.caption} />
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="font-mono text-[#8C2D19] font-semibold">
                      {ev.imageCode} · {ev.dossierCode}
                    </div>
                    <p className="font-semibold text-[#1C1917]">{ev.name}</p>
                    <p className="text-[#44403C]">{ev.caption}</p>
                    <p className="text-[#57534E]">Nguồn: {ev.source}</p>
                    <p className="text-[#8C2D19] font-medium">
                      Xác minh: {ev.verificationStatus} · {ev.publicRightsStatus}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 border border-dashed border-[#D6CEBE] bg-[#F6F2EA] text-xs text-[#44403C] leading-relaxed">
              Chưa có ảnh chụp giấy giới thiệu, phiếu trả lời hoặc văn bản xác nhận đồng ý công khai
              từ <strong>{legalInfo.repositoryName}</strong>. Khi đơn vị lưu giữ cấp văn bản phản
              hồi, tài liệu minh chứng (loại <em>Ảnh tài liệu tham khảo</em>, gắn mã định danh{' '}
              <span className="font-mono">B02-00021</span>) sẽ được bổ sung vào danh mục hồ sơ để
              hiển thị minh bạch tại đây.
            </div>
          )}
        </div>
      </section>

      {/* Unified Image Management Registry (11 Fields & 5 Categories) */}
      <section className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-[#D6CEBE]">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#8C2D19] font-medium">
              <Layers className="w-4 h-4" />
              <span>Hệ thống quản lý hình ảnh thống nhất · 11 trường thông tin</span>
            </div>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#1C1917]">
              Danh mục &amp; phân loại toàn bộ hình ảnh ({mediaImages.length} ảnh)
            </h2>
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="w-3.5 h-3.5 text-[#57534E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={mediaQuery}
              onChange={(e) => setMediaQuery(e.target.value)}
              placeholder="Tìm mã ảnh, mã trang, nguồn..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-[#FBF9F5] border border-[#D6CEBE] rounded-sm focus:outline-none focus:border-[#8C2D19]"
            />
          </div>
        </div>

        {/* 5 Category Filter Tabs */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium border rounded-sm transition-colors ${
              categoryFilter === 'all'
                ? 'bg-[#1C1917] text-[#FBF9F5] border-[#1C1917]'
                : 'bg-[#FBF9F5] text-[#44403C] border-[#D6CEBE] hover:border-[#1C1917]'
            }`}
          >
            Tất cả ({categoryCounts.all || 0})
          </button>
          {IMAGE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium border rounded-sm transition-colors ${
                categoryFilter === cat
                  ? 'bg-[#8C2D19] text-[#FBF9F5] border-[#8C2D19]'
                  : 'bg-[#FBF9F5] text-[#44403C] border-[#D6CEBE] hover:border-[#1C1917]'
              }`}
            >
              {cat} ({categoryCounts[cat] || 0})
            </button>
          ))}
        </div>

        {filteredMediaImages.length === 0 ? (
          <div className="border border-dashed border-[#D6CEBE] bg-[#F6F2EA] p-8 text-center text-xs text-[#57534E]">
            Không có hình ảnh nào thuộc nhóm phân loại hoặc từ khóa tìm kiếm đang chọn.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMediaImages.map((img) => (
              <article
                key={img.id}
                className="border border-[#D6CEBE] bg-[#FBF9F5] p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-start"
              >
                <div className="md:col-span-3 aspect-[4/3] bg-[#EBE6DF] border border-[#D6CEBE] overflow-hidden">
                  <ArchivalImage src={img.imageUrl} alt={img.name} caption={img.caption} />
                </div>

                <div className="md:col-span-9 space-y-3 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#E5DEC9]">
                    <div className="flex flex-wrap items-center gap-2 font-mono">
                      <span className="font-semibold text-[#8C2D19]">{img.imageCode}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#1C1917]">{img.dossierCode}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#1C1917]">{img.folioCode}</span>
                    </div>
                    <span className="font-semibold text-[#1C1917]">{img.category}</span>
                  </div>

                  <h3 className="font-display text-lg font-semibold text-[#1C1917]">{img.name}</h3>

                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.06em] text-[#57534E]">
                        Đường dẫn hình ảnh
                      </dt>
                      <dd className="font-mono text-[11px] text-[#1C1917] break-all">
                        {img.imageUrl}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.06em] text-[#57534E]">
                        Nguồn tư liệu
                      </dt>
                      <dd className="text-[#1C1917]">{img.source}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.06em] text-[#57534E]">
                        Tình trạng bản gốc
                      </dt>
                      <dd className="text-[#44403C]">{img.originalStatus}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.06em] text-[#57534E]">
                        Trạng thái xác minh &amp; Quyền công khai
                      </dt>
                      <dd className="text-[#8C2D19] font-medium">
                        {img.verificationStatus} · {img.publicRightsStatus}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-[11px] uppercase tracking-[0.06em] text-[#57534E]">
                        Chú thích
                      </dt>
                      <dd className="text-[#44403C] leading-relaxed">{img.caption}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Section 11: Image Provenance & Captions */}
      <section className="space-y-6">
        <div className="pb-4 border-b border-[#D6CEBE]">
          <p className="text-xs uppercase tracking-[0.14em] text-[#57534E]">Mục 11</p>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#1C1917]">
            Nguồn gốc và chú thích chi tiết cho từng hình ảnh biên tập
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {imageProvenance.map((item) => (
            <article
              key={item.id}
              className="border border-[#D6CEBE] bg-[#FBF9F5] flex flex-col justify-between"
            >
              <div className="h-44 bg-[#EBE6DF] border-b border-[#D6CEBE] overflow-hidden flex items-center justify-center">
                {item.imageUrl ? (
                  <ArchivalImage
                    src={item.imageUrl}
                    alt={item.caption}
                    imgClassName="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-7 h-7 text-[#78716C]" />
                )}
              </div>
              <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-display text-base font-semibold text-[#1C1917]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#44403C] italic">{item.caption}</p>
                  <p className="text-xs text-[#1C1917]">
                    <strong>Nguồn gốc:</strong> {item.sourceOrigin}
                  </p>
                  <p className="text-xs text-[#57534E]">
                    <strong>Phạm vi hiển thị:</strong> {item.usageScope}
                  </p>
                </div>
                <p className="pt-3 border-t border-[#E5DEC9] text-[11px] text-[#8C2D19]">
                  {item.verificationNote}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Section 7: 7+ Reference Sources & Live Link Status Checker */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#D6CEBE]">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[#57534E]">
              Mục 07 · Thư mục học thuật
            </p>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#1C1917]">
              Nguồn tư liệu tham khảo ({sources.length} nguồn)
            </h2>
          </div>

          <button
            type="button"
            disabled={checkingAll}
            onClick={() => handleCheckSources()}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#FBF9F5] bg-[#1C1917] hover:bg-[#8C2D19] rounded-sm transition-colors disabled:opacity-50 self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checkingAll ? 'animate-spin' : ''}`} />
            <span>
              {checkingAll ? 'Đang kiểm tra trạng thái nguồn...' : 'Kiểm tra trạng thái tất cả nguồn'}
            </span>
          </button>
        </div>

        {checkError && (
          <div className="border border-[#8C2D19] bg-[#FBF9F5] p-3 text-xs text-[#8C2D19]">
            {checkError}
          </div>
        )}

        <ol className="divide-y divide-[#D6CEBE] border-b border-[#D6CEBE]">
          {sources.map((source) => {
            const result = checkResults[source.id];
            const isCheckingThis = checkingAll || checkingSourceId === source.id;
            return (
              <li
                key={source.id}
                className="py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E]">
                    <span className="font-mono text-[#8C2D19] font-semibold tabular-nums">
                      Nguồn {source.id}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{source.institution}</span>
                  </div>
                  <p className="text-sm sm:text-base font-medium text-[#1C1917]">{source.title}</p>
                  <p className="font-mono text-xs text-[#57534E] break-all">{source.url}</p>
                  {source.note && <p className="text-xs text-[#78716C]">{source.note}</p>}

                  {result && (
                    <div className="pt-1 flex items-center gap-2 text-xs">
                      {result.reachable ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#14532D] shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-[#8C2D19] shrink-0" />
                      )}
                      <span className={result.reachable ? 'text-[#14532D]' : 'text-[#8C2D19]'}>
                        {result.message}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0 self-start lg:self-center">
                  <button
                    type="button"
                    disabled={isCheckingThis}
                    onClick={() => handleCheckSources([source.id])}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#1C1917] border border-[#D6CEBE] hover:border-[#1C1917] bg-[#FBF9F5] rounded-sm transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    <RefreshCw className={`w-3 h-3 ${isCheckingThis ? 'animate-spin' : ''}`} />
                    <span>Kiểm tra nguồn</span>
                  </button>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#FBF9F5] bg-[#1C1917] hover:bg-[#8C2D19] rounded-sm transition-colors whitespace-nowrap"
                  >
                    <span>Truy cập</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
};
