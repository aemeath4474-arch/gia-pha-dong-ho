import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, GitFork, Info, Search, UserCheck, Users } from 'lucide-react';
import { ARCHIVE_IMAGES } from '../data/seedData';
import type { GenealogyNode } from '../types/archive';
import { ArchivalImage } from './ArchivalImage';

interface GenealogyViewProps {
  characters: GenealogyNode[];
  onOpenPage: (pageNumber: number) => void;
}

type BranchTypeFilter = 'all' | 'Nhánh chính' | 'Nhánh phụ';

export const GenealogyView: React.FC<GenealogyViewProps> = ({
  characters,
  onOpenPage,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    characters[0]?.id || 'doi-1'
  );
  const [viewMode, setViewMode] = useState<'tree' | 'detail'>('tree');
  const [branchFilter, setBranchFilter] = useState<BranchTypeFilter>('all');
  const [generationFilter, setGenerationFilter] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const selectedNode: GenealogyNode | undefined =
    characters.find((n) => n.id === selectedNodeId) || characters[0];

  const parentNode = useMemo(
    () =>
      selectedNode?.parentId
        ? characters.find((c) => c.id === selectedNode.parentId) || null
        : null,
    [characters, selectedNode]
  );

  const childNodes = useMemo(
    () =>
      selectedNode
        ? characters.filter((c) => c.parentId === selectedNode.id)
        : [],
    [characters, selectedNode]
  );

  const availableGenerations = useMemo(() => {
    const gens = Array.from(new Set(characters.map((c) => c.generation))).sort(
      (a, b) => a - b
    );
    return gens;
  }, [characters]);

  const groupedByGeneration = useMemo(() => {
    const groups = new Map<number, GenealogyNode[]>();
    characters.forEach((node) => {
      if (generationFilter !== 'all' && node.generation !== generationFilter) return;
      const list = groups.get(node.generation) || [];
      list.push(node);
      groups.set(node.generation, list);
    });
    return Array.from(groups.entries()).sort((a, b) => a[0] - b[0]);
  }, [characters, generationFilter]);

  const matchesFilter = (node: GenealogyNode) => {
    if (branchFilter !== 'all' && node.branchType !== branchFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      return (
        node.name.toLowerCase().includes(q) ||
        node.characterCode.toLowerCase().includes(q) ||
        node.tabooName.toLowerCase().includes(q) ||
        node.generationLabel.toLowerCase().includes(q) ||
        node.branchLabel.toLowerCase().includes(q) ||
        node.roleTitle.toLowerCase().includes(q)
      );
    }
    return true;
  };

  const handleSelectCharacter = (nodeId: string, openFullDetail = false) => {
    setSelectedNodeId(nodeId);
    if (openFullDetail) {
      setViewMode('detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1C1917]">
              Sơ đồ phả hệ dòng họ Nguyễn ở Bối Khê
            </h1>
            <p className="mt-2 text-sm text-[#44403C] max-w-2xl leading-relaxed">
              Thể hiện cấu trúc theo đời, phân biệt nhánh chính – nhánh phụ, quan hệ cha – con và
              liên kết trực tiếp về từng trang tư liệu tham chiếu.
            </p>
          </div>

          {viewMode === 'detail' ? (
            <button
              type="button"
              onClick={() => setViewMode('tree')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#FBF9F5] bg-[#1C1917] hover:bg-[#8C2D19] rounded-sm transition-colors self-start xl:self-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại toàn bộ sơ đồ</span>
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm tên, mã NV, tên húy..."
                  aria-label="Tìm kiếm nhân vật trong sơ đồ phả hệ"
                  className="pl-9 pr-3 py-2 text-xs bg-[#FBF9F5] border border-[#D6CEBE] rounded-sm text-[#1C1917] placeholder:text-[#78716C] focus:outline-none focus:border-[#8C2D19] w-56"
                />
              </div>

              <select
                aria-label="Lọc theo đời thứ"
                value={generationFilter}
                onChange={(e) =>
                  setGenerationFilter(
                    e.target.value === 'all' ? 'all' : Number(e.target.value)
                  )
                }
                className="px-3 py-2 text-xs bg-[#FBF9F5] border border-[#D6CEBE] rounded-sm text-[#1C1917] focus:outline-none focus:border-[#8C2D19]"
              >
                <option value="all">Tất cả các đời</option>
                {availableGenerations.map((g) => (
                  <option key={g} value={g}>
                    Đời {g === 5 ? 'V+' : g}
                  </option>
                ))}
              </select>

              <div className="flex flex-wrap items-center gap-1 p-1 bg-[#EBE6DF] border border-[#D6CEBE] rounded-sm">
                {(
                  [
                    { id: 'all', label: 'Tất cả nhánh' },
                    { id: 'Nhánh chính', label: 'Nhánh chính' },
                    { id: 'Nhánh phụ', label: 'Nhánh phụ' },
                  ] as { id: BranchTypeFilter; label: string }[]
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
          )}
        </div>
      </div>

      {/* Archival Honesty Disclaimer */}
      <div className="border border-[#D6CEBE] bg-[#F3EFE6] px-5 py-4 flex items-start gap-3 text-xs sm:text-sm text-[#44403C] leading-relaxed">
        <Info className="w-4 h-4 text-[#8C2D19] shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#1C1917]">Nguyên tắc xác thực:</strong> Không tự tạo tên nhân
          vật, niên đại, quan hệ huyết thống hay chân dung giả. Những hình ảnh dưới đây là{' '}
          <em>Ảnh sơ đồ / Ảnh minh họa cấu trúc</em> tách bạch hoàn toàn với bản gốc{' '}
          <span className="font-mono text-[#1C1917]">A.1046</span>.
        </p>
      </div>

      {/* Archival Visual Illustrations Strip for Genealogy & Thế Thứ */}
      {viewMode === 'tree' && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <figure className="border border-[#D6CEBE] bg-[#FBF9F5]">
            <div className="aspect-[4/3] overflow-hidden bg-[#EBE6DF]">
              <ArchivalImage
                src={ARCHIVE_IMAGES.genealogyDiagram}
                alt="Hình ảnh sơ đồ thế thứ cổ vẽ tay trên giấy dó nối các đời dòng họ"
                imgClassName="w-full h-full object-cover"
              />
            </div>
            <figcaption className="p-4 space-y-1">
              <p className="text-[11px] uppercase tracking-wider text-[#8C2D19] font-semibold">
                Ảnh sơ đồ · Minh họa cấu trúc các đời
              </p>
              <p className="text-xs text-[#44403C]">
                Hình thức biểu đồ thế thứ truyền thống phân tầng Đời I đến Đời V+.
              </p>
            </figcaption>
          </figure>

          <figure className="border border-[#D6CEBE] bg-[#FBF9F5]">
            <div className="aspect-[4/3] overflow-hidden bg-[#EBE6DF]">
              <ArchivalImage
                src={ARCHIVE_IMAGES.specimenPlate}
                alt="Hình ảnh minh họa trang giấy bản Hán Nôm ghi chép mục Nguyễn tộc phả"
                imgClassName="w-full h-full object-cover"
              />
            </div>
            <figcaption className="p-4 space-y-1">
              <p className="text-[11px] uppercase tracking-wider text-[#8C2D19] font-semibold">
                Ảnh minh họa · Tư liệu Hán Nôm về thế thứ
              </p>
              <p className="text-xs text-[#44403C]">
                Minh họa cách ghi chép chữ Hán Nôm phần <em>Bối Khê Nguyễn tộc gia phả thế thứ</em>.
              </p>
            </figcaption>
          </figure>

          <figure className="border border-[#D6CEBE] bg-[#FBF9F5]">
            <div className="aspect-[4/3] overflow-hidden bg-[#EBE6DF]">
              <ArchivalImage
                src={ARCHIVE_IMAGES.boikheCourtyard}
                alt="Hình ảnh minh họa không gian di sản từ đường cổ gắn với truyền thống gia phả dòng họ"
                imgClassName="w-full h-full object-cover"
              />
            </div>
            <figcaption className="p-4 space-y-1">
              <p className="text-[11px] uppercase tracking-wider text-[#8C2D19] font-semibold">
                Ảnh minh họa · Không gian gia phả dòng họ
              </p>
              <p className="text-xs text-[#44403C]">
                Bối cảnh từ đường truyền thống nơi lưu giữ ký ức và gia phả dòng họ.
              </p>
            </figcaption>
          </figure>
        </section>
      )}

      {/* Mode 1: Full Generational Tree + Side Inspector */}
      {viewMode === 'tree' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Generational Pedigree Tree */}
          <div className="lg:col-span-8 border border-[#D6CEBE] bg-[#F6F2EA] p-5 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D6CEBE] pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#1C1917]">
                <GitFork className="w-4 h-4 text-[#8C2D19]" />
                <span>Sơ đồ thế thứ theo đời &amp; quan hệ cha – con</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-[#57534E]">
                <span>Nhánh chính: viền liền</span>
                <span aria-hidden="true">·</span>
                <span>Nhánh phụ: viền nét đứt</span>
              </div>
            </div>

            {groupedByGeneration.length === 0 ? (
              <div className="py-12 text-center text-sm text-[#57534E]">
                Không có dữ liệu thế hệ phù hợp với bộ lọc hiện tại.
              </div>
            ) : (
              <div className="space-y-6">
                {groupedByGeneration.map(([genNumber, nodes], genIdx) => (
                  <div key={genNumber} className="relative">
                    <div className="flex flex-col sm:flex-row sm:items-stretch gap-4">
                      {/* Generation Index Column */}
                      <div className="sm:w-24 shrink-0 flex sm:flex-col justify-between sm:justify-center border-b sm:border-b-0 sm:border-r border-[#D6CEBE] pb-2 sm:pb-0 sm:pr-4">
                        <span className="font-display text-lg font-semibold text-[#8C2D19]">
                          Đời{' '}
                          {genNumber === 5
                            ? 'V+'
                            : ['I', 'II', 'III', 'IV'][genNumber - 1] || genNumber}
                        </span>
                        <span className="font-mono text-[11px] text-[#57534E] tabular-nums">
                          Thế hệ {String(genNumber).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Nodes in this Generation */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {nodes.map((node) => {
                          const isSelected = node.id === selectedNode?.id;
                          const isMatched = matchesFilter(node);
                          const parent = node.parentId
                            ? characters.find((c) => c.id === node.parentId)
                            : null;
                          const isMainBranch = node.branchType === 'Nhánh chính';

                          return (
                            <button
                              key={node.id}
                              type="button"
                              onClick={() => handleSelectCharacter(node.id, false)}
                              className={`text-left p-4 border rounded-sm transition-all ${
                                isMainBranch ? 'border-solid' : 'border-dashed'
                              } ${
                                isSelected
                                  ? 'bg-[#FBF9F5] border-[#8C2D19] shadow-xs'
                                  : 'bg-[#FBF9F5]/85 border-[#C7BFA9] hover:border-[#1C1917]'
                              } ${isMatched ? 'opacity-100' : 'opacity-35'}`}
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#57534E]">
                                <span className="font-mono font-semibold text-[#8C2D19]">
                                  {node.characterCode}
                                </span>
                                <span>
                                  {node.branchType} · {node.verificationStatus}
                                </span>
                              </div>
                              <h3 className="mt-1.5 font-display text-base font-semibold text-[#1C1917]">
                                {node.name}
                              </h3>
                              <p className="mt-1 text-xs text-[#57534E]">
                                Tên húy: {node.tabooName}
                              </p>
                              <div className="mt-2 pt-2 border-t border-[#E5DEC9] text-[11px] text-[#44403C] flex items-center justify-between gap-2">
                                <span className="truncate">
                                  {parent ? `Cha: ${parent.characterCode}` : 'Thủy tổ gốc'}
                                </span>
                                <span className="font-mono shrink-0 tabular-nums">
                                  {node.folioRange}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {genIdx < groupedByGeneration.length - 1 && (
                      <div
                        aria-hidden="true"
                        className="hidden sm:block ml-12 h-5 border-l border-dashed border-[#A8A29E]"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Character Detail Summary Panel */}
          {selectedNode && (
            <aside className="lg:col-span-4 border border-[#D6CEBE] bg-[#FBF9F5] p-6 space-y-5 lg:sticky lg:top-24">
              <div className="pb-4 border-b border-[#E5DEC9]">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#57534E]">
                  <span className="font-mono font-semibold text-[#8C2D19]">
                    {selectedNode.characterCode}
                  </span>
                  <span>
                    {selectedNode.generationLabel} · {selectedNode.branchType}
                  </span>
                </div>
                <h2 className="mt-2 font-display text-2xl font-semibold text-[#1C1917]">
                  {selectedNode.name}
                </h2>
                <p className="mt-1 text-xs text-[#57534E]">
                  Trạng thái:{' '}
                  <strong className="text-[#8C2D19]">{selectedNode.verificationStatus}</strong>
                </p>
              </div>

              {/* Verified Portrait Slot (strictly shown only if verified & permitted) */}
              <CharacterPortraitBox node={selectedNode} />

              <dl className="divide-y divide-[#E5DEC9] text-xs sm:text-sm">
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-[#57534E]">Tên húy</dt>
                  <dd className="text-right font-medium text-[#1C1917]">{selectedNode.tabooName}</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-[#57534E]">Đời thứ / Nhánh</dt>
                  <dd className="text-right text-[#1C1917]">
                    {selectedNode.generationLabel} ({selectedNode.branchLabel})
                  </dd>
                </div>
                <div className="py-2.5 flex flex-col gap-1">
                  <dt className="text-[#57534E]">Quan hệ gia đình</dt>
                  <dd className="text-[#1C1917] leading-relaxed">{selectedNode.familyRelation}</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-[#57534E]">Trang tư liệu</dt>
                  <dd className="text-right font-mono text-[#1C1917] tabular-nums">
                    {selectedNode.folioRange}
                  </dd>
                </div>
                <div className="py-2.5 flex flex-col gap-1">
                  <dt className="text-[#57534E]">Nguồn thông tin</dt>
                  <dd className="text-[#44403C] text-xs leading-relaxed">{selectedNode.sourceRef}</dd>
                </div>
              </dl>

              {/* Parent / Children Quick Navigation */}
              <div className="space-y-2 pt-1">
                {parentNode && (
                  <button
                    type="button"
                    onClick={() => handleSelectCharacter(parentNode.id, false)}
                    className="w-full text-left px-3 py-2 text-xs border border-[#E5DEC9] bg-[#F6F2EA] hover:border-[#8C2D19] rounded-sm transition-colors"
                  >
                    Đời trên (Cha): <strong>{parentNode.name}</strong> ({parentNode.characterCode})
                  </button>
                )}
                {childNodes.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] uppercase tracking-wider text-[#57534E]">
                      Hậu duệ trực tiếp ({childNodes.length})
                    </p>
                    {childNodes.map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => handleSelectCharacter(child.id, false)}
                        className="w-full text-left px-3 py-2 text-xs border border-[#E5DEC9] bg-[#FBF9F5] hover:border-[#8C2D19] rounded-sm transition-colors"
                      >
                        Đời dưới (Con): <strong>{child.name}</strong> ({child.characterCode})
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => setViewMode('detail')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#1C1917] border border-[#1C1917] hover:bg-[#F3EFE6] transition-colors rounded-sm"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Xem hồ sơ nhân vật đầy đủ</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenPage(selectedNode.targetPage)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#FBF9F5] bg-[#1C1917] hover:bg-[#8C2D19] transition-colors rounded-sm"
                >
                  <span>
                    Mở trang {String(selectedNode.targetPage).padStart(2, '0')} trong Đối chiếu trang
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </aside>
          )}
        </div>
      )}

      {/* Mode 2: Focused Full Character Detail View with "Quay lại toàn bộ sơ đồ" */}
      {viewMode === 'detail' && selectedNode && (
        <section className="border border-[#D6CEBE] bg-[#FBF9F5] p-6 sm:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D6CEBE]">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E]">
                <span className="font-mono font-semibold text-[#8C2D19]">
                  {selectedNode.characterCode}
                </span>
                <span aria-hidden="true">·</span>
                <span>{selectedNode.generationLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedNode.branchLabel}</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-[#8C2D19]">
                  {selectedNode.verificationStatus}
                </span>
              </div>
              <h2 className="mt-2 font-display text-3xl font-semibold text-[#1C1917]">
                {selectedNode.name}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setViewMode('tree')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#1C1917] border border-[#D6CEBE] hover:border-[#1C1917] hover:bg-[#F3EFE6] rounded-sm transition-colors self-start"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại toàn bộ sơ đồ</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <dl className="divide-y divide-[#E5DEC9] border-y border-[#E5DEC9] text-sm">
                <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <dt className="text-[#57534E]">Mã nhân vật</dt>
                  <dd className="sm:col-span-2 font-mono font-semibold text-[#1C1917]">
                    {selectedNode.characterCode}
                  </dd>
                </div>
                <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <dt className="text-[#57534E]">Họ tên</dt>
                  <dd className="sm:col-span-2 font-semibold text-[#1C1917]">{selectedNode.name}</dd>
                </div>
                <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <dt className="text-[#57534E]">Tên húy (nếu có)</dt>
                  <dd className="sm:col-span-2 text-[#1C1917]">{selectedNode.tabooName}</dd>
                </div>
                <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <dt className="text-[#57534E]">Đời thứ</dt>
                  <dd className="sm:col-span-2 text-[#1C1917]">
                    {selectedNode.generationLabel} — {selectedNode.branchType} ({selectedNode.branchLabel})
                  </dd>
                </div>
                <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <dt className="text-[#57534E]">Quan hệ gia đình</dt>
                  <dd className="sm:col-span-2 text-[#1C1917] leading-relaxed">
                    {selectedNode.familyRelation}
                  </dd>
                </div>
                <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <dt className="text-[#57534E]">Trang tư liệu tham chiếu</dt>
                  <dd className="sm:col-span-2 flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[#1C1917]">{selectedNode.folioRange}</span>
                    <button
                      type="button"
                      onClick={() => onOpenPage(selectedNode.targetPage)}
                      className="text-xs font-semibold text-[#8C2D19] underline underline-offset-4 hover:text-[#1C1917]"
                    >
                      Mở trang {String(selectedNode.targetPage).padStart(2, '0')} để đối chiếu
                    </button>
                  </dd>
                </div>
                <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <dt className="text-[#57534E]">Nguồn thông tin</dt>
                  <dd className="sm:col-span-2 text-[#44403C]">{selectedNode.sourceRef}</dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-5 space-y-5">
              <CharacterPortraitBox node={selectedNode} />

              <div className="border border-[#D6CEBE] bg-[#F6F2EA] p-5 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8C2D19]">
                  Ghi chú xác minh &amp; Nội dung
                </p>
                <p className="text-sm text-[#1C1917] leading-relaxed">{selectedNode.summary}</p>
                <p className="text-xs text-[#57534E] pt-2 border-t border-[#D6CEBE]">
                  {selectedNode.verificationNote}
                </p>
              </div>

              <div className="border border-[#D6CEBE] bg-[#FBF9F5] p-5 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#57534E]">
                  Liên kết trực hệ Cha – Con
                </p>
                {parentNode ? (
                  <button
                    type="button"
                    onClick={() => handleSelectCharacter(parentNode.id, true)}
                    className="w-full text-left px-3 py-2 text-xs border border-[#D6CEBE] hover:border-[#8C2D19] rounded-sm"
                  >
                    Cha: <strong>{parentNode.name}</strong> ({parentNode.characterCode})
                  </button>
                ) : (
                  <p className="text-xs text-[#57534E]">Không có đời trên (nút Thủy tổ).</p>
                )}

                {childNodes.length > 0 ? (
                  <div className="space-y-2">
                    {childNodes.map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => handleSelectCharacter(child.id, true)}
                        className="w-full text-left px-3 py-2 text-xs border border-[#D6CEBE] hover:border-[#8C2D19] rounded-sm"
                      >
                        Con: <strong>{child.name}</strong> ({child.characterCode})
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#57534E]">Chưa ghi nhận đời dưới trực tiếp.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

const CharacterPortraitBox: React.FC<{ node: GenealogyNode }> = ({ node }) => {
  if (node.portraitVerified && node.portraitUrl) {
    return (
      <figure className="border border-[#D6CEBE] bg-[#F6F2EA] p-3 flex items-start gap-4">
        <div className="w-20 h-24 shrink-0 overflow-hidden border border-[#D6CEBE] bg-[#EBE6DF]">
          <ArchivalImage
            src={node.portraitUrl}
            alt={node.portraitCaption || `Chân dung xác minh của ${node.name}`}
            imgClassName="w-full h-full object-cover"
          />
        </div>
        <figcaption className="text-xs space-y-1">
          <div className="inline-flex items-center gap-1 text-[#14532D] font-semibold">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Chân dung đã xác minh nguồn tư liệu</span>
          </div>
          <p className="text-[#1C1917]">{node.portraitCaption || node.name}</p>
          {node.portraitSource && <p className="text-[#57534E]">Nguồn: {node.portraitSource}</p>}
        </figcaption>
      </figure>
    );
  }

  return (
    <div className="border border-dashed border-[#C7BFA9] bg-[#F6F2EA] p-3.5 text-xs text-[#57534E] leading-relaxed">
      <strong className="text-[#1C1917]">Chân dung nhân vật:</strong> Chưa có chân dung xác minh từ
      nguồn tư liệu được phép sử dụng (không tự tạo chân dung giả cho nhân vật lịch sử).
    </div>
  );
};
