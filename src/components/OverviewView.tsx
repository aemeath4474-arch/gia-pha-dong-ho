import React from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Columns2, GitFork, ShieldAlert } from 'lucide-react';
import { AppSection, ARCHIVE_IMAGES, PROJECT_METADATA } from '../data/archiveData';
import { ArchivalImage } from './ArchivalImage';

interface OverviewViewProps {
  onNavigate: (section: AppSection) => void;
  onOpenPage: (pageNumber: number) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate, onOpenPage }) => {
  return (
    <div className="space-y-20 pb-20">
      {/* Institutional Marquee Hero */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 pt-10 lg:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Editorial Column */}
          <div className="lg:col-span-6 flex flex-col justify-between py-2">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#57534E] font-medium">
                <span>Ký hiệu A.1046</span>
                <span aria-hidden="true">·</span>
                <span>Thư viện Viện Nghiên cứu Hán Nôm</span>
                <span aria-hidden="true">·</span>
                <span>Dự án phi lợi nhuận</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.35rem] leading-[1.12] font-semibold text-[#1C1917] [text-wrap:balance]">
                {PROJECT_METADATA.documentTitle}
              </h1>

              <p className="text-base sm:text-lg text-[#44403C] leading-relaxed max-w-xl">
                Không gian số hóa, phiên chép đối chiếu văn bản Hán Nôm và hệ thống hóa thế thứ dòng
                họ Nguyễn ở Bối Khê — phục vụ mục đích học tập, nghiên cứu lịch sử dòng họ và bảo
                tồn di sản tư liệu truyền thống.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onOpenPage(1)}
                  className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold text-[#FBF9F5] bg-[#1C1917] hover:bg-[#8C2D19] transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C2D19]"
                >
                  <span>Mở trình đối chiếu mẫu</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('dossier')}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-[#1C1917] border border-[#D6CEBE] hover:border-[#1C1917] hover:bg-[#F3EFE6] transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C2D19]"
                >
                  <span>Xem hồ sơ quyền công khai</span>
                </button>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-[#E5DEC9] text-xs text-[#57534E] leading-relaxed">
              <span className="font-semibold text-[#1C1917]">Ghi chú lưu trữ:</span> Bản{' '}
              <span className="font-mono text-[#1C1917]">A.1046</span> là bản sao lại từ một tài
              liệu gia phả trước đó. Quyền tiếp cận, sao chụp và công khai tư liệu hiện đang trong
              quá trình tìm hiểu và xin phép đơn vị lưu giữ.
            </div>
          </div>

          {/* Right Archival Visual Column */}
          <div className="lg:col-span-6 flex flex-col">
            <figure className="flex-1 flex flex-col bg-[#F3EFE6] border border-[#D6CEBE] p-3">
              <div className="relative flex-1 min-h-[320px] lg:min-h-[440px] overflow-hidden bg-[#EBE6DF]">
                <ArchivalImage
                  src={ARCHIVE_IMAGES.heroManuscript}
                  alt="Ảnh minh họa tư liệu gia phả Hán Nôm đóng gáy chỉ truyền thống trên giấy dó"
                  caption="Minh họa tư liệu gia phả Hán Nôm phục vụ trình diễn giao diện số hóa."
                  imgClassName="w-full h-full object-cover"
                />
              </div>
              <figcaption className="pt-3 pb-1 px-1 flex flex-wrap items-center justify-between gap-2 text-xs text-[#57534E]">
                <span className="italic font-display text-sm text-[#292524]">
                  Hình 1 — Minh họa không gian khảo cứu gia phả giấy dó Hán Nôm
                </span>
                <span className="font-mono text-[11px] text-[#78716C]">MINH HỌA · A.1046</span>
              </figcaption>
            </figure>
          </div>
        </div>

        {/* 4-Column Archival Ledger Strip */}
        <div className="mt-12 border-y border-[#D6CEBE] bg-[#F6F2EA]">
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#D6CEBE]">
            <div className="p-6">
              <dt className="text-xs uppercase tracking-[0.12em] text-[#57534E]">
                Đơn vị tư liệu dự kiến
              </dt>
              <dd className="mt-2 font-display text-2xl font-semibold text-[#1C1917] tabular-nums">
                01 đơn vị
              </dd>
              <p className="mt-1 text-xs text-[#57534E]">
                Bối Khê Trạng nguyên gia phả (<span className="font-mono">A.1046</span>)
              </p>
            </div>

            <div className="p-6">
              <dt className="text-xs uppercase tracking-[0.12em] text-[#57534E]">
                Số trang dự kiến xử lý
              </dt>
              <dd className="mt-2 font-display text-2xl font-semibold text-[#1C1917] tabular-nums">
                ~82 trang
              </dd>
              <p className="mt-1 text-xs text-[#57534E]">
                Sẽ xác nhận thực tế khi tiếp cận tư liệu
              </p>
            </div>

            <div className="p-6">
              <dt className="text-xs uppercase tracking-[0.12em] text-[#57534E]">
                Nội dung thành phần
              </dt>
              <dd className="mt-2 font-display text-2xl font-semibold text-[#1C1917] tabular-nums">
                02 phần chính
              </dd>
              <p className="mt-1 text-xs text-[#57534E]">
                Trạng nguyên gia phả &amp; Nguyễn tộc thế thứ
              </p>
            </div>

            <div className="p-6">
              <dt className="text-xs uppercase tracking-[0.12em] text-[#57534E]">
                Quyền công khai hiện tại
              </dt>
              <dd className="mt-2 font-display text-xl font-semibold text-[#8C2D19]">
                Đang tìm hiểu
              </dd>
              <p className="mt-1 text-xs text-[#57534E]">
                Chưa xác nhận quyền tiếp cận &amp; sao chụp
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
            <span>Xem danh mục 82 trang</span>
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
                tác chữ Hán Nôm, phiên âm Hán-Việt và phần dịch nghĩa phục vụ tra cứu.
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
                Chức năng đối chiếu trực quan song song giữa ảnh trang gốc và văn bản đã phiên chép
                theo từng cột đọc, hỗ trợ phóng to và kiểm chứng học thuật.
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

      {/* Section 02: Institutional Repository & Verification Status */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch border border-[#D6CEBE] bg-[#F6F2EA]">
          <div className="lg:col-span-7 relative min-h-[280px] lg:min-h-[380px] overflow-hidden bg-[#EBE6DF]">
            <ArchivalImage
              src={ARCHIVE_IMAGES.readingRoom}
              alt="Minh họa phòng đọc và kho lưu trữ tư liệu Hán Nôm tại Hà Nội"
              caption="Không gian lưu trữ tư liệu cổ truyền thống."
              imgClassName="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#8C2D19] font-medium">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>02. Nơi lưu giữ &amp; Quyền công khai</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1C1917]">
                {PROJECT_METADATA.repository.name}
              </h2>

              <p className="text-sm text-[#44403C] leading-relaxed">
                Địa chỉ tham khảo: <strong className="text-[#1C1917]">{PROJECT_METADATA.repository.address}</strong>{' '}
                ({PROJECT_METADATA.repository.addressNote})
              </p>

              <p className="text-sm text-[#44403C] leading-relaxed">
                {PROJECT_METADATA.publicRights.summary} Việc công bố hình ảnh và văn bản chính thức
                chỉ được thực hiện sau khi có sự cho phép của đơn vị có thẩm quyền.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[#D6CEBE] flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('dossier')}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#FBF9F5] bg-[#1C1917] hover:bg-[#8C2D19] transition-colors rounded-sm"
              >
                <span>Đọc toàn văn hồ sơ &amp; 7 nguồn tham khảo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('genealogy')}
                className="text-xs font-medium text-[#1C1917] underline underline-offset-4 hover:text-[#8C2D19] transition-colors"
              >
                Khám phá khung Sơ đồ phả hệ
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
