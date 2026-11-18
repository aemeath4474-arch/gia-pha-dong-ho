import React from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Columns2, GitFork, ShieldAlert } from 'lucide-react';
import { ARCHIVE_IMAGES } from '../data/seedData';
import type { AppSection, ArchiveDatabase } from '../types/archive';
import { ArchivalImage } from './ArchivalImage';

interface OverviewViewProps {
  db: ArchiveDatabase;
  onNavigate: (section: AppSection) => void;
  onOpenPage: (pageNumber: number) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  db,
  onNavigate,
  onOpenPage,
}) => {
  const uploadedFolioCount = db.folios.filter((f) => Boolean(f.imageUrl)).length;

  return (
    <div className="space-y-20 pb-20">
      {/* Institutional Marquee Hero */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 pt-10 lg:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Editorial Column */}
          <div className="lg:col-span-6 flex flex-col justify-between py-2">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#57534E] font-medium">
                <span>Ký hiệu {db.legalInfo.callNumber}</span>
                <span aria-hidden="true">·</span>
                <span>{db.legalInfo.repositoryName}</span>
                <span aria-hidden="true">·</span>
                <span>{db.aboutInfo.nature}</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.35rem] leading-[1.12] font-semibold text-[#1C1917] [text-wrap:balance]">
                Bối Khê Trạng nguyên gia phả
              </h1>

              <p className="text-base sm:text-lg text-[#44403C] leading-relaxed max-w-xl">
                Gia phả dòng họ từ bản chép tay sang bản số — không gian lưu trữ, đối chiếu ảnh
                chụp và văn bản Hán Nôm, cùng sơ đồ thế thứ dòng họ Nguyễn ở Bối Khê phục vụ học
                tập và nghiên cứu.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onOpenPage(1)}
                  className="inline-flex items-center gap-2.5 px-5 py-3 text-sm font-semibold text-[#FBF9F5] bg-[#1C1917] hover:bg-[#8C2D19] transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C2D19]"
                >
                  <span>Mở trình đối chiếu trang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('digitize')}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-[#8C2D19] border border-[#8C2D19] hover:bg-[#8C2D19] hover:text-[#FBF9F5] transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C2D19]"
                >
                  <span>Chuyển đổi bản chép tay</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('dossiers')}
                  className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#1C1917] border border-[#D6CEBE] hover:border-[#1C1917] hover:bg-[#F3EFE6] transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C2D19]"
                >
                  <span>Xem {db.dossiers.length} hồ sơ</span>
                </button>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-[#E5DEC9] text-xs text-[#57534E] leading-relaxed">
              <span className="font-semibold text-[#1C1917]">Ghi chú lưu trữ (Điều 63 Luật 2024):</span>{' '}
              Tập <span className="font-mono text-[#1C1917]">{db.legalInfo.callNumber}</span> là
              bản sao truyền lục; các bản ghi được mã hóa cố định{' '}
              <span className="font-mono text-[#1C1917]">B02-00001 – B02-00021</span> và{' '}
              <span className="font-mono text-[#1C1917]">B02-00101 – B02-00182</span> theo chuẩn
              20 trường, tách riêng mức kiểm chứng phiên âm &amp; dịch nghĩa và không cho tải ảnh độ
              phân giải cao.
            </div>
          </div>

          {/* Right Archival Visual Column */}
          <div className="lg:col-span-6 flex flex-col">
            <figure className="flex-1 flex flex-col bg-[#F3EFE6] border border-[#D6CEBE] p-3">
              <div className="relative flex-1 min-h-[320px] lg:min-h-[440px] overflow-hidden bg-[#EBE6DF]">
                <ArchivalImage
                  src={ARCHIVE_IMAGES.heroManuscript}
                  alt="Ảnh minh họa một cuốn gia phả Hán Nôm cổ đóng gáy chỉ truyền thống trên giấy dó"
                  caption="Ảnh minh họa cuốn gia phả Hán Nôm cổ."
                  imgClassName="w-full h-full object-cover"
                />
              </div>
              <figcaption className="pt-3 pb-1 px-1 flex flex-wrap items-center justify-between gap-2 text-xs text-[#57534E]">
                <span className="italic font-display text-sm text-[#292524]">
                  Hình 1 — Minh họa cuốn gia phả Hán Nôm cổ đóng gáy chỉ trên giấy dó
                </span>
                <span className="font-mono text-[11px] text-[#8C2D19]">ẢNH MINH HỌA · B02</span>
              </figcaption>
            </figure>
          </div>
        </div>

        {/* 4-Column Archival Ledger Strip */}
        <div className="mt-12 border-y border-[#D6CEBE] bg-[#F6F2EA]">
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#D6CEBE]">
            <div className="p-6">
              <dt className="text-xs uppercase tracking-[0.12em] text-[#57534E]">
                Hồ sơ quản lý dữ liệu
              </dt>
              <dd className="mt-2 font-display text-2xl font-semibold text-[#1C1917] tabular-nums">
                {db.dossiers.length} bản ghi
              </dd>
              <p className="mt-1 text-xs text-[#57534E]">
                Mã định danh cố định <span className="font-mono">B02-00001 – B02-00021</span>
              </p>
            </div>

            <div className="p-6">
              <dt className="text-xs uppercase tracking-[0.12em] text-[#57534E]">
                Số trang dự kiến số hóa
              </dt>
              <dd className="mt-2 font-display text-2xl font-semibold text-[#1C1917] tabular-nums">
                ~{db.folios.length} trang
              </dd>
              <p className="mt-1 text-xs text-[#57534E]">
                <span className="font-mono">B02-00101 – B02-00182</span> ({uploadedFolioCount} ảnh minh họa)
              </p>
            </div>

            <div className="p-6">
              <dt className="text-xs uppercase tracking-[0.12em] text-[#57534E]">
                Phân loại bản hiển thị
              </dt>
              <dd className="mt-2 font-display text-xl font-semibold text-[#1C1917] tabular-nums">
                {db.mediaImages.length} ảnh cấu trúc
              </dd>
              <p className="mt-1 text-xs text-[#57534E]">
                Ảnh giảm kích thước · không cho tải bản phân giải cao
              </p>
            </div>

            <div className="p-6">
              <dt className="text-xs uppercase tracking-[0.12em] text-[#57534E]">
                Mức kiểm chứng &amp; xác minh
              </dt>
              <dd className="mt-2 font-display text-xl font-semibold text-[#8C2D19]">
                {db.legalInfo.verificationStatus}
              </dd>
              <p className="mt-1 text-xs text-[#57534E]">
                Tách riêng Phiên âm (đã kiểm cấu trúc) &amp; Dịch nghĩa (chưa kiểm chuyên môn)
              </p>
            </div>
          </dl>
        </div>
      </section>

      {/* Section 01: Planned Processing Scope per Folio */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#D6CEBE]">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[#57534E]">
              01. Kiến trúc xử lý tư liệu
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-[#1C1917]">
              Bốn hợp phần xử lý cho mỗi trang tư liệu
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('comparator')}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#8C2D19] hover:text-[#1C1917] transition-colors whitespace-nowrap shrink-0"
          >
            <span>Xem danh mục {db.folios.length} trang</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#D6CEBE] border border-[#D6CEBE] mt-8">
          <div className="bg-[#FBF9F5] p-6 sm:p-7 flex flex-col justify-between gap-6">
            <div>
              <BookOpen className="w-5 h-5 text-[#8C2D19]" strokeWidth={1.6} />
              <h3 className="mt-4 font-display text-xl font-semibold text-[#1C1917]">
                Ảnh chụp trang tư liệu
              </h3>
              <p className="mt-2.5 text-sm text-[#44403C] leading-relaxed">
                Lưu trữ ảnh chụp độ phân giải cao cho từng tờ giấy bản (dự kiến khoảng 82 trang)
                sau khi được Thư viện Viện Nghiên cứu Hán Nôm cho phép sao chụp.
              </p>
            </div>
            <span className="font-mono text-xs text-[#78716C] tabular-nums">Hợp phần 01 / 04</span>
          </div>

          <div className="bg-[#FBF9F5] p-6 sm:p-7 flex flex-col justify-between gap-6">
            <div>
              <Columns2 className="w-5 h-5 text-[#8C2D19]" strokeWidth={1.6} />
              <h3 className="mt-4 font-display text-xl font-semibold text-[#1C1917]">
                Phiên chép văn bản số
              </h3>
              <p className="mt-2.5 text-sm text-[#44403C] leading-relaxed">
                Chuyển hóa nội dung chữ Hán Nôm trên từng trang thành văn bản số có cấu trúc: nguyên
                tác chữ Hán Nôm, phiên âm Hán-Việt, dịch nghĩa và đánh dấu chữ chưa đọc được.
              </p>
            </div>
            <span className="font-mono text-xs text-[#78716C] tabular-nums">Hợp phần 02 / 04</span>
          </div>

          <div className="bg-[#FBF9F5] p-6 sm:p-7 flex flex-col justify-between gap-6">
            <div>
              <ArrowUpRight className="w-5 h-5 text-[#8C2D19]" strokeWidth={1.6} />
              <h3 className="mt-4 font-display text-xl font-semibold text-[#1C1917]">
                Đối chiếu ảnh và văn bản
              </h3>
              <p className="mt-2.5 text-sm text-[#44403C] leading-relaxed">
                Chức năng đối chiếu trực quan 3 lớp (ảnh gốc, phiên chép Hán Nôm, dịch nghĩa tiếng
                Việt), hỗ trợ phóng to và xem toàn màn hình.
              </p>
            </div>
            <span className="font-mono text-xs text-[#78716C] tabular-nums">Hợp phần 03 / 04</span>
          </div>

          <div className="bg-[#FBF9F5] p-6 sm:p-7 flex flex-col justify-between gap-6">
            <div>
              <GitFork className="w-5 h-5 text-[#8C2D19]" strokeWidth={1.6} />
              <h3 className="mt-4 font-display text-xl font-semibold text-[#1C1917]">
                Sơ đồ phả hệ thế thứ
              </h3>
              <p className="mt-2.5 text-sm text-[#44403C] leading-relaxed">
                Trích xuất thông tin thế thứ từ phần <em>Bối Khê Nguyễn tộc gia phả thế thứ</em> để
                xây dựng sơ đồ phả hệ trực quan kết nối ngược về trang tư liệu gốc.
              </p>
            </div>
            <span className="font-mono text-xs text-[#78716C] tabular-nums">Hợp phần 04 / 04</span>
          </div>
        </div>
      </section>

      {/* Section 02: Archival & Digitization Visual Showcase */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#D6CEBE]">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[#57534E]">
              02. Tư liệu hình ảnh minh họa chuyên đề
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-[#1C1917]">
              Giấy dó Hán Nôm, hoạt động số hóa &amp; bối cảnh dòng họ Bối Khê
            </h2>
          </div>
          <span className="font-mono text-xs text-[#8C2D19] whitespace-nowrap shrink-0">
            Phân loại: Ảnh minh họa (không trộn lẫn bản gốc A.1046)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <figure className="border border-[#D6CEBE] bg-[#FBF9F5] flex flex-col">
            <div className="aspect-[4/3] overflow-hidden bg-[#EBE6DF]">
              <ArchivalImage
                src={ARCHIVE_IMAGES.specimenPlate}
                alt="Hình ảnh giấy dó và trang sách viết chữ Hán Nôm theo cột dọc truyền thống"
                imgClassName="w-full h-full object-cover"
              />
            </div>
            <figcaption className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <p className="text-[11px] uppercase tracking-wider text-[#8C2D19] font-semibold">
                  Ảnh minh họa · Giấy dó &amp; Chữ Hán Nôm
                </p>
                <h3 className="font-display text-lg font-semibold text-[#1C1917]">
                  Trang sách viết chữ Hán Nôm trên giấy dó
                </h3>
                <p className="text-xs text-[#44403C] leading-relaxed">
                  Minh họa kết cấu cột dọc đọc từ phải sang trái và khung dòng kẻ son trong gia phả
                  cổ truyền thống.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenPage(1)}
                className="pt-2 text-left text-xs font-semibold text-[#8C2D19] hover:text-[#1C1917] transition-colors"
              >
                Xem tại trình đối chiếu mẫu →
              </button>
            </figcaption>
          </figure>

          <figure className="border border-[#D6CEBE] bg-[#FBF9F5] flex flex-col">
            <div className="aspect-[4/3] overflow-hidden bg-[#EBE6DF]">
              <ArchivalImage
                src={ARCHIVE_IMAGES.digitizationStudio}
                alt="Hình ảnh minh họa hoạt động số hóa sách gia phả cổ bằng máy ảnh chụp đứng và giá đỡ chữ V"
                imgClassName="w-full h-full object-cover"
              />
            </div>
            <figcaption className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <p className="text-[11px] uppercase tracking-wider text-[#8C2D19] font-semibold">
                  Ảnh minh họa · Hoạt động số hóa
                </p>
                <h3 className="font-display text-lg font-semibold text-[#1C1917]">
                  Quy trình chuyển từ bản chép tay sang bản số
                </h3>
                <p className="text-xs text-[#44403C] leading-relaxed">
                  Minh họa thao tác số hóa không tiếp xúc trên giá đỡ bảo quản giúp giữ an toàn cho
                  tờ giấy dó cổ.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('digitize')}
                className="pt-2 text-left text-xs font-semibold text-[#8C2D19] hover:text-[#1C1917] transition-colors"
              >
                Mở công cụ chuyển đổi bản số →
              </button>
            </figcaption>
          </figure>

          <figure className="border border-[#D6CEBE] bg-[#FBF9F5] flex flex-col">
            <div className="aspect-[4/3] overflow-hidden bg-[#EBE6DF]">
              <ArchivalImage
                src={ARCHIVE_IMAGES.boikheCourtyard}
                alt="Hình ảnh minh họa kiến trúc từ đường cổ truyền thống vùng Bắc Bộ gắn với di sản dòng họ Nguyễn Bối Khê"
                imgClassName="w-full h-full object-cover"
              />
            </div>
            <figcaption className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <p className="text-[11px] uppercase tracking-wider text-[#8C2D19] font-semibold">
                  Ảnh minh họa · Không gian di sản dòng họ
                </p>
                <h3 className="font-display text-lg font-semibold text-[#1C1917]">
                  Bối cảnh văn hóa dòng họ Nguyễn ở Bối Khê
                </h3>
                <p className="text-xs text-[#44403C] leading-relaxed">
                  Minh họa không gian thờ tự và truyền thống hiếu học vùng đồng bằng Bắc Bộ gắn liền
                  với tư liệu <em>Bối Khê Trạng nguyên gia phả</em>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('genealogy')}
                className="pt-2 text-left text-xs font-semibold text-[#8C2D19] hover:text-[#1C1917] transition-colors"
              >
                Khám phá Sơ đồ phả hệ →
              </button>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Section 03: Institutional Repository & Verification Status */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch border border-[#D6CEBE] bg-[#F6F2EA]">
          <div className="lg:col-span-7 relative min-h-[280px] lg:min-h-[380px] overflow-hidden bg-[#EBE6DF]">
            <ArchivalImage
              src={ARCHIVE_IMAGES.readingRoom}
              alt="Minh họa phòng đọc và không gian lưu trữ tư liệu cổ Hán Nôm tại Hà Nội"
              caption="Không gian lưu trữ tư liệu cổ truyền thống."
              imgClassName="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#8C2D19] font-medium">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>03. Không gian lưu giữ &amp; Quyền công khai</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1C1917]">
                {db.legalInfo.repositoryName}
              </h2>

              <p className="text-sm text-[#44403C] leading-relaxed">
                Địa chỉ tham khảo:{' '}
                <strong className="text-[#1C1917]">{db.legalInfo.repositoryAddress}</strong> (
                {db.legalInfo.repositoryAddressNote})
              </p>

              <p className="text-sm text-[#44403C] leading-relaxed">{db.legalInfo.publicRights}</p>
            </div>

            <div className="pt-6 mt-6 border-t border-[#D6CEBE] flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('dossier')}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#FBF9F5] bg-[#1C1917] hover:bg-[#8C2D19] transition-colors rounded-sm"
              >
                <span>Xem Hồ sơ &amp; Pháp lý ({db.sources.length} nguồn)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('genealogy')}
                className="text-xs font-medium text-[#1C1917] underline underline-offset-4 hover:text-[#8C2D19] transition-colors"
              >
                Khám phá Sơ đồ phả hệ
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
