export type AppSection = 'overview' | 'comparator' | 'genealogy' | 'dossier' | 'about';

export interface ReferenceSource {
  id: number;
  title: string;
  institution: string;
  url: string;
}

export interface ManuscriptColumnLine {
  id: string;
  columnIndex: number;
  /** Percentage from right (traditional Han Nom vertical columns read right-to-left) */
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  hanNom: string;
  phienAm: string;
  dichNghia: string;
  ghiChu: string;
}

export interface FolioRecord {
  pageNumber: number;
  folioCode: string;
  sectionPart: 'phan-1' | 'phan-2';
  sectionLabel: string;
  title: string;
  summary: string;
  status: 'prototype' | 'planned';
  statusLabel: string;
  imageUrl?: string;
  columns?: ManuscriptColumnLine[];
}

export interface GenealogyNode {
  id: string;
  generation: number;
  generationLabel: string;
  name: string;
  hanNomName: string;
  roleTitle: string;
  branch: 'truc-he' | 'chi-giap' | 'chi-at';
  branchLabel: string;
  parentId: string | null;
  folioRange: string;
  targetPage: number;
  verificationNote: string;
  summary: string;
}

export const ATTRIBUTION_VERBATIM =
  'Sản phẩm thực tập của Nguyễn Văn An, mã sinh viên PH70154, mã dự án B02, nhóm 1 đợt 15, Chương trình Thực tập sinh Đợt 15 FPT Polytechnic và IMTA TECH, dự án xã hội phi lợi nhuận.';

export const PROJECT_METADATA = {
  appName: 'Gia Phả Số – Cội Nguồn Việt',
  callNumber: 'A.1046',
  documentTitle: 'Bối Khê Trạng nguyên gia phả',
  secondaryTitle: 'Bối Khê Nguyễn tộc gia phả thế thứ',
  lineageOrigin: 'Dòng họ Nguyễn ở Bối Khê',
  unitCount: '01 đơn vị tư liệu',
  estimatedPages: 82,
  repository: {
    name: 'Thư viện Viện Nghiên cứu Hán Nôm',
    address: '183 Đặng Tiến Đông, phường Trung Liệt, quận Đống Đa, Hà Nội',
    addressNote: 'Địa chỉ cần xác nhận lại với đơn vị lưu giữ trước khi liên hệ.',
    provenanceNote:
      'Tư liệu được dẫn trong các tài liệu nghiên cứu và danh mục thư viện. Theo thông tin tham khảo, bản A.1046 là bản sao lại từ một tài liệu gia phả trước đó. Cần liên hệ đơn vị lưu giữ để xác nhận tình trạng tư liệu và khả năng tiếp cận bản gốc hoặc bản sao.',
  },
  publicRights: {
    status: 'Đang tìm hiểu — Chưa xác nhận quyền công khai',
    summary:
      'Hiện tại, quyền tiếp cận, sao chụp và công khai tư liệu vẫn đang trong quá trình tìm hiểu, chưa được xác nhận.',
    steps: [
      {
        step: '01',
        title: 'Liên hệ xác nhận lưu giữ',
        detail:
          'Dự kiến liên hệ Thư viện Viện Nghiên cứu Hán Nôm để xác nhận lại địa chỉ, nguồn gốc, tình trạng bảo quản và điều kiện tiếp cận tài liệu Bối Khê Trạng nguyên gia phả (ký hiệu A.1046).',
        state: 'Đang chuẩn bị hồ sơ',
      },
      {
        step: '02',
        title: 'Xin phép sao chụp và phiên chép',
        detail:
          'Xin ý kiến và sự cho phép của đơn vị có thẩm quyền về việc sao chụp ảnh trang tư liệu, phiên chép văn bản số và sử dụng hình ảnh tư liệu.',
        state: 'Chờ tiếp cận đơn vị lưu giữ',
      },
      {
        step: '03',
        title: 'Xác nhận phạm vi thực tế (~82 trang)',
        detail:
          'Đối chiếu số lượng tờ/trang thực tế của bản A.1046 (ước tính khoảng 82 trang theo danh mục tham khảo) và lập danh mục biên mục chi tiết.',
        state: 'Dự kiến sau khi tiếp cận',
      },
      {
        step: '04',
        title: 'Công khai phục vụ học tập & nghiên cứu',
        detail:
          'Chỉ công khai hình ảnh trang gốc và văn bản phiên chép đầy đủ trên website sau khi có chấp thuận chính thức bằng văn bản từ đơn vị có thẩm quyền.',
        state: 'Tuân thủ bản quyền lưu trữ',
      },
    ],
  },
  studentInfo: {
    studentName: 'Nguyễn Văn An',
    studentId: 'PH70154',
    projectCode: 'B02',
    team: 'Nhóm 1 – Đợt 15',
    program: 'Chương trình Thực tập sinh Đợt 15 FPT Polytechnic và IMTA TECH',
    nature: 'Dự án xã hội phi lợi nhuận',
  },
};

export const REFERENCE_SOURCES: ReferenceSource[] = [
  {
    id: 1,
    institution: 'Viện Nghiên cứu Hán Nôm',
    title: 'Danh mục tư liệu Bối Khê Trạng nguyên gia phả, ký hiệu A.1046',
    url: 'https://hannom.vass.gov.vn/ky-hieu',
  },
  {
    id: 2,
    institution: 'Viện Hàn lâm Khoa học xã hội Việt Nam / Viện Nghiên cứu Hán Nôm',
    title: 'Nghiên cứu, số hóa và biên mục chi tiết tài liệu gia phả',
    url: 'https://vass.gov.vn/hoat-dong-cac-don-vi-truc-thuoc/vien-nghien-cuu-han-nom-to-chuc-danh-gia-nhiem-vu-nghien-cuu-so-hoa-bien-muc-chi-tiet-tai-lieu-gia--581196',
  },
  {
    id: 3,
    institution: 'Trung tâm Lưu trữ quốc gia',
    title: 'Nguồn sử liệu gia phả',
    url: 'https://www.archives.org.vn/gioi-thieu-tai-lieu-nghiep-vu/nguon-su-lieu-gia-pha.htm',
  },
  {
    id: 4,
    institution: 'Thư viện Quốc gia Việt Nam',
    title: 'Thư viện số Hán Nôm',
    url: 'http://hannom.nlv.gov.vn',
  },
  {
    id: 5,
    institution: 'Hội Bảo tồn Di sản chữ Nôm',
    title: 'Thư viện số Hán Nôm (Digital Library of Han-Nom)',
    url: 'https://www.nomfoundation.org/nom-project/Digital-Library-of-Han-Nom?uiLang=vn',
  },
  {
    id: 6,
    institution: 'Thư viện Khoa học Tổng hợp TP.HCM',
    title: 'Dịch thuật tài liệu Hán Nôm',
    url: 'https://www.thuvientphcm.gov.vn/Dich-thuat-tai-lieu-Han-Nom2',
  },
  {
    id: 7,
    institution: 'Trường Đại học Khoa học – Đại học Thái Nguyên',
    title: 'Giải pháp phát huy giá trị vốn tài liệu Hán Nôm tại các thư viện Việt Nam',
    url: 'https://khcb.tnus.edu.vn/chi-tiet/4456-Giai-phap-phat-huy-gia-tri-von-tai-lieu-han-nom-tai-cac-thu-vien-Viet-Nam',
  },
];

export const ARCHIVE_IMAGES = {
  heroManuscript: '/src/assets/images/hero_boikhe_archive_1794582120410.jpg',
  specimenPlate: '/src/assets/images/specimen_folio_plate_1794582120262.jpg',
  readingRoom: '/src/assets/images/institution_han_nom_1794582121239.jpg',
};

const PROTOTYPE_COLUMNS_COVER: ManuscriptColumnLine[] = [
  {
    id: 'col-1',
    columnIndex: 1,
    xPercent: 79,
    yPercent: 21,
    widthPercent: 10,
    heightPercent: 26,
    hanNom: '貝溪狀元家譜 (Mẫu minh họa cột đề mục)',
    phienAm: 'Bối Khê Trạng nguyên gia phả',
    dichNghia: 'Gia phả Trạng nguyên dòng họ Nguyễn ở Bối Khê — Phần mở đầu văn bản.',
    ghiChu: 'Cột tiêu đề nằm ở mép phải tờ giấy bản, đọc theo chiều dọc từ trên xuống dưới, từ phải sang trái.',
  },
  {
    id: 'col-2',
    columnIndex: 2,
    xPercent: 69,
    yPercent: 21,
    widthPercent: 9,
    heightPercent: 62,
    hanNom: '阮族譜 · 世系源流考記 (Cấu trúc ghi chép thế hệ)',
    phienAm: 'Nguyễn tộc phả · Thế hệ nguyên lưu khảo ký',
    dichNghia: 'Khảo cứu nguồn gốc và trình tự các đời dòng họ Nguyễn tại hương Bối Khê.',
    ghiChu: 'Nội dung bản gốc A.1046 sẽ được phiên chép nguyên văn sau khi Viện Nghiên cứu Hán Nôm cấp phép.',
  },
  {
    id: 'col-3',
    columnIndex: 3,
    xPercent: 59,
    yPercent: 21,
    widthPercent: 9,
    heightPercent: 62,
    hanNom: '原抄本傳錄 · 藏於漢喃研究院 (Ghi chú truyền bản)',
    phienAm: 'Nguyên sao bản truyền lục · Tàng ư Hán Nôm nghiên cứu viện',
    dichNghia: 'Bản sao truyền lại từ gia phả trước đó, được dẫn lưu giữ tại Thư viện Viện Nghiên cứu Hán Nôm (ký hiệu A.1046).',
    ghiChu: 'Đối chiếu tính chất bản sao (A.1046) với danh mục thư viện.',
  },
  {
    id: 'col-4',
    columnIndex: 4,
    xPercent: 49,
    yPercent: 21,
    widthPercent: 9,
    heightPercent: 62,
    hanNom: '顯祖考諱字及忌日謹錄 (Quy cách ghi húy nhật)',
    phienAm: 'Hiển tổ khảo húy tự cập kỵ nhật cẩn lục',
    dichNghia: 'Kính cẩn ghi chép tên húy, tước hiệu, năm sinh năm mất và ngày giỗ của tiên tổ.',
    ghiChu: 'Dữ liệu tên húy và ngày kỵ nhật là cơ sở trích xuất nút dữ liệu cho sơ đồ phả hệ.',
  },
];

const PROTOTYPE_COLUMNS_LINEAGE: ManuscriptColumnLine[] = [
  {
    id: 'lin-1',
    columnIndex: 1,
    xPercent: 79,
    yPercent: 21,
    widthPercent: 10,
    heightPercent: 32,
    hanNom: '貝溪阮族家譜世次 (Đề mục Thế thứ)',
    phienAm: 'Bối Khê Nguyễn tộc gia phả thế thứ',
    dichNghia: 'Bảng kê thế thứ dòng họ Nguyễn ở Bối Khê theo từng đời.',
    ghiChu: 'Tiêu đề phần Thế thứ (dự kiến thuộc nửa sau tập tư liệu A.1046).',
  },
  {
    id: 'lin-2',
    columnIndex: 2,
    xPercent: 69,
    yPercent: 21,
    widthPercent: 9,
    heightPercent: 62,
    hanNom: '第一世 · 始祖考諱 [Đang chờ phiên chép từ A.1046]',
    phienAm: 'Đệ nhất thế · Thủy tổ khảo húy [Chờ xác nhận bản gốc]',
    dichNghia: 'Đời thứ nhất — Thủy tổ dòng họ Nguyễn Bối Khê (thông tin chi tiết sẽ điền sau khi tiếp cận bản A.1046).',
    ghiChu: 'Khớp nối trực tiếp với nút Đời I trong Sơ đồ phả hệ.',
  },
  {
    id: 'lin-3',
    columnIndex: 3,
    xPercent: 59,
    yPercent: 21,
    widthPercent: 9,
    heightPercent: 62,
    hanNom: '第二世 · 嗣孫承繼分枝 (Phân chi đời thứ hai)',
    phienAm: 'Đệ nhị thế · Tự tôn thừa kế phân chi',
    dichNghia: 'Đời thứ hai — Ghi chép các nhánh kế thừa và vị trí phần mộ, kỵ nhật.',
    ghiChu: 'Dùng để dựng quan hệ cha–con và phân nhánh trên cây phả hệ.',
  },
  {
    id: 'lin-4',
    columnIndex: 4,
    xPercent: 49,
    yPercent: 21,
    widthPercent: 9,
    heightPercent: 62,
    hanNom: '配室氏族及生卒年月 (Phối ngẫu và niên đại)',
    phienAm: 'Phối thất thị tộc cập sinh tốt niên nguyệt',
    dichNghia: 'Ghi chép chính thất, á thất cùng niên hiệu sinh mất để xác định khung thời gian lịch sử.',
    ghiChu: 'Cần đối chiếu cẩn trọng chữ Hán Nôm viết thảo và chữ húy thời Lê – Nguyễn.',
  },
];

function getPlannedPageTitle(page: number): {
  part: 'phan-1' | 'phan-2';
  partLabel: string;
  title: string;
  summary: string;
} {
  if (page === 1) {
    return {
      part: 'phan-1',
      partLabel: 'Phần I · Bối Khê Trạng nguyên gia phả',
      title: 'Tờ bìa & Đề từ mở đầu (Ký hiệu A.1046)',
      summary:
        'Trang mẫu minh họa giao diện đối chiếu giữa ảnh tờ giấy bản và cột văn bản phiên chép Hán Nôm – Quốc ngữ.',
    };
  }
  if (page === 2) {
    return {
      part: 'phan-1',
      partLabel: 'Phần I · Bối Khê Trạng nguyên gia phả',
      title: 'Phả tự & Duyên khởi soạn chép bản sao A.1046',
      summary:
        'Trang mẫu minh họa cách tách cột dọc Hán Nôm, phiên âm Hán-Việt và ghi chú khảo dị nguồn gốc bản sao.',
    };
  }
  if (page >= 3 && page <= 42) {
    return {
      part: 'phan-1',
      partLabel: 'Phần I · Bối Khê Trạng nguyên gia phả',
      title: `Văn bản gia phả & Hành trạng tiên tổ — Tờ số ${String(page).padStart(2, '0')}`,
      summary:
        'Vị trí dự kiến số hóa ảnh chụp trang tư liệu, phiên chép văn bản số và liên kết đối chiếu song song.',
    };
  }
  if (page === 43) {
    return {
      part: 'phan-2',
      partLabel: 'Phần II · Bối Khê Nguyễn tộc gia phả thế thứ',
      title: 'Mở đầu phần Thế thứ dòng họ Nguyễn Bối Khê',
      summary:
        'Trang mẫu minh họa quy cách ghi chép Thế thứ (Đệ nhất thế, Đệ nhị thế, phối thất và kỵ nhật) phục vụ dựng sơ đồ phả hệ.',
    };
  }
  return {
    part: 'phan-2',
    partLabel: 'Phần II · Bối Khê Nguyễn tộc gia phả thế thứ',
    title: `Bảng kê Thế thứ & Chi phái — Tờ số ${String(page).padStart(2, '0')}`,
    summary:
      'Vị trí dự kiến trích xuất dữ liệu tên húy, đời thứ, quan hệ huyết thống để cập nhật vào Sơ đồ phả hệ.',
  };
}

export const FOLIO_CATALOG: FolioRecord[] = Array.from({ length: 82 }, (_, idx) => {
  const pageNumber = idx + 1;
  const meta = getPlannedPageTitle(pageNumber);
  const isPrototype = pageNumber === 1 || pageNumber === 2 || pageNumber === 43;

  return {
    pageNumber,
    folioCode: `A.1046-T${String(pageNumber).padStart(2, '0')}`,
    sectionPart: meta.part,
    sectionLabel: meta.partLabel,
    title: meta.title,
    summary: meta.summary,
    status: isPrototype ? 'prototype' : 'planned',
    statusLabel: isPrototype
      ? 'Giao diện đối chiếu mẫu (chờ ảnh gốc A.1046)'
      : 'Dự kiến số hóa (chờ cấp phép tiếp cận)',
    imageUrl: isPrototype ? ARCHIVE_IMAGES.specimenPlate : undefined,
    columns:
      pageNumber === 1 || pageNumber === 2
        ? PROTOTYPE_COLUMNS_COVER
        : pageNumber === 43
          ? PROTOTYPE_COLUMNS_LINEAGE
          : undefined,
  };
});

export const GENEALOGY_NODES: GenealogyNode[] = [
  {
    id: 'doi-1',
    generation: 1,
    generationLabel: 'Đời I',
    name: 'Thủy tổ dòng họ Nguyễn Bối Khê',
    hanNomName: '始祖考 (Đợi xác minh húy tự)',
    roleTitle: 'Vị trí gốc thế thứ trong A.1046',
    branch: 'truc-he',
    branchLabel: 'Trục chính hệ',
    parentId: null,
    folioRange: 'Trang 43–46',
    targetPage: 43,
    verificationNote: 'Chờ đối chiếu trực tiếp từ văn bản A.1046 sau khi được cấp phép.',
    summary:
      'Nút gốc hệ thống hóa thông tin Thủy tổ theo mục "Bối Khê Nguyễn tộc gia phả thế thứ", làm điểm khởi đầu cho toàn bộ cây phả hệ số.',
  },
  {
    id: 'doi-2',
    generation: 2,
    generationLabel: 'Đời II',
    name: 'Tổ đời thứ hai (Chính hệ)',
    hanNomName: '第二世祖考',
    roleTitle: 'Thế thứ nối truyền hương Bối Khê',
    branch: 'truc-he',
    branchLabel: 'Trục chính hệ',
    parentId: 'doi-1',
    folioRange: 'Trang 47–51',
    targetPage: 47,
    verificationNote: 'Tên húy, phối thất và kỵ nhật sẽ cập nhật nguyên văn từ A.1046.',
    summary:
      'Ghi nhận thế hệ kế thừa trực hệ, xác lập nền tảng phân chia các chi phái đời sau trong gia phả họ Nguyễn ở Bối Khê.',
  },
  {
    id: 'doi-3-a',
    generation: 3,
    generationLabel: 'Đời III',
    name: 'Chi Giáp — Nhánh khoa bảng Bối Khê',
    hanNomName: '甲支 · 科榜世家',
    roleTitle: 'Liên hệ phần Bối Khê Trạng nguyên gia phả',
    branch: 'chi-giap',
    branchLabel: 'Chi Giáp',
    parentId: 'doi-2',
    folioRange: 'Trang 10–28 & 52–58',
    targetPage: 1,
    verificationNote: 'Trọng tâm đối chiếu giữa phần Trạng nguyên gia phả và phần Thế thứ.',
    summary:
      'Nhánh tư liệu trọng tâm phản ánh truyền thống hiếu học, khoa bảng và hành trạng nhân vật tiêu biểu được chép trong A.1046.',
  },
  {
    id: 'doi-3-b',
    generation: 3,
    generationLabel: 'Đời III',
    name: 'Chi Ất — Nhánh cư trú tại bản quán',
    hanNomName: '乙支 · 守祠世系',
    roleTitle: 'Nhánh gìn giữ từ đường & hương hỏa',
    branch: 'chi-at',
    branchLabel: 'Chi Ất',
    parentId: 'doi-2',
    folioRange: 'Trang 59–64',
    targetPage: 59,
    verificationNote: 'Cần xác nhận số nhánh thực tế khi khảo sát trọn bộ ~82 trang.',
    summary:
      'Đại diện cấu trúc các phân chi phụ trách việc thờ tự, giữ gia phả cũ trước khi được sao chép thành bản A.1046.',
  },
  {
    id: 'doi-4-a1',
    generation: 4,
    generationLabel: 'Đời IV',
    name: 'Hậu duệ Chi Giáp — Bậc khoa danh / chức sắc',
    hanNomName: '第四世 · 甲支前賢',
    roleTitle: 'Đối tượng tra cứu hành trạng & sắc phong',
    branch: 'chi-giap',
    branchLabel: 'Chi Giáp',
    parentId: 'doi-3-a',
    folioRange: 'Trang 29–42 & 65–70',
    targetPage: 29,
    verificationNote: 'Dữ liệu cá nhân cụ thể chờ phê duyệt công khai từ Viện Nghiên cứu Hán Nôm.',
    summary:
      'Lưu giữ thông tin học vị, quan chức và ghi chú hành trạng trích xuất từ các trang phiên chép phần đầu.',
  },
  {
    id: 'doi-4-a2',
    generation: 4,
    generationLabel: 'Đời IV',
    name: 'Hậu duệ Chi Giáp — Phân nhánh thứ',
    hanNomName: '第四世 · 甲支次房',
    roleTitle: 'Liên kết ngoại hôn & di cư (nếu có)',
    branch: 'chi-giap',
    branchLabel: 'Chi Giáp',
    parentId: 'doi-3-a',
    folioRange: 'Trang 71–75',
    targetPage: 71,
    verificationNote: 'Khung dữ liệu mở rộng theo kết quả biên mục bản sao A.1046.',
    summary:
      'Phục vụ thống kê nhân khẩu học lịch sử và mối liên kết giữa các chi nhánh họ Nguyễn vùng Bối Khê.',
  },
  {
    id: 'doi-4-b1',
    generation: 4,
    generationLabel: 'Đời IV',
    name: 'Hậu duệ Chi Ất — Người sao lục & bảo quản phả cũ',
    hanNomName: '第四世 · 乙支續譜',
    roleTitle: 'Đầu mối nối truyền bản sao gia phả',
    branch: 'chi-at',
    branchLabel: 'Chi Ất',
    parentId: 'doi-3-b',
    folioRange: 'Trang 76–80',
    targetPage: 76,
    verificationNote: 'Giúp làm rõ niên đại bản sao A.1046 được chép lại từ gia phả trước đó.',
    summary:
      'Ghi nhận thế hệ kế cận có vai trò bổ sung, tục biên thế thứ và lưu truyền tư liệu qua các thời kỳ.',
  },
  {
    id: 'doi-5',
    generation: 5,
    generationLabel: 'Đời V+',
    name: 'Các đời kế tiếp & Phần tục biên cuối tập',
    hanNomName: '第五世以下續編',
    roleTitle: 'Kết thúc quyển A.1046 (~Trang 82)',
    branch: 'truc-he',
    branchLabel: 'Tổng hợp cuối tập',
    parentId: 'doi-4-a1',
    folioRange: 'Trang 81–82',
    targetPage: 82,
    verificationNote: 'Phạm vi trang cuối thực tế sẽ được chốt sau khi kiểm kê trực tiếp.',
    summary:
      'Tổng kết các ghi chú hậu ký, phụ lục thế thứ bổ sung ở những trang cuối cùng trong tổng số khoảng 82 trang dự kiến.',
  },
];
