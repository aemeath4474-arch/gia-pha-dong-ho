import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  Check,
  Contrast,
  Copy,
  Download,
  FileCode2,
  FileText,
  ImagePlus,
  Loader2,
  Maximize2,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  digitizeManuscript,
  readFileAsBase64,
  validateImageFile,
} from '../api/archiveClient';
import type {
  DigitizeColumnResult,
  DigitizeManuscriptResponse,
  DigitizeUncertainSegment,
  FolioRecord,
} from '../types/archive';
import { ArchivalImage } from './ArchivalImage';

interface DigitizerViewProps {
  folios: FolioRecord[];
  selectedPage: number;
  onOpenPage: (pageNumber: number) => void;
}

type ResultTab = 'columns' | 'merged' | 'uncertain' | 'genealogy';

const SAMPLE_PAGE_NUMBERS = [1, 2, 11, 19, 27, 43, 47, 52];

const SECTION_HINTS = [
  'Phả tự & Mở đầu',
  'Hành trạng khoa bảng / Liệt truyện',
  'Sắc phong / Văn bia / Điển cố',
  'Lệ tục thờ tự / Ruộng tế điền',
  'Bảng kê Thế thứ / Sơ đồ phả hệ',
  'Hậu ký / Tục biên cuối tập',
];

export const DigitizerView: React.FC<DigitizerViewProps> = ({
  folios,
  selectedPage,
  onOpenPage,
}) => {
  const [sourceMode, setSourceMode] = useState<'upload' | 'sample'>('sample');
  const [samplePage, setSamplePage] = useState<number>(2);
  const [targetPage, setTargetPage] = useState<number>(selectedPage || 2);
  const [sectionHint, setSectionHint] = useState<string>(SECTION_HINTS[0]);
  const [customPrompt, setCustomPrompt] = useState<string>('');

  // Uploaded file state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedBase64, setUploadedBase64] = useState<string>('');
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string>('');
  const [fileError, setFileError] = useState<string | null>(null);

  // Image viewer controls
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [highContrastInk, setHighContrastInk] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Conversion execution & editable state
  const [converting, setConverting] = useState<boolean>(false);
  const [convertError, setConvertError] = useState<string | null>(null);
  const [result, setResult] = useState<DigitizeManuscriptResponse | null>(null);
  const [activeTab, setActiveTab] = useState<ResultTab>('columns');

  // Action feedback states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreen]);

  const sampleFolios = useMemo(() => {
    return SAMPLE_PAGE_NUMBERS.map((num) => folios.find((f) => f.pageNumber === num)).filter(
      (f): f is FolioRecord => Boolean(f && f.imageUrl)
    );
  }, [folios]);

  const selectedSampleFolio = useMemo(
    () => folios.find((f) => f.pageNumber === samplePage) || sampleFolios[0] || folios[0],
    [folios, sampleFolios, samplePage]
  );

  const activeImageUrl =
    sourceMode === 'upload' ? uploadedPreviewUrl : selectedSampleFolio?.imageUrl || '';

  const activeImageLabel =
    sourceMode === 'upload'
      ? uploadedFile?.name || 'Ảnh bản chép tay tải lên'
      : `${selectedSampleFolio?.folioCode || ''} — ${selectedSampleFolio?.title || ''}`;

  const handleFileChange = async (file: File | undefined) => {
    setFileError(null);
    setConvertError(null);
    if (!file) return;

    const validationErr = validateImageFile(file);
    if (validationErr) {
      setFileError(validationErr);
      return;
    }

    try {
      const dataUrl = await readFileAsBase64(file);
      setUploadedFile(file);
      setUploadedBase64(dataUrl);
      setUploadedPreviewUrl(dataUrl);
      setSourceMode('upload');
    } catch (err) {
      setFileError(err instanceof Error ? err.message : 'Không thể đọc tệp ảnh đã chọn.');
    }
  };

  const handleRunConversion = async () => {
    setConvertError(null);

    if (sourceMode === 'upload' && (!uploadedFile || !uploadedBase64)) {
      setConvertError('Vui lòng chọn một tệp ảnh gia phả chép tay (JPG, PNG, WEBP) để bắt đầu.');
      return;
    }
    if (sourceMode === 'sample' && !selectedSampleFolio?.imageUrl) {
      setConvertError('Trang mẫu được chọn hiện chưa có hình ảnh để chuyển đổi.');
      return;
    }

    setConverting(true);
    try {
      const response = await digitizeManuscript(
        sourceMode === 'upload' && uploadedFile
          ? {
              mimeType: uploadedFile.type,
              dataBase64: uploadedBase64,
              pageNumber: targetPage,
              sectionHint,
              customPrompt,
            }
          : {
              sourceImageUrl: selectedSampleFolio.imageUrl,
              pageNumber: targetPage,
              sectionHint,
              customPrompt,
            }
      );
      setResult(response);
      setActiveTab('columns');
    } catch (err) {
      setConvertError(
        err instanceof Error ? err.message : 'Không thể chuyển đổi bản chép tay sang bản số.'
      );
    } finally {
      setConverting(false);
    }
  };

  const updateColumn = (index: number, patch: Partial<DigitizeColumnResult>) => {
    setResult((prev) => {
      if (!prev) return prev;
      const nextCols = prev.columns.map((c, idx) => (idx === index ? { ...c, ...patch } : c));
      return {
        ...prev,
        columns: nextCols,
        fullHanNomText: nextCols.map((c) => c.hanNom).filter(Boolean).join('\n'),
        fullPhienAmText: nextCols.map((c) => c.phienAm).filter(Boolean).join('\n'),
        fullVietnameseTranslation: nextCols.map((c) => c.dichNghia).filter(Boolean).join('\n'),
      };
    });
  };

  const addEmptyColumn = () => {
    setResult((prev) => {
      if (!prev) return prev;
      const nextIdx = prev.columns.length + 1;
      const nextCols: DigitizeColumnResult[] = [
        ...prev.columns,
        {
          columnIndex: nextIdx,
          hanNom: '',
          phienAm: '',
          dichNghia: '',
          ghiChu: '',
          isUncertain: false,
          uncertainNote: '',
        },
      ];
      return { ...prev, columns: nextCols };
    });
  };

  const removeColumn = (index: number) => {
    setResult((prev) => {
      if (!prev) return prev;
      const nextCols = prev.columns
        .filter((_, idx) => idx !== index)
        .map((c, idx) => ({ ...c, columnIndex: idx + 1 }));
      return {
        ...prev,
        columns: nextCols,
        fullHanNomText: nextCols.map((c) => c.hanNom).filter(Boolean).join('\n'),
        fullPhienAmText: nextCols.map((c) => c.phienAm).filter(Boolean).join('\n'),
        fullVietnameseTranslation: nextCols.map((c) => c.dichNghia).filter(Boolean).join('\n'),
      };
    });
  };

  const removeUncertainSegment = (index: number) => {
    setResult((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        uncertainSegments: prev.uncertainSegments.filter((_, idx) => idx !== index),
      };
    });
  };

  const addUncertainSegment = () => {
    setResult((prev) => {
      if (!prev) return prev;
      const nextItem: DigitizeUncertainSegment = {
        glyphOrPhrase: '[?]',
        locationNote: 'Cần bổ sung vị trí cột',
        reason: 'Chữ viết thảo hoặc nét mờ cần đối chiếu thêm.',
      };
      return {
        ...prev,
        uncertainSegments: [...prev.uncertainSegments, nextItem],
      };
    });
  };

  const copyText = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  const buildMarkdownExport = (data: DigitizeManuscriptResponse): string => {
    const targetCode = `A.1046-T${String(targetPage).padStart(2, '0')}`;
    const lines: string[] = [
      `# ${data.documentTitle}`,
      '',
      `- **Hệ thống:** Gia Phả Số – Cội Nguồn Việt (Dự án B02)`,
      `- **Trang liên kết:** ${targetCode}`,
      `- **Phân đoạn:** ${data.sectionHint}`,
      `- **Chiều đọc:** ${data.readingDirection}`,
      `- **Thời điểm chuyển đổi:** ${data.digitizedAt}`,
      '',
      `## Tóm tắt nội dung`,
      data.summary || '(Chưa có tóm tắt)',
      '',
      `## Chi tiết từng cột / khung văn bản`,
      ...data.columns.flatMap((c) => [
        `### Cột ${String(c.columnIndex).padStart(2, '0')}${c.isUncertain ? ' (Cần xác minh)' : ''}`,
        `- **Hán Nôm:** ${c.hanNom}`,
        `- **Phiên âm:** ${c.phienAm}`,
        `- **Dịch nghĩa:** ${c.dichNghia}`,
        c.ghiChu ? `- **Ghi chú:** ${c.ghiChu}` : '',
        c.isUncertain && c.uncertainNote ? `- **Lưu ý chữ nghi vấn:** ${c.uncertainNote}` : '',
        '',
      ]),
      `## Văn bản hợp nhất`,
      `### Phiên chép Hán Nôm`,
      data.fullHanNomText,
      '',
      `### Phiên âm Hán-Việt`,
      data.fullPhienAmText,
      '',
      `### Dịch nghĩa tiếng Việt`,
      data.fullVietnameseTranslation,
    ];

    if (data.uncertainSegments.length > 0) {
      lines.push('', '## Chữ khó đọc / cần xác minh');
      data.uncertainSegments.forEach((u) => {
        lines.push(`- **${u.glyphOrPhrase}** (${u.locationNote}): ${u.reason}`);
      });
    }

    if (data.extractedGenealogy.length > 0) {
      lines.push('', '## Nhân vật / Thế hệ trích xuất');
      data.extractedGenealogy.forEach((g) => {
        lines.push(
          `- **${g.suggestedCode} · ${g.name}** (${g.generationLabel} · ${g.branchType}): ${g.familyRelation}. ${g.summary}`
        );
      });
    }

    return lines.filter((line) => line !== undefined).join('\n');
  };

  const triggerDownload = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-4 pb-6 border-b border-[#D6CEBE]">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#57534E]">
          <span>Đề tài B02 · Gia phả dòng họ từ bản chép tay sang bản số</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-[#8C2D19]">CÔNG CỤ CHUYỂN ĐỔI BẢN SỐ</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1C1917]">
              Chuyển đổi gia phả từ bản chép tay sang bản số
            </h1>
            <p className="mt-2 text-sm text-[#44403C] max-w-3xl leading-relaxed">
              Tải lên ảnh chụp trang gia phả viết tay Hán Nôm (hoặc chọn trang mẫu trên hệ thống)
              để nhận dạng theo từng cột dọc, tách 3 lớp văn bản (Chữ Hán Nôm, Phiên âm Hán-Việt,
              Dịch nghĩa tiếng Việt), đánh dấu chữ khó đọc và trích xuất thông tin thế thứ.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onOpenPage(targetPage)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#1C1917] border border-[#D6CEBE] bg-[#FBF9F5] hover:border-[#1C1917] rounded-sm transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Mở Tr.{String(targetPage).padStart(2, '0')} trong Đối chiếu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step 1: Source & Parameters Panel */}
      <section className="border border-[#D6CEBE] bg-[#F6F2EA] p-5 sm:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-[#8C2D19] font-semibold">
              Bước 01 · Chọn nguồn ảnh bản chép tay &amp; cấu hình số hóa
            </p>
            <h2 className="mt-1 font-display text-xl font-semibold text-[#1C1917]">
              Nguồn tư liệu đầu vào
            </h2>
          </div>

          {/* Source mode toggle */}
          <div className="inline-flex p-1 border border-[#D6CEBE] bg-[#EBE6DF] rounded-sm self-start">
            <button
              type="button"
              onClick={() => setSourceMode('upload')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                sourceMode === 'upload'
                  ? 'bg-[#1C1917] text-[#FBF9F5]'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Tải ảnh từ máy tính</span>
            </button>
            <button
              type="button"
              onClick={() => setSourceMode('sample')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                sourceMode === 'sample'
                  ? 'bg-[#1C1917] text-[#FBF9F5]'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Chọn từ trang mẫu ({sampleFolios.length})</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Upload dropzone OR Sample folio selector */}
          <div className="lg:col-span-7 space-y-4">
            {sourceMode === 'upload' ? (
              <div className="border border-dashed border-[#A89F8D] bg-[#FBF9F5] p-6 text-center space-y-3">
                <ImagePlus className="w-8 h-8 text-[#8C2D19] mx-auto opacity-85" />
                <div className="space-y-1">
                  <p className="font-display text-lg font-semibold text-[#1C1917]">
                    Chọn ảnh trang gia phả viết tay Hán Nôm
                  </p>
                  <p className="text-xs text-[#57534E]">
                    Hỗ trợ định dạng JPG, PNG, WEBP (tối đa 5MB mỗi ảnh). Ảnh rõ nét sẽ cho kết quả
                    tách cột và nhận dạng chữ chính xác hơn.
                  </p>
                </div>
                <div className="pt-1 flex flex-wrap items-center justify-center gap-3">
                  <label className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#FBF9F5] bg-[#1C1917] hover:bg-[#8C2D19] rounded-sm cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadedFile ? 'Chọn ảnh khác' : 'Tải ảnh từ máy tính'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      onChange={(e) => handleFileChange(e.target.files?.[0])}
                    />
                  </label>
                  {uploadedFile && (
                    <span className="font-mono text-xs text-[#1C1917]">
                      {uploadedFile.name} ({Math.round(uploadedFile.size / 1024)} KB)
                    </span>
                  )}
                </div>
                {fileError && (
                  <p className="text-xs text-[#8C2D19] font-medium pt-1">{fileError}</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-[#44403C]">
                  Chọn một trang minh họa theo đúng từng chuyên mục nội dung (từ Tr.01 đến Tr.52) để
                  kiểm thử quy trình đọc cột dọc và trích xuất dữ liệu số:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {sampleFolios.map((folio) => {
                    const isPicked = folio.pageNumber === selectedSampleFolio?.pageNumber;
                    return (
                      <button
                        key={folio.folioCode}
                        type="button"
                        onClick={() => {
                          setSamplePage(folio.pageNumber);
                          setTargetPage(folio.pageNumber);
                        }}
                        className={`text-left border p-2 transition-colors bg-[#FBF9F5] ${
                          isPicked
                            ? 'border-[#8C2D19] ring-1 ring-[#8C2D19]'
                            : 'border-[#D6CEBE] hover:border-[#1C1917]'
                        }`}
                      >
                        <div className="aspect-[4/3] overflow-hidden bg-[#EBE6DF] mb-2">
                          <ArchivalImage
                            src={folio.imageUrl}
                            alt={folio.title}
                            imgClassName="w-full h-full object-cover"
                          />
                        </div>
                        <p className="font-mono text-[11px] font-semibold text-[#8C2D19]">
                          {folio.folioCode}
                        </p>
                        <p className="text-[11px] text-[#1C1917] font-medium line-clamp-1">
                          {folio.title}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: Target folio & prompt options */}
          <div className="lg:col-span-5 bg-[#FBF9F5] border border-[#D6CEBE] p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="space-y-1">
                <span className="font-semibold text-[#1C1917]">Trang đích lưu trữ (A.1046)</span>
                <select
                  value={targetPage}
                  onChange={(e) => setTargetPage(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#D6CEBE] bg-white rounded-sm font-mono text-xs text-[#1C1917]"
                >
                  {folios.map((f) => (
                    <option key={f.folioCode} value={f.pageNumber}>
                      {f.folioCode} · {f.title.slice(0, 32)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="font-semibold text-[#1C1917]">Phân đoạn tài liệu</span>
                <select
                  value={sectionHint}
                  onChange={(e) => setSectionHint(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D6CEBE] bg-white rounded-sm text-xs text-[#1C1917]"
                >
                  {SECTION_HINTS.map((hint) => (
                    <option key={hint} value={hint}>
                      {hint}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block space-y-1 text-xs">
              <span className="font-semibold text-[#1C1917]">
                Ghi chú trọng tâm khi nhận dạng (không bắt buộc)
              </span>
              <textarea
                rows={2}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Ví dụ: Chú trọng tên húy, can chi niên hiệu hoặc phân nhánh Chi Giáp / Chi Ất..."
                className="w-full px-3 py-2 border border-[#D6CEBE] bg-white rounded-sm text-xs text-[#1C1917] placeholder:text-[#78716C] focus:outline-none focus:border-[#8C2D19]"
              />
            </label>

            <button
              type="button"
              disabled={converting || !activeImageUrl}
              onClick={handleRunConversion}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-[#FBF9F5] bg-[#8C2D19] hover:bg-[#1C1917] disabled:opacity-50 disabled:cursor-not-allowed rounded-sm transition-colors"
            >
              {converting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang phân tích &amp; chuyển đổi bản chép tay...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Bắt đầu chuyển đổi sang bản số</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-[#57534E] leading-relaxed">
              Nguyên tắc học thuật: Ký tự mờ nhòe hoặc không rõ nét trên ảnh sẽ được đánh dấu{' '}
              <span className="font-mono text-[#8C2D19]">[?]</span> để chuyên viên đối chiếu xác
              minh, không tự suy đoán thay bản gốc.
            </p>
          </div>
        </div>

        {convertError && (
          <div className="border border-[#8C2D19] bg-[#FBF9F5] p-4 flex items-start gap-2.5 text-xs text-[#8C2D19]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{convertError}</span>
          </div>
        )}
      </section>

      {/* Step 2: Interactive Dual-Pane Conversion Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Manuscript Source Viewer */}
        <section className="lg:col-span-5 border border-[#D6CEBE] bg-[#F3EFE6] flex flex-col">
          <div className="px-4 py-3 border-b border-[#D6CEBE] bg-[#EBE6DF] flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#1C1917]">
              Bản chép tay đầu vào
            </span>

            {activeImageUrl && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setHighContrastInk((v) => !v)}
                  className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-sm border transition-colors ${
                    highContrastInk
                      ? 'bg-[#8C2D19] text-[#FBF9F5] border-[#8C2D19]'
                      : 'bg-[#FBF9F5] text-[#1C1917] border-[#D6CEBE]'
                  }`}
                >
                  <Contrast className="w-3.5 h-3.5" />
                  <span>Mực</span>
                </button>
                <div className="flex items-center border border-[#D6CEBE] bg-[#FBF9F5] rounded-sm">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(75, z - 25))}
                    disabled={zoomLevel <= 75}
                    aria-label="Thu nhỏ ảnh"
                    className="p-1 text-[#1C1917] disabled:opacity-40"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-1.5 font-mono text-[11px] tabular-nums">{zoomLevel}%</span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(200, z + 25))}
                    disabled={zoomLevel >= 200}
                    aria-label="Phóng to ảnh"
                    className="p-1 text-[#1C1917] disabled:opacity-40"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFullscreen(true)}
                  aria-label="Phóng to toàn màn hình"
                  className="p-1.5 border border-[#D6CEBE] bg-[#FBF9F5] text-[#1C1917] hover:bg-[#1C1917] hover:text-[#FBF9F5] rounded-sm transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="p-5 overflow-auto max-h-[640px] flex items-center justify-center bg-[#E4DDD2]">
            {activeImageUrl ? (
              <div
                className="inline-block border border-[#C7BFA9] shadow-sm transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              >
                <ArchivalImage
                  src={activeImageUrl}
                  alt={activeImageLabel}
                  imgClassName={`max-w-full w-[420px] h-auto block ${
                    highContrastInk ? 'contrast-125 grayscale-[25%] brightness-95' : ''
                  }`}
                />
              </div>
            ) : (
              <div className="w-full min-h-[360px] flex flex-col items-center justify-center text-center p-6 bg-[#FBF9F5] border border-dashed border-[#D6CEBE]">
                <FileText className="w-8 h-8 text-[#8C2D19] mb-3 opacity-75" />
                <p className="font-display text-base font-semibold text-[#1C1917]">
                  Chưa có ảnh được chọn
                </p>
                <p className="mt-1 text-xs text-[#57534E] max-w-xs">
                  Tải lên tệp ảnh từ máy tính hoặc chuyển sang tab chọn trang mẫu để xem trước ảnh.
                </p>
              </div>
            )}
          </div>

          <div className="px-4 py-3 border-t border-[#D6CEBE] bg-[#FBF9F5] text-xs text-[#57534E] flex items-center justify-between gap-2">
            <span className="truncate font-medium text-[#1C1917]">{activeImageLabel}</span>
            <span className="font-mono text-[11px] text-[#8C2D19] shrink-0">
              Đích: A.1046-T{String(targetPage).padStart(2, '0')}
            </span>
          </div>
        </section>

        {/* Right Pane: Structured Digital Output & Editor */}
        <section className="lg:col-span-7 border border-[#D6CEBE] bg-[#FBF9F5] flex flex-col">
          <div className="px-4 py-3 border-b border-[#D6CEBE] bg-[#F6F2EA] flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#1C1917]">
              Kết quả bản số có cấu trúc
            </span>

            {result && (
              <div className="flex flex-wrap items-center gap-1 p-0.5 border border-[#D6CEBE] bg-[#EBE6DF] rounded-sm">
                {(
                  [
                    { id: 'columns', label: `Cột văn bản (${result.columns.length})` },
                    { id: 'merged', label: 'Văn bản hợp nhất' },
                    { id: 'uncertain', label: `Nghi vấn (${result.uncertainSegments.length})` },
                    { id: 'genealogy', label: `Phả hệ (${result.extractedGenealogy.length})` },
                  ] as { id: ResultTab; label: string }[]
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-[#FBF9F5] text-[#1C1917]'
                        : 'text-[#57534E] hover:text-[#1C1917]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            {!result ? (
              <div className="py-12 text-center space-y-4">
                <BookOpen className="w-8 h-8 text-[#8C2D19] mx-auto opacity-80" strokeWidth={1.5} />
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="font-display text-xl font-semibold text-[#1C1917]">
                    Sẵn sàng chuyển đổi bản chép tay sang bản số
                  </h3>
                  <p className="text-sm text-[#57534E] leading-relaxed">
                    Nhấn nút <strong>Bắt đầu chuyển đổi sang bản số</strong> ở bảng cấu hình phía
                    trên. Kết quả nhận dạng sẽ tách rõ từng cột chữ Hán Nôm, phiên âm Hán-Việt,
                    dịch nghĩa tiếng Việt và cho phép hiệu đính trực tiếp trước khi sao chép hoặc xuất tệp.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Export & Save Toolbar */}
                <div className="border border-[#D6CEBE] bg-[#F6F2EA] p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs text-[#57534E]">
                      Chiều đọc: <strong className="text-[#1C1917]">{result.readingDirection}</strong>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyText('md', buildMarkdownExport(result))}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium border border-[#D6CEBE] bg-white hover:border-[#1C1917] rounded-sm"
                      >
                        {copiedKey === 'md' ? (
                          <Check className="w-3.5 h-3.5 text-[#14532D]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedKey === 'md' ? 'Đã chép' : 'Sao chép toàn văn'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          triggerDownload(
                            `chuyen-doi-A1046-T${String(targetPage).padStart(2, '0')}.md`,
                            buildMarkdownExport(result),
                            'text/markdown;charset=utf-8'
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium border border-[#D6CEBE] bg-white hover:border-[#1C1917] rounded-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Xuất Markdown</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          triggerDownload(
                            `chuyen-doi-A1046-T${String(targetPage).padStart(2, '0')}.json`,
                            JSON.stringify(result, null, 2),
                            'application/json;charset=utf-8'
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium border border-[#D6CEBE] bg-white hover:border-[#1C1917] rounded-sm"
                      >
                        <FileCode2 className="w-3.5 h-3.5" />
                        <span>Xuất JSON</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tab 1: Editable Columns */}
                {activeTab === 'columns' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[#57534E]">
                        Hiệu đính trực tiếp từng cột chữ Hán Nôm, phiên âm và dịch nghĩa trước khi
                        sao chép hoặc xuất tệp.
                      </p>
                      <button
                        type="button"
                        onClick={addEmptyColumn}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium border border-[#D6CEBE] hover:border-[#1C1917] rounded-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm cột</span>
                      </button>
                    </div>

                    {result.columns.length === 0 ? (
                      <p className="text-xs text-[#57534E] border border-dashed border-[#D6CEBE] p-5 text-center">
                        Chưa có cột phân tách riêng. Kiểm tra tab Văn bản hợp nhất hoặc nhấn Thêm cột.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {result.columns.map((col, idx) => (
                          <div
                            key={idx}
                            className={`border p-4 space-y-3 text-xs ${
                              col.isUncertain
                                ? 'border-[#8C2D19]/50 bg-[#8C2D19]/3'
                                : 'border-[#D6CEBE] bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono font-semibold text-[#8C2D19]">
                                Cột {String(col.columnIndex).padStart(2, '0')}
                              </span>
                              <div className="flex items-center gap-3">
                                <label className="inline-flex items-center gap-1.5 cursor-pointer text-[#57534E]">
                                  <input
                                    type="checkbox"
                                    checked={col.isUncertain}
                                    onChange={(e) =>
                                      updateColumn(idx, { isUncertain: e.target.checked })
                                    }
                                    className="accent-[#8C2D19]"
                                  />
                                  <span>Đánh dấu cần xác minh</span>
                                </label>
                                <button
                                  type="button"
                                  onClick={() => removeColumn(idx)}
                                  className="text-[#8C2D19] hover:underline"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-2.5">
                              <label className="space-y-1">
                                <span className="text-[11px] uppercase tracking-wider text-[#57534E]">
                                  Chữ Hán Nôm
                                </span>
                                <input
                                  type="text"
                                  value={col.hanNom}
                                  onChange={(e) => updateColumn(idx, { hanNom: e.target.value })}
                                  className="w-full px-3 py-2 border border-[#D6CEBE] bg-[#FBF9F5] font-display text-base text-[#1C1917] rounded-sm"
                                />
                              </label>
                              <label className="space-y-1">
                                <span className="text-[11px] uppercase tracking-wider text-[#57534E]">
                                  Phiên âm Hán-Việt
                                </span>
                                <input
                                  type="text"
                                  value={col.phienAm}
                                  onChange={(e) => updateColumn(idx, { phienAm: e.target.value })}
                                  className="w-full px-3 py-1.5 border border-[#D6CEBE] bg-[#FBF9F5] italic text-[#1C1917] rounded-sm"
                                />
                              </label>
                              <label className="space-y-1">
                                <span className="text-[11px] uppercase tracking-wider text-[#57534E]">
                                  Dịch nghĩa tiếng Việt
                                </span>
                                <textarea
                                  rows={2}
                                  value={col.dichNghia}
                                  onChange={(e) => updateColumn(idx, { dichNghia: e.target.value })}
                                  className="w-full px-3 py-1.5 border border-[#D6CEBE] bg-[#FBF9F5] text-[#1C1917] rounded-sm"
                                />
                              </label>
                              <label className="space-y-1">
                                <span className="text-[11px] uppercase tracking-wider text-[#57534E]">
                                  Ghi chú văn bản học
                                </span>
                                <input
                                  type="text"
                                  value={col.ghiChu}
                                  onChange={(e) => updateColumn(idx, { ghiChu: e.target.value })}
                                  className="w-full px-3 py-1.5 border border-[#D6CEBE] bg-[#FBF9F5] text-[#44403C] rounded-sm"
                                />
                              </label>
                              {col.isUncertain && (
                                <label className="space-y-1">
                                  <span className="text-[11px] uppercase tracking-wider text-[#8C2D19]">
                                    Lý do cần đối chiếu / chữ mờ
                                  </span>
                                  <input
                                    type="text"
                                    value={col.uncertainNote}
                                    onChange={(e) =>
                                      updateColumn(idx, { uncertainNote: e.target.value })
                                    }
                                    className="w-full px-3 py-1.5 border border-[#8C2D19]/40 bg-white text-[#8C2D19] rounded-sm"
                                  />
                                </label>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Merged Full Text */}
                {activeTab === 'merged' && (
                  <div className="space-y-4 text-xs">
                    <label className="block space-y-1">
                      <span className="font-semibold text-[#1C1917]">Tiêu đề trang văn bản</span>
                      <input
                        type="text"
                        value={result.documentTitle}
                        onChange={(e) =>
                          setResult((prev) =>
                            prev ? { ...prev, documentTitle: e.target.value } : prev
                          )
                        }
                        className="w-full px-3 py-2 border border-[#D6CEBE] bg-white font-display text-base text-[#1C1917] rounded-sm"
                      />
                    </label>

                    <label className="block space-y-1">
                      <span className="font-semibold text-[#1C1917]">Tóm tắt khái quát</span>
                      <textarea
                        rows={2}
                        value={result.summary}
                        onChange={(e) =>
                          setResult((prev) => (prev ? { ...prev, summary: e.target.value } : prev))
                        }
                        className="w-full px-3 py-2 border border-[#D6CEBE] bg-white text-[#1C1917] rounded-sm"
                      />
                    </label>

                    <label className="block space-y-1">
                      <span className="font-semibold text-[#1C1917]">
                        Lớp 1 · Toàn văn chữ Hán Nôm
                      </span>
                      <textarea
                        rows={4}
                        value={result.fullHanNomText}
                        onChange={(e) =>
                          setResult((prev) =>
                            prev ? { ...prev, fullHanNomText: e.target.value } : prev
                          )
                        }
                        className="w-full px-3 py-2 border border-[#D6CEBE] bg-white font-display text-base text-[#1C1917] rounded-sm"
                      />
                    </label>

                    <label className="block space-y-1">
                      <span className="font-semibold text-[#1C1917]">
                        Lớp 2 · Toàn văn Phiên âm Hán-Việt
                      </span>
                      <textarea
                        rows={4}
                        value={result.fullPhienAmText}
                        onChange={(e) =>
                          setResult((prev) =>
                            prev ? { ...prev, fullPhienAmText: e.target.value } : prev
                          )
                        }
                        className="w-full px-3 py-2 border border-[#D6CEBE] bg-white italic text-[#1C1917] rounded-sm"
                      />
                    </label>

                    <label className="block space-y-1">
                      <span className="font-semibold text-[#1C1917]">
                        Lớp 3 · Toàn văn Dịch nghĩa tiếng Việt
                      </span>
                      <textarea
                        rows={5}
                        value={result.fullVietnameseTranslation}
                        onChange={(e) =>
                          setResult((prev) =>
                            prev ? { ...prev, fullVietnameseTranslation: e.target.value } : prev
                          )
                        }
                        className="w-full px-3 py-2 border border-[#D6CEBE] bg-white text-sm text-[#1C1917] rounded-sm"
                      />
                    </label>
                  </div>
                )}

                {/* Tab 3: Uncertain Glyphs */}
                {activeTab === 'uncertain' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[#57534E]">
                        Các ký tự mờ nhòe, viết thảo hoặc chữ kiêng húy cần đối chiếu thêm.
                      </p>
                      <button
                        type="button"
                        onClick={addUncertainSegment}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium border border-[#D6CEBE] hover:border-[#1C1917] rounded-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm ghi chú</span>
                      </button>
                    </div>

                    {result.uncertainSegments.length === 0 ? (
                      <div className="border border-dashed border-[#D6CEBE] p-5 text-center text-xs text-[#57534E]">
                        Không ghi nhận ký tự nghi vấn nào trên trang này.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {result.uncertainSegments.map((seg, idx) => (
                          <div
                            key={idx}
                            className="border border-[#D6CEBE] bg-white p-3.5 space-y-2 text-xs"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="text"
                                value={seg.glyphOrPhrase}
                                onChange={(e) =>
                                  setResult((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          uncertainSegments: prev.uncertainSegments.map((u, i) =>
                                            i === idx ? { ...u, glyphOrPhrase: e.target.value } : u
                                          ),
                                        }
                                      : prev
                                  )
                                }
                                className="font-display text-base font-semibold text-[#1C1917] border-b border-[#E5DEC9] focus:outline-none focus:border-[#8C2D19] flex-1"
                              />
                              <button
                                type="button"
                                onClick={() => removeUncertainSegment(idx)}
                                className="text-[#8C2D19] hover:underline"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={seg.locationNote}
                              onChange={(e) =>
                                setResult((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        uncertainSegments: prev.uncertainSegments.map((u, i) =>
                                          i === idx ? { ...u, locationNote: e.target.value } : u
                                        ),
                                      }
                                    : prev
                                )
                              }
                              className="w-full text-[#57534E] border-b border-[#E5DEC9] pb-1 focus:outline-none"
                            />
                            <textarea
                              rows={2}
                              value={seg.reason}
                              onChange={(e) =>
                                setResult((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        uncertainSegments: prev.uncertainSegments.map((u, i) =>
                                          i === idx ? { ...u, reason: e.target.value } : u
                                        ),
                                      }
                                    : prev
                                )
                              }
                              className="w-full px-2 py-1 border border-[#D6CEBE] bg-[#FBF9F5] text-[#44403C] rounded-sm"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 4: Extracted Genealogy Suggestions */}
                {activeTab === 'genealogy' && (
                  <div className="space-y-4">
                    <p className="text-xs text-[#57534E]">
                      Các thực thể nhân vật, thế hệ hoặc phân chi được phát hiện từ văn bản gia phả
                      trên ảnh (có thể sao chép hoặc xuất qua Markdown/JSON).
                    </p>

                    {result.extractedGenealogy.length === 0 ? (
                      <div className="border border-dashed border-[#D6CEBE] p-5 text-center text-xs text-[#57534E]">
                        Ảnh này không chứa mục liệt kê nhân vật thế thứ cụ thể.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {result.extractedGenealogy.map((item, idx) => (
                          <div
                            key={idx}
                            className="border border-[#D6CEBE] bg-white p-4 space-y-2 text-xs"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-semibold text-[#8C2D19]">
                                  {item.suggestedCode}
                                </span>
                                <span className="text-[#57534E]">
                                  {item.generationLabel} · {item.branchType}
                                </span>
                              </div>
                            </div>

                            <h4 className="font-display text-lg font-semibold text-[#1C1917]">
                              {item.name}
                            </h4>
                            <p className="text-[#57534E]">
                              Tên húy / ghi chú: <strong className="text-[#1C1917]">{item.tabooName}</strong> ·{' '}
                              Vai trò: {item.roleTitle}
                            </p>
                            <p className="text-[#44403C]">Quan hệ: {item.familyRelation}</p>
                            {item.summary && (
                              <p className="text-[#44403C] leading-relaxed">{item.summary}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      {/* Fullscreen Lightbox */}
      {isFullscreen && activeImageUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Xem ảnh bản chép tay toàn màn hình"
          className="fixed inset-0 z-50 bg-[#1C1917]/95 text-[#FBF9F5] flex flex-col"
        >
          <div className="px-6 py-4 border-b border-white/15 flex items-center justify-between gap-4">
            <span className="font-display font-semibold text-sm">{activeImageLabel}</span>
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#8C2D19] hover:bg-white hover:text-[#1C1917] rounded-sm transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Đóng</span>
            </button>
          </div>
          <div className="flex-1 overflow-auto p-6 flex justify-center items-start">
            <img
              src={activeImageUrl}
              alt={activeImageLabel}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              className={`select-none max-w-full w-[720px] h-auto ${
                highContrastInk ? 'contrast-125 grayscale-[25%] brightness-95' : ''
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
};
