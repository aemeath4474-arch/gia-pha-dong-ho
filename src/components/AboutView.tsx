import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import {
  AppSection,
  ATTRIBUTION_VERBATIM,
  PROJECT_METADATA,
  REFERENCE_SOURCES,
} from '../data/archiveData';

interface AboutViewProps {
  onNavigate: (section: AppSection) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-10 space-y-14">
      {/* Header */}
      <header className="space-y-4 pb-6 border-b border-[#D6CEBE]">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#57534E]">
          <span>Trang giới thiệu</span>
          <span aria-hidden="true">·</span>
          <span>Dự án xã hội phi lợi nhuận</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-[#1C1917]">Mã dự án B02</span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#1C1917] max-w-3xl [text-wrap:balance]">
          {PROJECT_METADATA.appName}
        </h1>
      </header>

      {/* Verbatim Internship Attribution Colophon */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="border border-[#D6CEBE] bg-[#F6F2EA] p-6 sm:p-8 space-y-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[#8C2D19] font-semibold">
              Thông tin công bố sản phẩm thực tập
            </p>
            <blockquote className="font-display text-xl sm:text-2xl leading-relaxed text-[#1C1917]">
              “{ATTRIBUTION_VERBATIM}”
            </blockquote>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-[#292524] leading-relaxed">
            <h2 className="font-display text-2xl font-semibold text-[#1C1917]">
              Mục tiêu và giá trị cộng đồng
            </h2>
            <p>
              Dự án được xây dựng nhằm thiết lập một nền tảng số hóa chuẩn mực cho tư liệu gia phả
              Hán Nôm, lấy đối tượng trọng tâm là tập tư liệu{' '}
              <em>Bối Khê Trạng nguyên gia phả</em> (ký hiệu{' '}
              <span className="font-mono text-[#1C1917]">A.1046</span>) thuộc dòng họ Nguyễn ở Bối
              Khê.
            </p>
            <p>
              Với tính chất là dự án xã hội phi lợi nhuận phục vụ học tập và nghiên cứu, hệ thống
              tập trung vào khả năng đối chiếu song song giữa ảnh trang gốc và văn bản phiên chép,
              đồng thời cấu trúc hóa dữ liệu thế thứ thành sơ đồ phả hệ trực quan để thế hệ sau dễ
              dàng tra cứu cội nguồn.
            </p>
            <p>
              Mọi bước triển khai thu thập, sao chụp và công khai tư liệu đều đặt dưới nguyên tắc tôn
              trọng tuyệt đối quy định bảo quản và bản quyền lưu trữ của Thư viện Viện Nghiên cứu
              Hán Nôm cùng các cơ quan có thẩm quyền.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('comparator')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#FBF9F5] bg-[#1C1917] hover:bg-[#8C2D19] transition-colors rounded-sm"
            >
              <span>Trải nghiệm trình đối chiếu trang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('dossier')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-[#1C1917] border border-[#D6CEBE] hover:border-[#1C1917] rounded-sm transition-colors"
            >
              <span>Xem hồ sơ pháp lý A.1046</span>
            </button>
          </div>
        </div>

        {/* Structured Student & Project Dossier */}
        <aside className="lg:col-span-5 border border-[#D6CEBE] bg-[#FBF9F5] p-6 sm:p-8 space-y-5">
          <h2 className="font-display text-xl font-semibold text-[#1C1917] pb-3 border-b border-[#E5DEC9]">
            Hồ sơ nhóm thực hiện
          </h2>

          <dl className="divide-y divide-[#E5DEC9] text-sm">
            <div className="py-3 flex justify-between gap-4">
              <dt className="text-[#57534E]">Sinh viên thực hiện</dt>
              <dd className="font-semibold text-[#1C1917] text-right">
                {PROJECT_METADATA.studentInfo.studentName}
              </dd>
            </div>
            <div className="py-3 flex justify-between gap-4">
              <dt className="text-[#57534E]">Mã sinh viên</dt>
              <dd className="font-mono text-[#1C1917] text-right">
                {PROJECT_METADATA.studentInfo.studentId}
              </dd>
            </div>
            <div className="py-3 flex justify-between gap-4">
              <dt className="text-[#57534E]">Mã dự án</dt>
              <dd className="font-mono text-[#8C2D19] font-semibold text-right">
                {PROJECT_METADATA.studentInfo.projectCode}
              </dd>
            </div>
            <div className="py-3 flex justify-between gap-4">
              <dt className="text-[#57534E]">Nhóm / Đợt</dt>
              <dd className="text-[#1C1917] text-right">{PROJECT_METADATA.studentInfo.team}</dd>
            </div>
            <div className="py-3 flex justify-between gap-4">
              <dt className="text-[#57534E]">Chương trình</dt>
              <dd className="text-[#1C1917] text-right max-w-[220px]">
                {PROJECT_METADATA.studentInfo.program}
              </dd>
            </div>
            <div className="py-3 flex justify-between gap-4">
              <dt className="text-[#57534E]">Loại hình</dt>
              <dd className="font-medium text-[#1C1917] text-right">
                {PROJECT_METADATA.studentInfo.nature}
              </dd>
            </div>
          </dl>
        </aside>
      </section>

      {/* Reference Sources Quick List */}
      <section className="pt-4 border-t border-[#D6CEBE] space-y-5">
        <h2 className="font-display text-2xl font-semibold text-[#1C1917]">
          Danh mục nguồn tư liệu tham khảo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REFERENCE_SOURCES.map((source) => (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-[#D6CEBE] bg-[#FBF9F5] hover:bg-[#F3EFE6] p-4 flex items-start justify-between gap-4 transition-colors"
            >
              <div className="space-y-1">
                <div className="text-xs text-[#57534E]">
                  <span className="font-mono text-[#8C2D19] font-semibold">
                    Nguồn {source.id}
                  </span>{' '}
                  · {source.institution}
                </div>
                <p className="text-sm font-medium text-[#1C1917] group-hover:text-[#8C2D19] transition-colors">
                  {source.title}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-[#78716C] group-hover:text-[#8C2D19] shrink-0 mt-1" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
