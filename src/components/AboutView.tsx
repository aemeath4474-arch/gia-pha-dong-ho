import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { ARCHIVE_IMAGES } from '../data/seedData';
import type { AboutInfo, AppSection, ReferenceSource } from '../types/archive';
import { ArchivalImage } from './ArchivalImage';

interface AboutViewProps {
  aboutInfo: AboutInfo;
  sources: ReferenceSource[];
  onNavigate: (section: AppSection) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  aboutInfo,
  sources,
  onNavigate,
}) => {
  const thematicFigures = [
    {
      id: 'about-goal',
      title: '1. Mục tiêu số hóa gia phả dòng họ',
      category: 'Ảnh minh họa',
      imageUrl: ARCHIVE_IMAGES.boikheCourtyard,
      caption:
        'Ảnh minh họa không gian di sản kiến trúc truyền thống vùng Bối Khê — bối cảnh văn hóa gắn liền với mục tiêu gìn giữ ký ức dòng họ cho thế hệ sau.',
      source: 'Ảnh minh họa di sản văn hóa Bối Khê — dự án B02',
    },
    {
      id: 'about-preserve',
      title: '2. Bảo tồn tư liệu Hán Nôm trước nguy cơ hư hại',
      category: 'Ảnh minh họa',
      imageUrl: ARCHIVE_IMAGES.readingRoom,
      caption:
        'Ảnh minh họa không gian bảo quản thư tịch Hán Nôm tại thư viện lưu trữ nhằm hạn chế tác động cơ học trực tiếp lên bản chép tay giấy dó.',
      source: 'Ảnh minh họa không gian lưu trữ Hán Nôm — dự án B02',
    },
    {
      id: 'about-workflow',
      title: '3. Quy trình chuyển đổi tư liệu giấy sang dữ liệu số',
      category: 'Ảnh minh họa',
      imageUrl: ARCHIVE_IMAGES.digitizationStudio,
      caption:
        'Ảnh minh họa bàn chụp bảo tồn kết nối quy trình: Chụp ảnh từng trang (82 trang) → Phiên chép Hán Nôm & Dịch nghĩa → Chuẩn hóa cây phả hệ.',
      source: 'Ảnh minh họa quy trình số hóa gia phả — dự án B02',
    },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-10 space-y-14">
      {/* Header */}
      <header className="space-y-4 pb-6 border-b border-[#D6CEBE]">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#57534E]">
          <span>Trang giới thiệu</span>
          <span aria-hidden="true">·</span>
          <span>{aboutInfo.nature}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-[#1C1917]">Mã dự án {aboutInfo.projectCode}</span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#1C1917] max-w-3xl [text-wrap:balance]">
          {aboutInfo.appName}
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
              “{aboutInfo.attributionVerbatim}”
            </blockquote>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-[#292524] leading-relaxed">
            <h2 className="font-display text-2xl font-semibold text-[#1C1917]">
              Mục tiêu và giá trị cộng đồng
            </h2>
            <p>{aboutInfo.projectSummary}</p>
            <p>{aboutInfo.ethicsCommitment}</p>
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
              onClick={() => onNavigate('dossiers')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-[#1C1917] border border-[#D6CEBE] hover:border-[#1C1917] rounded-sm transition-colors"
            >
              <span>Xem hệ thống 21 hồ sơ</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('dossier')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-[#1C1917] border border-[#D6CEBE] hover:border-[#1C1917] rounded-sm transition-colors"
            >
              <span>Xem hồ sơ pháp lý A.1046</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('qa')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#8C2D19] border border-[#8C2D19] hover:bg-[#8C2D19] hover:text-[#FBF9F5] rounded-sm transition-colors"
            >
              <span>Hỏi đáp</span>
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
              <dd className="font-semibold text-[#1C1917] text-right">{aboutInfo.studentName}</dd>
            </div>
            <div className="py-3 flex justify-between gap-4">
              <dt className="text-[#57534E]">Mã sinh viên</dt>
              <dd className="font-mono text-[#1C1917] text-right">{aboutInfo.studentId}</dd>
            </div>
            <div className="py-3 flex justify-between gap-4">
              <dt className="text-[#57534E]">Mã dự án</dt>
              <dd className="font-mono text-[#8C2D19] font-semibold text-right">
                {aboutInfo.projectCode}
              </dd>
            </div>
            <div className="py-3 flex justify-between gap-4">
              <dt className="text-[#57534E]">Nhóm / Đợt</dt>
              <dd className="text-[#1C1917] text-right">{aboutInfo.team}</dd>
            </div>
            <div className="py-3 flex justify-between gap-4">
              <dt className="text-[#57534E]">Chương trình</dt>
              <dd className="text-[#1C1917] text-right max-w-[220px]">{aboutInfo.program}</dd>
            </div>
            <div className="py-3 flex justify-between gap-4">
              <dt className="text-[#57534E]">Loại hình</dt>
              <dd className="font-medium text-[#1C1917] text-right">{aboutInfo.nature}</dd>
            </div>
            <div className="py-3 flex justify-between gap-4">
              <dt className="text-[#57534E]">Người số hoá, ngày số hoá</dt>
              <dd className="font-mono text-xs text-[#1C1917] text-right">
                Nguyễn Văn An – PH70154 · 17/11/2026
              </dd>
            </div>
            <div className="py-3 flex justify-between gap-4">
              <dt className="text-[#57534E]">Chuẩn biên mục</dt>
              <dd className="text-xs font-medium text-[#8C2D19] text-right">
                20 trường chuẩn · Điều 63 Luật 2024
              </dd>
            </div>
          </dl>
        </aside>
      </section>

      {/* 3 Visual Sections: Digitization Goal, Hán Nôm Preservation, Paper-to-Digital Workflow */}
      <section className="pt-4 border-t border-[#D6CEBE] space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-[#8C2D19] font-medium">
            Tư liệu hình ảnh giới thiệu đề tài
          </p>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#1C1917]">
            Mục tiêu số hóa, bảo tồn Hán Nôm &amp; quy trình chuyển đổi số
          </h2>
          <p className="mt-1 text-xs text-[#57534E]">
            Nhóm ảnh minh họa trực quan mô tả định hướng thực hiện đề tài “Gia phả dòng họ từ bản
            chép tay sang bản số”.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {thematicFigures.map((fig) => (
            <figure
              key={fig.id}
              className="border border-[#D6CEBE] bg-[#FBF9F5] flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] bg-[#EBE6DF] border-b border-[#D6CEBE] overflow-hidden">
                  <ArchivalImage src={fig.imageUrl} alt={fig.title} caption={fig.caption} />
                </div>
                <div className="p-5 space-y-2">
                  <div className="text-[11px] font-mono text-[#57534E] uppercase tracking-[0.06em]">
                    {fig.category}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-[#1C1917]">{fig.title}</h3>
                  <figcaption className="text-xs text-[#44403C] leading-relaxed">
                    {fig.caption}
                  </figcaption>
                </div>
              </div>
              <div className="px-5 py-3 border-t border-[#E5DEC9] bg-[#F6F2EA] text-[11px] text-[#57534E]">
                Nguồn: {fig.source}
              </div>
            </figure>
          ))}
        </div>
      </section>

      {/* Reference Sources Quick List */}
      <section className="pt-4 border-t border-[#D6CEBE] space-y-5">
        <h2 className="font-display text-2xl font-semibold text-[#1C1917]">
          Danh mục nguồn tư liệu tham khảo ({sources.length} nguồn)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sources.map((source) => (
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
