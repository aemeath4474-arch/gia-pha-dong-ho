import React, { useMemo, useState } from 'react';
import { ArrowRight, GitFork, Info, Search } from 'lucide-react';
import { GENEALOGY_NODES, GenealogyNode } from '../data/archiveData';

interface GenealogyViewProps {
  onOpenPage: (pageNumber: number) => void;
}

type BranchFilter = 'all' | 'truc-he' | 'chi-giap' | 'chi-at';

export const GenealogyView: React.FC<GenealogyViewProps> = ({ onOpenPage }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(GENEALOGY_NODES[0].id);
  const [branchFilter, setBranchFilter] = useState<BranchFilter>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const selectedNode: GenealogyNode =
    GENEALOGY_NODES.find((n) => n.id === selectedNodeId) || GENEALOGY_NODES[0];

  const generations = useMemo(() => {
    const groups = new Map<number, GenealogyNode[]>();
    GENEALOGY_NODES.forEach((node) => {
      const list = groups.get(node.generation) || [];
      list.push(node);
      groups.set(node.generation, list);
    });
    return Array.from(groups.entries()).sort((a, b) => a[0] - b[0]);
  }, []);

  const matchesFilter = (node: GenealogyNode) => {
    if (branchFilter !== 'all' && node.branch !== branchFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      return (
        node.name.toLowerCase().includes(q) ||
        node.generationLabel.toLowerCase().includes(q) ||
        node.branchLabel.toLowerCase().includes(q) ||
        node.roleTitle.toLowerCase().includes(q)
      );
    }
    return true;
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-4 pb-6 border-b border-[#D6CEBE]">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#57534E]">
          <span>Cấu trúc Phả hệ số</span>
          <span aria-hidden="true">·</span>
          <span>Bối Khê Nguyễn tộc gia phả thế thứ</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-[#1C1917]">A.1046</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1C1917]">
              Sơ đồ phả hệ dòng họ Nguyễn ở Bối Khê
            </h1>
            <p className="mt-2 text-sm text-[#44403C] max-w-2xl leading-relaxed">
              Khung sơ đồ trực quan hóa mối quan hệ thế thứ từ tư liệu{' '}
              <em>Bối Khê Trạng nguyên gia phả</em> và <em>Bối Khê Nguyễn tộc gia phả thế thứ</em>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm đời thứ hoặc chi phái..."
                aria-label="Tìm kiếm trong sơ đồ phả hệ"
                className="pl-9 pr-3 py-2 text-xs bg-[#FBF9F5] border border-[#D6CEBE] rounded-sm text-[#1C1917] placeholder:text-[#78716C] focus:outline-none focus:border-[#8C2D19] w-56"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1 p-1 bg-[#EBE6DF] border border-[#D6CEBE] rounded-sm">
              {(
                [
                  { id: 'all', label: 'Toàn hệ' },
                  { id: 'truc-he', label: 'Trục chính' },
                  { id: 'chi-giap', label: 'Chi Giáp' },
                  { id: 'chi-at', label: 'Chi Ất' },
                ] as { id: BranchFilter; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setBranchFilter(tab.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-sm transition-colors whitespace-nowrap ${
                    branchFilter === tab.id
                      ? 'bg-[#FBF9F5] text-[#1C1917]'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Archival Honesty Disclaimer */}
      <div className="border border-[#D6CEBE] bg-[#F3EFE6] px-5 py-4 flex items-start gap-3 text-xs sm:text-sm text-[#44403C] leading-relaxed">
        <Info className="w-4 h-4 text-[#8C2D19] shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#1C1917]">Ghi chú phương pháp:</strong> Đây là khung kiến trúc
          phả hệ chuẩn bị sẵn dựa trên cấu trúc thế thứ truyền thống. Tên húy, niên đại và chi tiết
          từng cá nhân sẽ được điền nguyên bản sau khi tiếp cận và đối chiếu 82 trang tài liệu{' '}
          <span className="font-mono text-[#1C1917]">A.1046</span> tại Thư viện Viện Nghiên cứu Hán Nôm.
        </p>
      </div>

      {/* Interactive Split Tree + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Generational Pedigree Tree */}
        <div className="lg:col-span-8 border border-[#D6CEBE] bg-[#F6F2EA] p-5 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#D6CEBE] pb-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#1C1917]">
              <GitFork className="w-4 h-4 text-[#8C2D19]" />
              <span>Cây thế thứ theo đời (Đời I – Đời V+)</span>
            </div>
            <span className="font-mono text-xs text-[#57534E] tabular-nums">
              {GENEALOGY_NODES.length} nút cấu trúc
            </span>
          </div>

          <div className="space-y-6">
            {generations.map(([genNumber, nodes], genIdx) => (
              <div key={genNumber} className="relative">
                <div className="flex flex-col sm:flex-row sm:items-stretch gap-4">
                  {/* Generation Index Column */}
                  <div className="sm:w-24 shrink-0 flex sm:flex-col justify-between sm:justify-center border-b sm:border-b-0 sm:border-r border-[#D6CEBE] pb-2 sm:pb-0 sm:pr-4">
                    <span className="font-display text-lg font-semibold text-[#8C2D19]">
                      Đời {genNumber === 5 ? 'V+' : ['I', 'II', 'III', 'IV'][genNumber - 1]}
                    </span>
                    <span className="font-mono text-[11px] text-[#57534E] tabular-nums">
                      Thế hệ 0{genNumber}
                    </span>
                  </div>

                  {/* Nodes in this Generation */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {nodes.map((node) => {
                      const isSelected = node.id === selectedNode.id;
                      const isMatched = matchesFilter(node);
                      return (
                        <button
                          key={node.id}
                          type="button"
                          onClick={() => setSelectedNodeId(node.id)}
                          className={`text-left p-4 border rounded-sm transition-all ${
                            isSelected
                              ? 'bg-[#FBF9F5] border-[#8C2D19] shadow-xs'
                              : 'bg-[#FBF9F5]/80 border-[#D6CEBE] hover:border-[#1C1917]'
                          } ${isMatched ? 'opacity-100' : 'opacity-40'}`}
                        >
                          <div className="flex items-center justify-between gap-2 text-[11px] text-[#57534E]">
                            <span className="font-medium text-[#8C2D19]">{node.branchLabel}</span>
                            <span className="font-mono tabular-nums">{node.folioRange}</span>
                          </div>
                          <h3 className="mt-1.5 font-display text-base font-semibold text-[#1C1917]">
                            {node.name}
                          </h3>
                          <p className="mt-1 text-xs text-[#57534E]">{node.hanNomName}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {genIdx < generations.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="hidden sm:block ml-12 h-4 border-l border-dashed border-[#A8A29E]"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Node Detail Panel */}
        <aside className="lg:col-span-4 border border-[#D6CEBE] bg-[#FBF9F5] p-6 space-y-6 lg:sticky lg:top-24">
          <div className="pb-4 border-b border-[#E5DEC9]">
            <div className="flex items-center gap-2 text-xs text-[#57534E]">
              <span className="font-semibold text-[#8C2D19]">{selectedNode.generationLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{selectedNode.branchLabel}</span>
            </div>
            <h2 className="mt-2 font-display text-2xl font-semibold text-[#1C1917]">
              {selectedNode.name}
            </h2>
            <p className="mt-1 text-sm text-[#57534E]">{selectedNode.hanNomName}</p>
          </div>

          <dl className="divide-y divide-[#E5DEC9] text-sm">
            <div className="py-3 flex justify-between gap-4">
              <dt className="text-[#57534E]">Vai trò trong phả hệ</dt>
              <dd className="text-right font-medium text-[#1C1917]">{selectedNode.roleTitle}</dd>
            </div>
            <div className="py-3 flex justify-between gap-4">
              <dt className="text-[#57534E]">Trang tư liệu liên kết</dt>
              <dd className="text-right font-mono text-[#1C1917] tabular-nums">
                {selectedNode.folioRange}
              </dd>
            </div>
            <div className="py-3 flex flex-col gap-1">
              <dt className="text-[#57534E]">Trạng thái xác minh</dt>
              <dd className="text-[#8C2D19] text-xs font-medium leading-relaxed">
                {selectedNode.verificationNote}
              </dd>
            </div>
          </dl>

          <p className="text-sm text-[#44403C] leading-relaxed">{selectedNode.summary}</p>

          <button
            type="button"
            onClick={() => onOpenPage(selectedNode.targetPage)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#FBF9F5] bg-[#1C1917] hover:bg-[#8C2D19] transition-colors rounded-sm"
          >
            <span>Mở trang {String(selectedNode.targetPage).padStart(2, '0')} trong trình đối chiếu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </aside>
      </div>
    </div>
  );
};
