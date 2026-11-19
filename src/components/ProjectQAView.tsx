import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowUpRight,
  BookOpen,
  CornerDownLeft,
  Loader2,
  MessageSquare,
  RotateCcw,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { askProjectQA } from '../api/archiveClient';
import type {
  AppSection,
  ArchiveDatabase,
  ProjectQACitation,
  ProjectQAHistoryTurn,
  ProjectQAMessage,
} from '../types/archive';

interface ProjectQAViewProps {
  db: ArchiveDatabase;
  onNavigate: (section: AppSection) => void;
  onOpenPage: (pageNumber: number) => void;
}

const STARTER_TOPICS: { category: string; question: string }[] = [
  {
    category: 'Thông tin đề tài B02',
    question:
      'Dự án B02 "Gia Phả Số – Cội Nguồn Việt" nghiên cứu tư liệu nào, do ai thực hiện và phạm vi 82 trang gồm những phần nào?',
  },
  {
    category: 'Chuẩn 20 trường & Luật 2024',
    question:
      'Hệ thống mã định danh B02-00001 đến B02-00182, chuẩn biên mục 20 trường và quy định Điều 63 Luật Lưu trữ 2024 được áp dụng thế nào?',
  },
  {
    category: 'Phiên âm vs Dịch nghĩa',
    question:
      'Vì sao dự án tách riêng mức kiểm chứng của Phiên âm và Dịch nghĩa, và tình trạng tiếp cận bản gốc A.1046 hiện ra sao?',
  },
  {
    category: 'Phả hệ Nguyễn tộc Bối Khê',
    question:
      'Cấu trúc thế thứ dòng họ Nguyễn ở Bối Khê (Đời I – Đời V+, Chi Giáp / Chi Ất) trong phần Bối Khê Nguyễn tộc gia phả thế thứ gồm những ai?',
  },
  {
    category: 'Địa danh hành chính',
    question:
      'Cách ghi nơi lưu giữ hiện nay theo đơn vị hành chính hai cấp và địa danh cũ của Bối Khê, Đống Đa trong hồ sơ khác nhau như thế nào?',
  },
  {
    category: 'Chuyển đổi bản số',
    question:
      'Chức năng Chuyển đổi bản chép tay sang bản số bằng Gemini AI và trình Đối chiếu 3 lớp hoạt động theo quy trình nào?',
  },
];

const SECTION_LABEL_MAP: Record<AppSection, string> = {
  overview: 'Trang chủ',
  comparator: 'Đối chiếu trang',
  digitize: 'Chuyển đổi bản số',
  genealogy: 'Sơ đồ phả hệ',
  dossiers: 'Danh mục 21 hồ sơ',
  dossier: 'Hồ sơ & Pháp lý',
  qa: 'Hỏi đáp',
  about: 'Giới thiệu',
};

export const ProjectQAView: React.FC<ProjectQAViewProps> = ({
  db,
  onNavigate,
  onOpenPage,
}) => {
  const [messages, setMessages] = useState<ProjectQAMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastFailedQuestion, setLastFailedQuestion] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const buildHistoryPayload = (currentMessages: ProjectQAMessage[]): ProjectQAHistoryTurn[] =>
    currentMessages.slice(-8).map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      text: m.text,
    }));

  const submitQuestion = async (rawText: string) => {
    const question = rawText.trim();
    if (!question || isLoading) return;

    setErrorMsg(null);
    setLastFailedQuestion(null);

    const userMessage: ProjectQAMessage = {
      id: `qa-u-${Date.now()}`,
      role: 'user',
      text: question,
      createdAt: new Date().toISOString(),
    };

    const historyForApi = buildHistoryPayload(messages);
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await askProjectQA({
        question,
        history: historyForApi,
      });

      const assistantMessage: ProjectQAMessage = {
        id: `qa-a-${Date.now()}`,
        role: 'assistant',
        text: result.answer,
        citedRecords: result.citedRecords,
        suggestedFollowUps: result.suggestedFollowUps,
        verificationNote: result.verificationNote,
        createdAt: result.answeredAt,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 60);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Không thể kết nối tới dịch vụ hỏi đáp Gemini AI.';
      setErrorMsg(msg);
      setLastFailedQuestion(question);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submitQuestion(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void submitQuestion(input);
    }
  };

  const handleCitationClick = (citation: ProjectQACitation) => {
    if (citation.pageNumber && citation.pageNumber >= 1 && citation.pageNumber <= 82) {
      onOpenPage(citation.pageNumber);
      return;
    }
    onNavigate(citation.section);
  };

  const handleReset = () => {
    if (isLoading) return;
    setMessages([]);
    setErrorMsg(null);
    setLastFailedQuestion(null);
    setInput('');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Header */}
      <header className="space-y-4 pb-6 border-b border-[#D6CEBE]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#57534E]">
            <span>Trợ lý tra cứu học thuật</span>
            <span aria-hidden="true">·</span>
            <span>Gemini AI</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[#1C1917]">
              Dự án {db.aboutInfo.projectCode} · Ký hiệu {db.legalInfo.callNumber}
            </span>
          </div>

          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1C1917] border border-[#D6CEBE] hover:border-[#1C1917] hover:bg-[#F3EFE6] disabled:opacity-50 transition-colors rounded-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Bắt đầu phiên hỏi mới</span>
            </button>
          )}
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#1C1917] [text-wrap:balance]">
          Hỏi đáp
        </h1>

        <p className="text-sm sm:text-base text-[#44403C] leading-relaxed max-w-3xl">
          Đặt câu hỏi bằng tiếng Việt để tra cứu nhanh cấu trúc{' '}
          <span className="tabular-nums font-medium text-[#1C1917]">{db.dossiers.length}</span> hồ
          sơ chuẩn 20 trường, phạm vi{' '}
          <span className="tabular-nums font-medium text-[#1C1917]">{db.folios.length}</span>{' '}
          trang đối chiếu <span className="font-mono text-[#1C1917]">A.1046</span>, sơ đồ phả hệ
          Nguyễn tộc Bối Khê, quy định Điều 63 Luật Lưu trữ 2024 và thông tin thực tập sinh viên.
        </p>
      </header>

      {/* Main 12-column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar: Scope & Curated Starter Questions */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="border border-[#D6CEBE] bg-[#F6F2EA] p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-[#8C2D19] font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Nguyên tắc đối chiếu dữ liệu</span>
            </div>
            <p className="text-xs text-[#44403C] leading-relaxed">
              Mọi câu trả lời được đối chiếu trực tiếp từ kho dữ liệu hiện hành của dự án{' '}
              <span className="font-mono text-[#1C1917]">{db.aboutInfo.projectCode}</span> ({db.dossiers.length} hồ sơ,{' '}
              {db.folios.length} trang, {db.characters.length} nhân vật phả hệ và {db.sources.length}{' '}
              nguồn tham khảo).
            </p>
            <p className="text-xs text-[#57534E] leading-relaxed border-t border-[#D6CEBE] pt-3">
              Trợ lý giữ nguyên nguyên tắc trung thực học thuật: không suy đoán tên húy chưa xác
              minh và luôn phân tách rõ trạng thái Phiên âm và Dịch nghĩa.
            </p>
          </div>

          <div className="border border-[#D6CEBE] bg-[#FBF9F5]">
            <div className="px-5 py-4 border-b border-[#E5DEC9] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#8C2D19] shrink-0" />
              <h2 className="font-display text-lg font-semibold text-[#1C1917]">
                Chủ đề gợi ý tra cứu
              </h2>
            </div>

            <div className="divide-y divide-[#E5DEC9]">
              {STARTER_TOPICS.map((item) => (
                <button
                  key={item.category}
                  type="button"
                  disabled={isLoading}
                  onClick={() => void submitQuestion(item.question)}
                  className="w-full text-left px-5 py-3.5 hover:bg-[#F3EFE6] disabled:opacity-50 transition-colors group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] uppercase tracking-[0.1em] text-[#8C2D19] font-semibold">
                      {item.category}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#78716C] group-hover:text-[#8C2D19] shrink-0" />
                  </div>
                  <p className="mt-1 text-xs text-[#292524] leading-relaxed group-hover:text-[#1C1917]">
                    {item.question}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Workspace: Multi-turn Conversation & Inquiry Form */}
        <section className="lg:col-span-8 flex flex-col border border-[#D6CEBE] bg-[#FBF9F5] min-h-[540px]">
          {/* Workspace Header Strip */}
          <div className="px-5 sm:px-7 py-4 border-b border-[#E5DEC9] bg-[#F6F2EA] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-[#1C1917]">
              <MessageSquare className="w-4 h-4 text-[#8C2D19]" />
              <span>Phiên hỏi đáp tư liệu {db.legalInfo.callNumber}</span>
            </div>
            <span className="font-mono text-[11px] text-[#57534E] tabular-nums">
              {messages.filter((m) => m.role === 'user').length} lượt hỏi
            </span>
          </div>

          {/* Conversation Body */}
          <div className="flex-1 p-5 sm:p-7 space-y-6">
            {messages.length === 0 ? (
              <div className="py-10 sm:py-14 max-w-xl mx-auto text-center space-y-4">
                <p className="text-xs uppercase tracking-[0.14em] text-[#8C2D19] font-semibold">
                  Sẵn sàng tra cứu
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1C1917]">
                  Đặt câu hỏi về hồ sơ, trang tư liệu hoặc phả hệ Bối Khê
                </h2>
                <p className="text-sm text-[#44403C] leading-relaxed">
                  Bạn có thể chọn một chủ đề gợi ý ở cột bên trái hoặc nhập câu hỏi cụ thể vào
                  khung bên dưới. Phản hồi sẽ kèm mã định danh hồ sơ hoặc số trang đối chiếu để bạn
                  mở xem ngay.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg) => {
                  if (msg.role === 'user') {
                    return (
                      <div key={msg.id} className="flex justify-end">
                        <div className="max-w-2xl bg-[#1C1917] text-[#FBF9F5] px-5 py-3.5 rounded-sm space-y-1">
                          <div className="text-[10px] uppercase tracking-[0.12em] text-[#D6CEBE]">
                            Câu hỏi nghiên cứu
                          </div>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <article
                      key={msg.id}
                      className="border border-[#D6CEBE] bg-[#F6F2EA]/70 p-5 sm:p-6 space-y-4"
                    >
                      <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.12em] text-[#8C2D19] font-semibold">
                        <span>Giải đáp từ dữ liệu dự án {db.aboutInfo.projectCode}</span>
                        <span className="font-mono text-[#78716C] font-normal">Gemini AI</span>
                      </div>

                      <div className="text-sm sm:text-[15px] text-[#1C1917] leading-relaxed whitespace-pre-wrap max-w-prose">
                        {msg.text}
                      </div>

                      {msg.citedRecords && msg.citedRecords.length > 0 && (
                        <div className="pt-3 border-t border-[#E5DEC9] space-y-2">
                          <div className="text-[11px] uppercase tracking-[0.1em] text-[#57534E] font-medium">
                            Hồ sơ &amp; mục liên quan
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {msg.citedRecords.map((cit, idx) => (
                              <button
                                key={`${msg.id}-cit-${idx}`}
                                type="button"
                                onClick={() => handleCitationClick(cit)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#FBF9F5] border border-[#D6CEBE] hover:border-[#8C2D19] hover:text-[#8C2D19] text-[#1C1917] transition-colors rounded-sm"
                              >
                                <span className="font-mono font-semibold text-[#8C2D19]">
                                  {cit.code}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span>
                                  {cit.label ||
                                    (cit.pageNumber
                                      ? `Trang ${String(cit.pageNumber).padStart(2, '0')}`
                                      : SECTION_LABEL_MAP[cit.section] || 'Xem chi tiết')}
                                </span>
                                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {msg.verificationNote && (
                        <p className="pt-3 border-t border-[#E5DEC9] text-xs text-[#57534E] leading-relaxed">
                          <strong className="text-[#1C1917] font-medium">Lưu ý kiểm chứng:</strong>{' '}
                          {msg.verificationNote}
                        </p>
                      )}

                      {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                        <div className="pt-3 border-t border-[#E5DEC9] space-y-2">
                          <div className="text-[11px] uppercase tracking-[0.1em] text-[#57534E] font-medium">
                            Câu hỏi tiếp theo
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {msg.suggestedFollowUps.map((q, idx) => (
                              <button
                                key={`${msg.id}-fu-${idx}`}
                                type="button"
                                disabled={isLoading}
                                onClick={() => void submitQuestion(q)}
                                className="text-left px-3 py-1.5 text-xs text-[#292524] bg-[#FBF9F5] border border-[#D6CEBE] hover:bg-[#EBE6DF] hover:border-[#1C1917] disabled:opacity-50 transition-colors rounded-sm"
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}

            {isLoading && (
              <div className="border border-[#D6CEBE] bg-[#F6F2EA] p-5 flex items-center gap-3 text-sm text-[#44403C]">
                <Loader2 className="w-4 h-4 text-[#8C2D19] animate-spin shrink-0" />
                <span>Đang đối chiếu dữ liệu dự án B02 với Gemini AI...</span>
              </div>
            )}

            {errorMsg && (
              <div
                role="alert"
                className="border border-[#8C2D19] bg-[#FBF9F5] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[#8C2D19]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
                {lastFailedQuestion && (
                  <button
                    type="button"
                    onClick={() => void submitQuestion(lastFailedQuestion)}
                    className="px-3 py-1.5 text-xs font-semibold text-[#FBF9F5] bg-[#8C2D19] hover:bg-[#1C1917] transition-colors rounded-sm shrink-0 self-start sm:self-center"
                  >
                    Thử gửi lại
                  </button>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Composer */}
          <form
            onSubmit={handleFormSubmit}
            className="border-t border-[#D6CEBE] bg-[#F6F2EA] p-4 sm:p-6 space-y-3"
          >
            <label htmlFor="project-qa-input" className="sr-only">
              Nhập câu hỏi về dự án Gia Phả Số – Cội Nguồn Việt
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
              <textarea
                id="project-qa-input"
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                maxLength={2000}
                placeholder="Ví dụ: Hồ sơ B02-00010 nói về nội dung gì và đã kiểm chứng dịch nghĩa chưa?"
                className="flex-1 resize-none bg-[#FBF9F5] border border-[#D6CEBE] focus:border-[#8C2D19] focus:outline-none px-4 py-3 text-sm text-[#1C1917] placeholder:text-[#78716C] rounded-sm disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold text-[#FBF9F5] bg-[#1C1917] hover:bg-[#8C2D19] disabled:opacity-45 disabled:hover:bg-[#1C1917] transition-colors rounded-sm whitespace-nowrap shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Gửi câu hỏi</span>
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#57534E]">
              <span className="inline-flex items-center gap-1">
                <CornerDownLeft className="w-3 h-3" />
                Nhấn Enter để gửi · Shift + Enter để xuống dòng
              </span>
              <span className="font-mono tabular-nums">{input.length}/2000</span>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};
