import React from 'react';
import { ExternalLink, MapPin, ShieldCheck } from 'lucide-react';
import { PROJECT_METADATA, REFERENCE_SOURCES } from '../data/archiveData';

export const DossierView: React.FC = () => {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-10 space-y-16">
      {/* Header */}
      <header className="space-y-4 pb-6 border-b border-[#D6CEBE]">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#57534E]">
          <span>Hồ sơ biên mục &amp; Pháp lý</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-[#1C1917]">A.1046</span>
          <span aria-hidden="true">·</span>
          <span>Thư viện Viện Nghiên cứu Hán Nôm</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1C1917] max-w-3xl [text-wrap:balance]">
          Thông tin tư liệu, nơi lưu giữ &amp; quyền công khai
        </h1>
        <p className="text-sm sm:text-base text-[#44403C] max-w-2xl leading-relaxed">
          Tổng hợp thông số lưu trữ tham khảo đối với tư liệu{' '}
          <em>{PROJECT_METADATA.documentTitle}</em> (ký hiệu{' '}
          <span className="font-mono text-[#1C1917]">{PROJECT_METADATA.callNumber}</span>) cùng
          quy trình liên hệ xác nhận quyền tiếp cận và công khai.
        </p>
      </header>

      {/* Sections 1, 2, 3, 4 Accession Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-2">
          <p className="text-xs uppercase tracking-[0.14em] text-[#8C2D19] font-medium">
            Biên mục lưu trữ
          </p>
          <h2 className="font-display text-2xl font-semibold text-[#1C1917]">
            Hồ sơ đơn vị tư liệu A.1046
          </h2>
          <p className="text-sm text-[#57534E] leading-relaxed">
            Các thông tin dưới đây được tổng hợp theo danh mục thư viện và tài liệu nghiên cứu
            tham khảo, làm cơ sở cho bước liên hệ xác minh thực tế.
          </p>
        </div>

        <div className="lg:col-span-8 border-t border-[#D6CEBE]">
          <dl className="divide-y divide-[#D6CEBE]">
            <div className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-3">
              <dt className="sm:col-span-4 text-xs uppercase tracking-[0.1em] font-semibold text-[#57534E]">
                1. Loại tư liệu
              </dt>
              <dd className="sm:col-span-8 text-sm text-[#1C1917] leading-relaxed space-y-2">
                <p>
                  Tư liệu gia phả <strong>{PROJECT_METADATA.lineageOrigin}</strong>, tập trung vào
                  tài liệu <strong>{PROJECT_METADATA.documentTitle}</strong>, ký hiệu{' '}
                  <span className="font-mono">{PROJECT_METADATA.callNumber}</span>, hiện được dẫn
                  là lưu giữ tại {PROJECT_METADATA.repository.name}.
                </p>
                <p className="text-[#44403C]">
                  Tài liệu có nội dung liên quan đến dòng họ Nguyễn ở Bối Khê, đặc biệt là phần{' '}
                  <em>{PROJECT_METADATA.documentTitle}</em> và{' '}
                  <em>{PROJECT_METADATA.secondaryTitle}</em>. Đây là nguồn tư liệu có giá trị phục
                  vụ việc nghiên cứu lịch sử dòng họ, tìm hiểu thế thứ và xây dựng sơ đồ phả hệ.
                </p>
              </dd>
            </div>

            <div className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-3">
              <dt className="sm:col-span-4 text-xs uppercase tracking-[0.1em] font-semibold text-[#57534E]">
                2. Nơi lưu giữ
              </dt>
              <dd className="sm:col-span-8 text-sm text-[#1C1917] leading-relaxed space-y-2">
                <p className="font-semibold">{PROJECT_METADATA.repository.name}</p>
                <p className="flex items-start gap-2 text-[#44403C]">
                  <MapPin className="w-4 h-4 text-[#8C2D19] shrink-0 mt-0.5" />
                  <span>
                    Địa chỉ: {PROJECT_METADATA.repository.address} (
                    {PROJECT_METADATA.repository.addressNote})
                  </span>
                </p>
                <p className="text-[#44403C]">
                  Ký hiệu tư liệu:{' '}
                  <span className="font-mono text-[#1C1917]">
                    A.1046 – Bối Khê Trạng nguyên gia phả
                  </span>
                  .
                </p>
                <p className="text-[#44403C]">{PROJECT_METADATA.repository.provenanceNote}</p>
              </dd>
            </div>

            <div className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-3">
              <dt className="sm:col-span-4 text-xs uppercase tracking-[0.1em] font-semibold text-[#57534E]">
                3. Số đơn vị dự kiến
              </dt>
              <dd className="sm:col-span-8 text-sm text-[#1C1917] leading-relaxed space-y-2">
                <p>
                  <strong>01 đơn vị tư liệu</strong>, là <em>Bối Khê Trạng nguyên gia phả</em>, ký
                  hiệu <span className="font-mono">A.1046</span>.
                </p>
                <p className="text-[#44403C]">
                  Theo thông tin danh mục tham khảo, tài liệu có khoảng{' '}
                  <strong className="font-mono text-[#1C1917]">82 trang</strong>. Số trang và phạm
                  vi số hóa thực tế sẽ được xác nhận sau khi tiếp cận tư liệu.
                </p>
                <ul className="list-disc pl-5 text-[#44403C] space-y-1 pt-1">
                  <li>Ảnh chụp trang tư liệu.</li>
                  <li>Nội dung phiên chép thành văn bản số.</li>
                  <li>Chức năng đối chiếu giữa ảnh trang gốc và văn bản đã phiên chép.</li>
                  <li>Thông tin thế thứ dòng họ được sử dụng để xây dựng sơ đồ phả hệ.</li>
                </ul>
              </dd>
            </div>

            <div className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-3">
              <dt className="sm:col-span-4 text-xs uppercase tracking-[0.1em] font-semibold text-[#57534E]">
                4. Tên ứng dụng
              </dt>
              <dd className="sm:col-span-8 font-display text-lg font-semibold text-[#1C1917]">
                {PROJECT_METADATA.appName}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Section 5: Public Rights & Verification Roadmap */}
      <section className="border border-[#D6CEBE] bg-[#F6F2EA] p-6 sm:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#D6CEBE]">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#8C2D19] font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>5. Quyền công khai &amp; Lộ trình xin phép</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1C1917]">
              {PROJECT_METADATA.publicRights.status}
            </h2>
          </div>
        </div>

        <div className="space-y-3 text-sm sm:text-base text-[#292524] leading-relaxed max-w-3xl">
          <p>
            Dự kiến liên hệ Thư viện Viện Nghiên cứu Hán Nôm để tìm hiểu về nguồn gốc, tình trạng
            lưu giữ và điều kiện tiếp cận tài liệu <em>Bối Khê Trạng nguyên gia phả</em>, ký hiệu{' '}
            <span className="font-mono text-[#1C1917]">A.1046</span>.
          </p>
          <p>
            Đồng thời, xin ý kiến và sự cho phép của đơn vị có thẩm quyền về việc sao chụp, phiên
            chép, sử dụng hình ảnh tư liệu và công khai nội dung trên website phục vụ mục đích học
            tập, nghiên cứu.
          </p>
          <p className="font-semibold text-[#8C2D19]">
            {PROJECT_METADATA.publicRights.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROJECT_METADATA.publicRights.steps.map((item) => (
            <div
              key={item.step}
              className="border border-[#D6CEBE] bg-[#FBF9F5] p-5 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#57534E]">
                  <span className="font-mono text-[#8C2D19] font-semibold">Bước {item.step}</span>
                  <span>{item.state}</span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold text-[#1C1917]">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#44403C] leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reference Sources (7 Sources) */}
      <section className="space-y-6">
        <div className="pb-4 border-b border-[#D6CEBE]">
          <p className="text-xs uppercase tracking-[0.14em] text-[#57534E]">Thư mục học thuật</p>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#1C1917]">
            Nguồn tư liệu tham khảo (07 nguồn)
          </h2>
        </div>

        <ol className="divide-y divide-[#D6CEBE] border-b border-[#D6CEBE]">
          {REFERENCE_SOURCES.map((source) => (
            <li
              key={source.id}
              className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#57534E]">
                  <span className="font-mono text-[#8C2D19] font-semibold tabular-nums">
                    Nguồn {source.id}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{source.institution}</span>
                </div>
                <p className="text-sm sm:text-base font-medium text-[#1C1917]">{source.title}</p>
                <p className="font-mono text-xs text-[#57534E] break-all">{source.url}</p>
              </div>

              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#1C1917] border border-[#D6CEBE] hover:border-[#1C1917] hover:bg-[#F3EFE6] rounded-sm transition-colors whitespace-nowrap shrink-0 self-start sm:self-center"
              >
                <span>Truy cập nguồn</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};
