import React from 'react';
import { AlertCircle, ArrowUpRight, ShieldAlert } from 'lucide-react';
import type { StandardArchivalRecord } from '../types/archive';

interface StandardArchivalRecordTableProps {
  record: StandardArchivalRecord;
  onSelectRecordCode?: (code: string) => void;
}

export const StandardArchivalRecordTable: React.FC<StandardArchivalRecordTableProps> = ({
  record,
  onSelectRecordCode,
}) => {
  const relatedCodes = Array.from(new Set(record.relations.match(/B02-\d{5}/g) || [])).filter(
    (code) => code !== record.identifier
  );

  const rows: {
    num: string;
    label: string;
    content: React.ReactNode;
    tone?: 'default' | 'highlight' | 'caution';
  }[] = [
    {
      num: '01',
      label: 'Mã định danh',
      content: (
        <span className="font-mono font-semibold text-[#8C2D19]">{record.identifier}</span>
      ),
    },
    {
      num: '02',
      label: 'Nhan đề',
      content: <span className="font-semibold text-[#1C1917]">{record.title}</span>,
    },
    {
      num: '03',
      label: 'Loại',
      content: <span className="text-[#1C1917]">{record.recordType}</span>,
    },
    {
      num: '04',
      label: 'Niên đại',
      content: <span className="text-[#1C1917] leading-relaxed">{record.dating}</span>,
    },
    {
      num: '05',
      label: 'Mô tả',
      content: (
        <span className="text-[#292524] leading-relaxed">{record.physicalDescription}</span>
      ),
    },
    {
      num: '06',
      label: 'Ngôn ngữ, chữ viết',
      content: <span className="font-medium text-[#1C1917]">{record.languageScript}</span>,
    },
    {
      num: '07',
      label: 'Nơi lưu giữ hiện nay',
      content: (
        <div className="space-y-1">
          <p className="font-medium text-[#1C1917]">{record.currentRepository}</p>
          <p className="text-[11px] text-[#57534E]">
            Ghi theo đơn vị hành chính hai cấp hiện hành.
          </p>
        </div>
      ),
    },
    {
      num: '08',
      label: 'Nơi lưu giữ tại thời điểm tư liệu',
      content: (
        <div className="space-y-1">
          <p className="text-[#292524] leading-relaxed">{record.historicalRepository}</p>
          <p className="text-[11px] text-[#57534E]">
            Bảo lưu nguyên địa danh cũ được dẫn trong danh mục thư viện và thư tịch trước đây.
          </p>
        </div>
      ),
    },
    {
      num: '09',
      label: 'Số đăng ký tại nơi lưu giữ',
      content: <span className="font-mono font-semibold text-[#1C1917]">{record.repositoryRegNo}</span>,
    },
    {
      num: '10',
      label: 'Loại bản đang hiển thị',
      content: (
        <div className="space-y-1">
          <p className="font-medium text-[#1C1917] leading-relaxed">{record.displayedCopyType}</p>
          <p className="text-[11px] text-[#8C2D19]">
            Phân loại trung thực theo Điều 63 Luật Di sản văn hóa / Luật Lưu trữ 2024.
          </p>
        </div>
      ),
      tone: 'highlight',
    },
    {
      num: '11',
      label: 'Tình trạng bản gốc',
      content: <span className="text-[#292524] leading-relaxed">{record.originalCondition}</span>,
    },
    {
      num: '12',
      label: 'Tệp đính kèm',
      content: <span className="font-mono text-xs text-[#292524] leading-relaxed break-words">{record.attachments}</span>,
    },
    {
      num: '13',
      label: 'Phiên âm, dịch nghĩa',
      content: (
        <div className="space-y-3">
          {record.transcriptionAndTranslation.hanNom && (
            <div className="border border-[#E5DEC9] bg-[#F6F2EA] p-3 space-y-1">
              <p className="text-[11px] uppercase tracking-wider text-[#57534E] font-semibold">
                Nguyên văn chữ Hán Nôm (tham chiếu cấu trúc)
              </p>
              <p className="font-display text-base text-[#1C1917] leading-relaxed">
                {record.transcriptionAndTranslation.hanNom}
              </p>
            </div>
          )}

          <div className="border border-[#D6CEBE] bg-white p-3 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] uppercase tracking-wider text-[#57534E] font-semibold">
                13a · Phiên âm Hán-Việt
              </span>
              <span className="text-[11px] font-medium text-[#8C2D19]">
                Mức kiểm chứng Phiên âm
              </span>
            </div>
            <p className="text-sm italic text-[#1C1917] leading-relaxed">
              {record.transcriptionAndTranslation.phienAm}
            </p>
            <p className="text-xs text-[#44403C] bg-[#F6F2EA] px-2.5 py-1.5 border border-[#E5DEC9]">
              <strong>Nhãn kiểm chứng:</strong>{' '}
              {record.transcriptionAndTranslation.phienAmVerification}
            </p>
          </div>

          <div className="border border-[#D6CEBE] bg-white p-3 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] uppercase tracking-wider text-[#57534E] font-semibold">
                13b · Dịch nghĩa tiếng Việt
              </span>
              <span className="text-[11px] font-medium text-[#57534E]">
                Mức kiểm chứng Dịch nghĩa (tách riêng)
              </span>
            </div>
            <p className="text-sm text-[#1C1917] leading-relaxed">
              {record.transcriptionAndTranslation.dichNghia}
            </p>
            <p className="text-xs text-[#44403C] bg-[#F6F2EA] px-2.5 py-1.5 border border-[#E5DEC9]">
              <strong>Nhãn kiểm chứng:</strong>{' '}
              {record.transcriptionAndTranslation.dichNghiaVerification}
            </p>
          </div>
        </div>
      ),
    },
    {
      num: '14',
      label: 'Quan hệ',
      content: (
        <div className="space-y-2">
          <p className="text-[#292524] leading-relaxed">{record.relations}</p>
          {onSelectRecordCode && relatedCodes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {relatedCodes.slice(0, 8).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => onSelectRecordCode(code)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-mono font-medium text-[#8C2D19] bg-[#F6F2EA] border border-[#D6CEBE] hover:border-[#8C2D19] hover:bg-[#8C2D19] hover:text-[#FBF9F5] rounded-sm transition-colors"
                >
                  <span>{code}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      num: '15',
      label: 'Người cho phép công bố',
      content: <span className="text-[#292524] leading-relaxed">{record.permissionGrantor}</span>,
    },
    {
      num: '16',
      label: 'Phạm vi được phép',
      content: (
        <div className="flex items-start gap-2 text-[#1C1917]">
          <ShieldAlert className="w-4 h-4 text-[#8C2D19] shrink-0 mt-0.5" />
          <span className="leading-relaxed">{record.allowedScope}</span>
        </div>
      ),
      tone: 'highlight',
    },
    {
      num: '17',
      label: 'Phần không công bố',
      content: <span className="text-[#292524] leading-relaxed">{record.unpublishedParts}</span>,
    },
    {
      num: '18',
      label: 'Nguồn tư liệu',
      content: <span className="text-[#292524] leading-relaxed">{record.referenceSources}</span>,
    },
    {
      num: '19',
      label: 'Người số hoá, ngày số hoá',
      content: <span className="font-mono text-xs text-[#1C1917]">{record.digitizerAndDate}</span>,
    },
    {
      num: '20',
      label: 'Điểm chưa rõ',
      content: (
        <div className="flex items-start gap-2 text-[#1C1917]">
          <AlertCircle className="w-4 h-4 text-[#8C2D19] shrink-0 mt-0.5" />
          <span className="leading-relaxed">{record.uncertainPoints}</span>
        </div>
      ),
      tone: 'caution',
    },
  ];

  return (
    <dl className="divide-y divide-[#E5DEC9] border-y border-[#D6CEBE] text-sm">
      {rows.map((row) => (
        <div
          key={row.num}
          className={`py-3.5 px-2 sm:px-3 grid grid-cols-1 sm:grid-cols-12 gap-2.5 ${
            row.tone === 'caution'
              ? 'bg-[#8C2D19]/5'
              : row.tone === 'highlight'
                ? 'bg-[#F6F2EA]/75'
                : ''
          }`}
        >
          <dt className="sm:col-span-4 text-xs uppercase tracking-[0.06em] font-semibold text-[#57534E] flex items-start gap-2">
            <span className="font-mono text-[#8C2D19] tabular-nums">{row.num}.</span>
            <span>{row.label}</span>
          </dt>
          <dd className="sm:col-span-8 text-sm">{row.content}</dd>
        </div>
      ))}
    </dl>
  );
};
