import type {
  ArchiveDatabase,
  DocumentDossier,
  DossierContentType,
  FolioRecord,
  GenealogyNode,
  ImageCategory,
  ImageProvenanceItem,
  ManuscriptColumnLine,
  MediaImageAsset,
  ReferenceSource,
  StandardArchivalRecord,
  UncertainMark,
  VerificationState,
} from '../types/archive.ts';

export const ATTRIBUTION_VERBATIM =
  'Sản phẩm thực tập của Nguyễn Văn An, mã sinh viên PH70154, mã dự án B02, nhóm 1 đợt 15, Chương trình Thực tập sinh Đợt 15 FPT Polytechnic và IMTA TECH, dự án xã hội phi lợi nhuận.';

export const ARCHIVE_IMAGES = {
  heroManuscript: '/src/assets/images/hero_boikhe_archive_1794582120410.jpg',
  specimenPlate: '/src/assets/images/specimen_folio_plate_1794582120262.jpg',
  readingRoom: '/src/assets/images/institution_han_nom_1794582121239.jpg',
  digitizationStudio: '/src/assets/images/digitization_workflow_studio_1794981623546.jpg',
  boikheCourtyard: '/src/assets/images/boikhe_heritage_courtyard_1794981623683.jpg',
  genealogyDiagram: '/src/assets/images/genealogy_scroll_diagram_1794981624447.jpg',
  archivalDossier: '/src/assets/images/archival_dossier_folder_1794981624212.jpg',
  folioScholarBiography: '/src/assets/images/folio_scholar_biography_1794982579314.jpg',
  folioImperialStele: '/src/assets/images/folio_imperial_stele_1794982580375.jpg',
  folioRitualTable: '/src/assets/images/folio_ritual_table_1794982597477.jpg',
  folioLineageTree: '/src/assets/images/folio_lineage_tree_1794982597484.jpg',
  folioChiAtLineage: '/src/assets/images/folio_chi_at_lineage_1794982582288.jpg',
};

const PROTOTYPE_COLUMNS_COVER: ManuscriptColumnLine[] = [
  {
    id: 'col-1',
    columnIndex: 1,
    xPercent: 79,
    yPercent: 21,
    widthPercent: 10,
    heightPercent: 26,
    hanNom: '貝溪狀元家譜 (Đề mục mở đầu)',
    phienAm: 'Bối Khê Trạng nguyên gia phả',
    dichNghia: 'Gia phả Trạng nguyên dòng họ Nguyễn ở Bối Khê — Phần mở đầu văn bản.',
    ghiChu:
      'Cột tiêu đề nằm ở mép phải tờ giấy bản, đọc theo chiều dọc từ trên xuống dưới, từ phải sang trái.',
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
    ghiChu:
      'Ghi nhận khung đề mục nguyên lưu dòng họ làm chuẩn đối chiếu cho các trang Phần I.',
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
    dichNghia:
      'Bản sao truyền lại từ gia phả trước đó, được lưu giữ tại Thư viện Viện Nghiên cứu Hán Nôm (ký hiệu A.1046).',
    ghiChu: 'Đối chiếu tính chất bản sao (A.1046) với danh mục thư viện.',
    isUncertain: true,
    uncertainNote: 'Cần đối chiếu niên đại chép lại chính xác trên trang gốc khi khảo sát thực địa.',
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
    isUncertain: true,
    uncertainNote: 'Chữ húy có thể dùng phép kiêng húy thời Lê – Nguyễn, cần chú giải cẩn trọng.',
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
    ghiChu: 'Tiêu đề phần Thế thứ thuộc nửa sau tập tư liệu A.1046.',
  },
  {
    id: 'lin-2',
    columnIndex: 2,
    xPercent: 69,
    yPercent: 21,
    widthPercent: 9,
    heightPercent: 62,
    hanNom: '第一世 · 始祖考諱 (Khung Đệ nhất thế)',
    phienAm: 'Đệ nhất thế · Thủy tổ khảo húy',
    dichNghia:
      'Đời thứ nhất — Thủy tổ dòng họ Nguyễn Bối Khê (khớp nối với nút NV-BK-001 trong Sơ đồ phả hệ).',
    ghiChu: 'Khớp nối trực tiếp với nút Đời I trong Sơ đồ phả hệ.',
    isUncertain: true,
    uncertainNote: 'Tên húy cụ thể trên tờ gốc được bảo lưu chờ đối chiếu thực địa bản A.1046.',
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
    dichNghia:
      'Ghi chép chính thất, á thất cùng niên hiệu sinh mất để xác định khung thời gian lịch sử.',
    ghiChu: 'Cần đối chiếu cẩn trọng chữ Hán Nôm viết thảo và chữ húy thời Lê – Nguyễn.',
    isUncertain: true,
    uncertainNote: 'Chữ viết thảo phần niên hiệu sinh mất thường dễ mờ nhòe trên bản sao.',
  },
];

interface FolioBlockSpec {
  from: number;
  to: number;
  part: 'phan-1' | 'phan-2';
  partLabel: string;
  blockTitle: string;
  blockSummary: string;
  imageUrl: string;
  imageCategory: ImageCategory;
  dossierCode: string;
  hanNomLead: string;
  phienAmLead: string;
  dichNghiaLead: string;
  hanNomDetail: string;
  phienAmDetail: string;
  dichNghiaDetail: string;
  noteDetail: string;
  uncertainPhrase: string;
  uncertainReason: string;
}

const FOLIO_BLOCK_SPECS: FolioBlockSpec[] = [
  {
    from: 1,
    to: 1,
    part: 'phan-1',
    partLabel: 'Phần I · Bối Khê Trạng nguyên gia phả',
    blockTitle: 'Tờ bìa & Đề mục tổng quát tập Bối Khê Trạng nguyên gia phả (A.1046)',
    blockSummary:
      'Trình bày tên sách Bối Khê Trạng nguyên gia phả, ký hiệu thư viện A.1046 và quy cách tách cột dọc Hán Nôm – Quốc ngữ.',
    imageUrl: ARCHIVE_IMAGES.heroManuscript,
    imageCategory: 'Ảnh minh họa',
    dossierCode: 'B02-00001',
    hanNomLead: '貝溪狀元家譜 · 原抄本卷首',
    phienAmLead: 'Bối Khê Trạng nguyên gia phả · Nguyên sao bản quyển thủ',
    dichNghiaLead: 'Gia phả Trạng nguyên họ Nguyễn ở Bối Khê — Phần mở đầu bản sao lưu trữ.',
    hanNomDetail: '藏於漢喃研究院 · 書庫記號 A.1046',
    phienAmDetail: 'Tàng ư Hán Nôm nghiên cứu viện · Thư khố ký hiệu A.1046',
    dichNghiaDetail:
      'Lưu giữ tại Thư viện Viện Nghiên cứu Hán Nôm, ký hiệu thư mục A.1046, làm tư liệu đối chiếu chuẩn.',
    noteDetail: 'Cột biên mục đầu tập xác định xuất xứ bản sao và đơn vị bảo quản.',
    uncertainPhrase: '原抄年代 (Niên đại sao bản A.1046)',
    uncertainReason: 'Chữ ghi năm sao chép lại ở góc mép lề cần kiểm tra độ mờ mực khi chụp cận cảnh.',
  },
  {
    from: 2,
    to: 6,
    part: 'phan-1',
    partLabel: 'Phần I · Bối Khê Trạng nguyên gia phả',
    blockTitle: 'Bài Phả tự & Lời tựa truyền bản sao A.1046',
    blockSummary:
      'Khảo lược duyên khởi lập phả, mục đích kính tổ truy nguyên và bối cảnh sao lục từ bản gia phả cũ trước đó.',
    imageUrl: ARCHIVE_IMAGES.specimenPlate,
    imageCategory: 'Ảnh minh họa',
    dossierCode: 'B02-00002',
    hanNomLead: '貝溪阮氏譜序 · 述祖德源流',
    phienAmLead: 'Bối Khê Nguyễn thị phả tự · Thuật tổ đức nguyên lưu',
    dichNghiaLead: 'Lời tựa phả họ Nguyễn ở Bối Khê — Kể rõ công đức tiên tổ và nguồn gốc dòng họ.',
    hanNomDetail: '追遠報本 · 謹重錄舊譜以垂後世',
    phienAmDetail: 'Truy viễn báo bản · Cẩn trọng lục cựu phả dĩ thùy hậu thế',
    dichNghiaDetail:
      'Uống nước nhớ nguồn, kính cẩn sao chép lại bản phả cũ để truyền trao cho con cháu đời sau.',
    noteDetail: 'Thuộc hệ văn xuôi biền ngẫu chữ Hán cổ đặc trưng của bài tựa gia phả.',
    uncertainPhrase: '撰序人名 (Danh tính người soạn lời tựa)',
    uncertainReason: 'Chữ ký lạc khoản cuối bài tựa thường viết lối hành thảo, cần đối chiếu bản gốc.',
  },
  {
    from: 7,
    to: 10,
    part: 'phan-1',
    partLabel: 'Phần I · Bối Khê Trạng nguyên gia phả',
    blockTitle: 'Khảo cứu hương quán Bối Khê & thủy tổ lập tộc',
    blockSummary:
      'Ghi chép địa danh hương Bối Khê, bối cảnh định cư buổi đầu và các dấu tích thờ tự gắn với Thủy tổ (NV-BK-001).',
    imageUrl: ARCHIVE_IMAGES.boikheCourtyard,
    imageCategory: 'Ảnh minh họa',
    dossierCode: 'B02-00003',
    hanNomLead: '青威縣貝溪鄉 · 世居地望考',
    phienAmLead: 'Thanh Oai huyện Bối Khê hương · Thế cư địa vọng khảo',
    dichNghiaLead: 'Khảo cứu địa danh cư trú lâu đời của dòng họ tại hương Bối Khê.',
    hanNomDetail: '始祖開基立業 · 遺澤綿延',
    phienAmDetail: 'Thủy tổ khai cơ lập nghiệp · Di trạch miên diên',
    dichNghiaDetail:
      'Thủy tổ gây dựng cơ nghiệp tại bản quán, để lại phúc trạch lâu dài cho các chi phái hậu duệ.',
    noteDetail: 'Liên kết trực tiếp đến nút NV-BK-001 (Đời I) trong Sơ đồ phả hệ.',
    uncertainPhrase: '古鄉社分界 (Ranh giới hương xã xưa)',
    uncertainReason: 'Địa danh hành chính cổ thay đổi qua các triều đại, cần chú giải đối chiếu địa chí.',
  },
  {
    from: 11,
    to: 18,
    part: 'phan-1',
    partLabel: 'Phần I · Bối Khê Trạng nguyên gia phả',
    blockTitle: 'Hành trạng khoa bảng Bối Khê & sự tích Trạng nguyên',
    blockSummary:
      'Trình bày truyền thống hiếu học, sự tích khoa danh Trạng nguyên và các mốc phụng sự đất nước được chép trong Phần I.',
    imageUrl: ARCHIVE_IMAGES.folioScholarBiography,
    imageCategory: 'Ảnh minh họa',
    dossierCode: 'B02-00004',
    hanNomLead: '狀元及第行狀 · 科名遺事錄',
    phienAmLead: 'Trạng nguyên cập đệ hành trạng · Khoa danh di sự lục',
    dichNghiaLead: 'Ghi chép hành trạng bậc đại khoa Trạng nguyên và các chuyện tích khoa bảng.',
    hanNomDetail: '博學鴻儒 · 歷朝典籍記載',
    phienAmDetail: 'Bác học hồng nho · Lịch triều điển tịch ký tải',
    dichNghiaDetail:
      'Bậc học vấn uyên bác, được thư tịch nhiều triều đại ghi nhận công lao và sự nghiệp.',
    noteDetail: 'Liên kết trực tiếp với nhánh khoa bảng Chi Giáp (NV-BK-002, NV-BK-003).',
    uncertainPhrase: '科舉年號詳記 (Chi tiết niên hiệu khoa thi)',
    uncertainReason: 'Cần đối chiếu với văn bia Quốc Tử Giám và đăng khoa lục để bảo đảm độ chuẩn xác.',
  },
  {
    from: 19,
    to: 26,
    part: 'phan-1',
    partLabel: 'Phần I · Bối Khê Trạng nguyên gia phả',
    blockTitle: 'Ghi chép văn bia, sắc phong & điển tích dòng họ',
    blockSummary:
      'Tập hợp văn bia ký, các đạo sắc phong sao lục và điển tích ca ngợi tiết hạnh, thanh danh dòng họ Nguyễn Bối Khê.',
    imageUrl: ARCHIVE_IMAGES.folioImperialStele,
    imageCategory: 'Ảnh minh họa',
    dossierCode: 'B02-00006',
    hanNomLead: '碑記勅封抄錄 · 宗族典故',
    phienAmLead: 'Bi ký sắc phong sao lục · Tông tộc điển cố',
    dichNghiaLead: 'Sao lục nội dung văn bia, sắc phong và điển cố lưu truyền trong họ.',
    hanNomDetail: '勅封美字 · 歷代褒獎忠勤',
    phienAmDetail: 'Sắc phong mỹ tự · Lịch đại bao thưởng trung cần',
    dichNghiaDetail:
      'Các mỹ tự sắc phong ghi nhận công lao trung cần qua các đời, làm tư liệu đối chiếu văn bản.',
    noteDetail: 'Ghi chú ngữ liệu Hán cổ hành chính trong văn bản sắc phong.',
    uncertainPhrase: '寶璽印文 (Dấu ấn triện trên sắc phong)',
    uncertainReason: 'Bản sao giấy chép tay chỉ ghi lại lời văn, không giữ nguyên hình dấu triện bản chính.',
  },
  {
    from: 27,
    to: 30,
    part: 'phan-1',
    partLabel: 'Phần I · Bối Khê Trạng nguyên gia phả',
    blockTitle: 'Lệ tục thờ tự, tế điền & gia quy dòng họ',
    blockSummary:
      'Quy định về ruộng hương hỏa (tế điền), nghi lễ giỗ tổ thường niên và điều răn giữ gìn gia phong, hiếu nghĩa.',
    imageUrl: ARCHIVE_IMAGES.folioRitualTable,
    imageCategory: 'Ảnh minh họa',
    dossierCode: 'B02-00008',
    hanNomLead: '祠堂祀典規條 · 祭田紀數',
    phienAmLead: 'Từ đường tự điển quy điều · Tế điền kỷ số',
    dichNghiaLead: 'Quy ước tế tự tại từ đường và thống kê ruộng hương hỏa của dòng họ.',
    hanNomDetail: '孝悌為先 · 敦睦宗親家訓',
    phienAmDetail: 'Hiếu đễ vi tiên · Đôn mục tông thân gia huấn',
    dichNghiaDetail:
      'Lấy hiếu thảo hòa thuận làm đầu, dặn dò con cháu các chi giữ gìn nề nếp gia phong.',
    noteDetail: 'Phản ánh thiết chế văn hóa – xã hội và tổ chức hương hỏa dòng họ cổ truyền.',
    uncertainPhrase: '田畝古尺換算 (Đơn vị đo ruộng tế điền cổ)',
    uncertainReason: 'Chữ viết tắt đơn vị mẫu sào cổ cần bảng quy đổi chú thích bổ sung.',
  },
  {
    from: 31,
    to: 36,
    part: 'phan-1',
    partLabel: 'Phần I · Bối Khê Trạng nguyên gia phả',
    blockTitle: 'Hành trạng các bậc khoa danh — Bản chụp phục chế quyển I',
    blockSummary:
      'Ghi nhận tiểu truyện, phẩm hàm và quy trình chụp phẳng đối chiếu các bậc khoa danh kế tiếp thuộc nửa đầu tập tư liệu.',
    imageUrl: ARCHIVE_IMAGES.digitizationStudio,
    imageCategory: 'Ảnh minh họa',
    dossierCode: 'B02-00009',
    hanNomLead: '歷代科宦列傳 · 先賢行實',
    phienAmLead: 'Lịch đại khoa hoạn liệt truyện · Tiên hiền hành thực',
    dichNghiaLead: 'Truyện ký các bậc khoa bảng, quan chức các đời tiếp theo trong họ.',
    hanNomDetail: '出仕為官 · 清廉守職傳家',
    phienAmDetail: 'Xuất sĩ vi quan · Thanh liêm thủ chức truyền gia',
    dichNghiaDetail:
      'Ghi chép phẩm hạnh thanh liêm, giữ vững chức phận của các bậc tiền nhân trước khi chuyển sang phần Thế thứ.',
    noteDetail: 'Minh họa quy trình số hóa không xâm hại cho nhóm trang liệt truyện khoa bảng.',
    uncertainPhrase: '官銜避諱字 (Chữ húy trong tên quan chức)',
    uncertainReason: 'Một số tự dạng kiêng húy triều Lê – Nguyễn cần chú giải phiên âm chuẩn.',
  },
  {
    from: 37,
    to: 42,
    part: 'phan-1',
    partLabel: 'Phần I · Bối Khê Trạng nguyên gia phả',
    blockTitle: 'Liệt truyện chức sắc kế tiếp — Lưu trữ thư khố Phần I',
    blockSummary:
      'Hoàn thiện nửa đầu tập tư liệu (Phần I, đến trang 42) gắn với hồ sơ lưu trữ tại Thư viện Viện Nghiên cứu Hán Nôm.',
    imageUrl: ARCHIVE_IMAGES.readingRoom,
    imageCategory: 'Ảnh minh họa',
    dossierCode: 'B02-00010',
    hanNomLead: '後進科名 · 承繼家學',
    phienAmLead: 'Hậu tiến khoa danh · Thừa kế gia học',
    dichNghiaLead: 'Liệt truyện các bậc hậu tiến khoa danh nối nghiệp gia học ở đoạn cuối Phần I.',
    hanNomDetail: '前編完卷 · 轉入世次譜系',
    phienAmDetail: 'Tiền biên hoàn quyển · Chuyển nhập thế thứ phả hệ',
    dichNghiaDetail:
      'Khép lại nửa đầu tập sách (Tr.01–42) để chuẩn bị bước sang Phần II (Thế thứ dòng họ).',
    noteDetail: 'Khép lại Phần I (Tr.01–42) để mở đầu Phần II (Tr.43–82).',
    uncertainPhrase: '前編卷末題記 (Lời đề cuối Phần I)',
    uncertainReason: 'Cần đối chiếu dòng chuyển tiếp giữa trang 42 và trang 43 trên bản lưu trữ.',
  },
  {
    from: 43,
    to: 46,
    part: 'phan-2',
    partLabel: 'Phần II · Bối Khê Nguyễn tộc gia phả thế thứ',
    blockTitle: 'Mở đầu phần Thế thứ dòng họ Nguyễn Bối Khê',
    blockSummary:
      'Xác lập quy ước ghi thế thứ: Đệ nhất thế (Thủy tổ), phân chi kế thừa, chính thất – á thất và ngày kỵ nhật.',
    imageUrl: ARCHIVE_IMAGES.genealogyDiagram,
    imageCategory: 'Ảnh sơ đồ',
    dossierCode: 'B02-00011',
    hanNomLead: '貝溪阮族家譜世次 · 第一世',
    phienAmLead: 'Bối Khê Nguyễn tộc gia phả thế thứ · Đệ nhất thế',
    dichNghiaLead: 'Mở đầu bảng kê thế thứ họ Nguyễn Bối Khê từ Đời I Thủy tổ.',
    hanNomDetail: '尊卑有序 · 昭穆分明譜系',
    phienAmDetail: 'Tôn ti hữu tự · Chiêu mục phân minh phả hệ',
    dichNghiaDetail:
      'Sắp xếp thứ bậc tôn ti rõ ràng theo chuẩn chiêu mục để xây dựng sơ đồ phả hệ số.',
    noteDetail: 'Trang bản lề kết nối trực tiếp với nút NV-BK-001 và NV-BK-002.',
    uncertainPhrase: '始祖考諱 (Tên húy Thủy tổ)',
    uncertainReason: 'Chữ húy Thủy tổ cần giữ nguyên tắc tôn trọng lưu trữ, chờ đối chiếu trang gốc.',
  },
  {
    from: 47,
    to: 51,
    part: 'phan-2',
    partLabel: 'Phần II · Bối Khê Nguyễn tộc gia phả thế thứ',
    blockTitle: 'Bảng kê thế thứ Đời II — Chính hệ nối truyền',
    blockSummary:
      'Ghi nhận thông tin Tổ đời thứ hai (NV-BK-002), vai trò cầu nối chuyển tiếp sang hai phân chi lớn Chi Giáp và Chi Ất.',
    imageUrl: ARCHIVE_IMAGES.folioChiAtLineage,
    imageCategory: 'Ảnh minh họa',
    dossierCode: 'B02-00012',
    hanNomLead: '第二世世次 · 承傳正系錄',
    phienAmLead: 'Đệ nhị thế thế thứ · Thừa truyền chính hệ lục',
    dichNghiaLead: 'Bảng kê thế thứ Đời thứ hai thuộc trục chính hệ dòng họ.',
    hanNomDetail: '分枝甲乙兩派 · 世系相承',
    phienAmDetail: 'Phân chi Giáp Ất lưỡng phái · Thế hệ tương thừa',
    dichNghiaDetail:
      'Xác lập quan hệ cha – con làm điểm phân nhánh thành Chi Giáp (nhánh chính) và Chi Ất (nhánh phụ).',
    noteDetail: 'Liên kết trực tiếp với nút NV-BK-002 trong Sơ đồ phả hệ.',
    uncertainPhrase: '配室氏族生卒 (Họ tên phối ngẫu và ngày giỗ Đời II)',
    uncertainReason: 'Cần đối chiếu nét chữ nhỏ chú giải bên cạnh cột chính của tờ thế thứ.',
  },
  {
    from: 52,
    to: 58,
    part: 'phan-2',
    partLabel: 'Phần II · Bối Khê Nguyễn tộc gia phả thế thứ',
    blockTitle: 'Bảng kê thế thứ Đời III — Chi Giáp (Nhánh chính)',
    blockSummary:
      'Thế thứ nhánh chính Chi Giáp Đời III (NV-BK-003), đối chiếu chéo với phần hành trạng khoa bảng ở Phần I.',
    imageUrl: ARCHIVE_IMAGES.folioLineageTree,
    imageCategory: 'Ảnh sơ đồ',
    dossierCode: 'B02-00013',
    hanNomLead: '第三世 · 甲支正派世次',
    phienAmLead: 'Đệ tam thế · Giáp chi chính phái thế thứ',
    dichNghiaLead: 'Thế thứ Đời thứ ba thuộc nhánh chính Chi Giáp.',
    hanNomDetail: '科舉顯達 · 並參前編行狀',
    phienAmDetail: 'Khoa cử hiển đạt · Tịnh tham tiền biên hành trạng',
    dichNghiaDetail:
      'Ghi chú đối chiếu chéo giữa bảng thế thứ nhánh Chi Giáp với phần hành trạng khoa bảng ở nửa đầu tập.',
    noteDetail: 'Liên kết nút NV-BK-003 (Đời III · Nhánh chính · Chi Giáp).',
    uncertainPhrase: '字號別稱 (Tên tự và tên hiệu Đời III)',
    uncertainReason: 'Một số nhân vật ghi đồng thời tên húy, tên tự và thụy hiệu, cần phân tách rõ.',
  },
  {
    from: 59,
    to: 64,
    part: 'phan-2',
    partLabel: 'Phần II · Bối Khê Nguyễn tộc gia phả thế thứ',
    blockTitle: 'Bảng kê thế thứ Đời III — Chi Ất bản quán (Nhánh phụ)',
    blockSummary:
      'Thế thứ nhánh phụ Chi Ất Đời III (NV-BK-004), đảm trách việc cư trú bản quán, giữ từ đường, tế điền và bảo quản phả cũ.',
    imageUrl: ARCHIVE_IMAGES.folioRitualTable,
    imageCategory: 'Ảnh minh họa',
    dossierCode: 'B02-00014',
    hanNomLead: '第三世 · 乙支守祠世次',
    phienAmLead: 'Đệ tam thế · Ất chi thủ từ thế thứ',
    dichNghiaLead: 'Thế thứ Đời thứ ba thuộc nhánh phụ Chi Ất coi giữ từ đường tại bản quán.',
    hanNomDetail: '居守鄉貫 · 奉事祖先香火',
    phienAmDetail: 'Cư thủ hương quán · Phụng sự tổ tiên hương hỏa',
    dichNghiaDetail:
      'Ghi rõ phân công giữ gìn hương hỏa, ruộng tế điền và bảo quản bản phả cổ tại quê gốc Bối Khê.',
    noteDetail: 'Liên kết nút NV-BK-004 (Đời III · Nhánh phụ · Chi Ất).',
    uncertainPhrase: '墓地坐向記 (Ghi chú hướng mộ phần)',
    uncertainReason: 'Thuật ngữ phong thủy hướng mộ cổ cần chú giải chuẩn xác khi số hóa.',
  },
  {
    from: 65,
    to: 70,
    part: 'phan-2',
    partLabel: 'Phần II · Bối Khê Nguyễn tộc gia phả thế thứ',
    blockTitle: 'Bảng kê thế thứ Đời IV — Chi Giáp chính chi',
    blockSummary:
      'Chi tiết thế hệ Đời IV thuộc Chi Giáp chính chi (NV-BK-005), nối tiếp trực tiếp xuống Đời V+.',
    imageUrl: ARCHIVE_IMAGES.genealogyDiagram,
    imageCategory: 'Ảnh sơ đồ',
    dossierCode: 'B02-00015',
    hanNomLead: '第四世 · 甲支正枝世系',
    phienAmLead: 'Đệ tứ thế · Giáp chi chính chi thế hệ',
    dichNghiaLead: 'Thế thứ Đời thứ tư thuộc nhánh chính Chi Giáp.',
    hanNomDetail: '承前啟後 · 錄子孫名位',
    phienAmDetail: 'Thừa tiền khải hậu · Lục tử tôn danh vị',
    dichNghiaDetail:
      'Nối tiếp mạch thế hệ từ Đời III xuống Đời IV, ghi thứ bậc con trưởng và con thứ.',
    noteDetail: 'Liên kết nút NV-BK-005 (Đời IV · Nhánh chính).',
    uncertainPhrase: '生卒干支 (Can chi năm sinh mất)',
    uncertainReason: 'Ghi chú theo hệ can chi 60 năm cần đối chiếu triều đại để xác định năm dương lịch.',
  },
  {
    from: 71,
    to: 75,
    part: 'phan-2',
    partLabel: 'Phần II · Bối Khê Nguyễn tộc gia phả thế thứ',
    blockTitle: 'Bảng kê thế thứ Đời IV — Chi Giáp phân nhánh thứ',
    blockSummary:
      'Phản ánh các phân nhánh thứ Đời IV (NV-BK-006) và nối mạch xuống thế hệ kế cận Đời V (NV-BK-009).',
    imageUrl: ARCHIVE_IMAGES.folioLineageTree,
    imageCategory: 'Ảnh sơ đồ',
    dossierCode: 'B02-00016',
    hanNomLead: '第四世 · 甲支次派分枝',
    phienAmLead: 'Đệ tứ thế · Giáp chi thứ phái phân chi',
    dichNghiaLead: 'Thế thứ phân nhánh thứ của Chi Giáp ở Đời thứ tư.',
    hanNomDetail: '姻親外族 · 遷居支派記',
    phienAmDetail: 'Nhân thân ngoại tộc · Thiên cư chi phái ký',
    dichNghiaDetail:
      'Ghi chép mối liên kết thông gia và sự phân tán cư trú của các phân nhánh thứ.',
    noteDetail: 'Liên kết nút NV-BK-006 (Đời IV) và NV-BK-009 (Đời V).',
    uncertainPhrase: '遷居地名古字 (Chữ Nôm ghi tên thôn xóm chuyển cư)',
    uncertainReason: 'Địa danh cấp thôn xóm ghi bằng chữ Nôm cổ dễ có nhiều cách đọc âm địa phương.',
  },
  {
    from: 76,
    to: 80,
    part: 'phan-2',
    partLabel: 'Phần II · Bối Khê Nguyễn tộc gia phả thế thứ',
    blockTitle: 'Bảng kê thế thứ Đời IV — Chi Ất kế thừa',
    blockSummary:
      'Ghi nhận thế hệ Đời IV Chi Ất (NV-BK-007) — đầu mối sao lục, tục biên phả cũ và truyền xuống Đời V (NV-BK-010).',
    imageUrl: ARCHIVE_IMAGES.folioChiAtLineage,
    imageCategory: 'Ảnh minh họa',
    dossierCode: 'B02-00017',
    hanNomLead: '第四世 · 乙支承繼及續編',
    phienAmLead: 'Đệ tứ thế · Ất chi thừa kế cập tục biên',
    dichNghiaLead: 'Thế thứ Đời thứ tư nhánh Chi Ất và vai trò bảo quản, tục biên gia phả.',
    hanNomDetail: '重抄保存 · 續補世系不絕',
    phienAmDetail: 'Trọng sao bảo tồn · Tục bổ thế hệ bất tuyệt',
    dichNghiaDetail:
      'Ghi nhận công lao sao lục giữ gìn văn bản qua các biến động lịch sử để không đứt mạch gia phả.',
    noteDetail: 'Liên kết nút NV-BK-007 (Đời IV) và NV-BK-010 (Đời V).',
    uncertainPhrase: '抄錄者銜名 (Chức danh người sao lục)',
    uncertainReason: 'Cần xác định mối quan hệ chính xác giữa người sao bản tiền thân và bản A.1046.',
  },
  {
    from: 81,
    to: 82,
    part: 'phan-2',
    partLabel: 'Phần II · Bối Khê Nguyễn tộc gia phả thế thứ',
    blockTitle: 'Phần tục biên cuối tập & Hậu ký tổng hợp',
    blockSummary:
      'Tổng kết các ghi chú hậu ký, tục biên Đời V+ (NV-BK-008) và phụ lục kỵ nhật khép lại trọn bộ ~82 trang tư liệu A.1046.',
    imageUrl: ARCHIVE_IMAGES.archivalDossier,
    imageCategory: 'Ảnh minh họa',
    dossierCode: 'B02-00018',
    hanNomLead: '第五世以下續編 · 卷末後記',
    phienAmLead: 'Đệ ngũ thế dĩ hạ tục biên · Quyển mạt hậu ký',
    dichNghiaLead: 'Phần tục biên từ Đời thứ năm trở xuống và lời hậu ký cuối quyển A.1046.',
    hanNomDetail: '全書八十二葉 · 忌日總錄附後',
    phienAmDetail: 'Toàn thư bát thập nhị diệp · Kỵ nhật tổng lục phụ hậu',
    dichNghiaDetail:
      'Hoàn chỉnh phần ghi chép cuối tập (khoảng 82 trang), phụ lục bảng tổng hợp ngày giỗ tổ các chi.',
    noteDetail: 'Liên kết nút NV-BK-008 (Đời V+ · Tục biên cuối tập).',
    uncertainPhrase: '卷末跋文殘字 (Nét chữ cuối tờ hậu ký)',
    uncertainReason: 'Trang cuối sách cổ thường chịu tác động ẩm mốc hoặc mòn gáy, cần phục chế cẩn trọng.',
  },
];

function getBlockSpec(page: number): FolioBlockSpec {
  return (
    FOLIO_BLOCK_SPECS.find((s) => page >= s.from && page <= s.to) ||
    FOLIO_BLOCK_SPECS[FOLIO_BLOCK_SPECS.length - 1]
  );
}

function buildColumnsForPage(page: number, spec: FolioBlockSpec): ManuscriptColumnLine[] {
  if (page === 1 || page === 2) return PROTOTYPE_COLUMNS_COVER;
  if (page === 43) return PROTOTYPE_COLUMNS_LINEAGE;

  const pageTag = `Tờ ${String(page).padStart(2, '0')}`;
  return [
    {
      id: `p${page}-col-1`,
      columnIndex: 1,
      xPercent: 79,
      yPercent: 21,
      widthPercent: 10,
      heightPercent: 28,
      hanNom: `${spec.hanNomLead} (${pageTag})`,
      phienAm: `${spec.phienAmLead} (${pageTag})`,
      dichNghia: `${spec.dichNghiaLead} — Trình bày tại ${pageTag} (${spec.dossierCode}).`,
      ghiChu: `Cột đề mục đầu trang ${String(page).padStart(2, '0')} thuộc ${spec.partLabel}.`,
    },
    {
      id: `p${page}-col-2`,
      columnIndex: 2,
      xPercent: 69,
      yPercent: 21,
      widthPercent: 9,
      heightPercent: 62,
      hanNom: spec.hanNomDetail,
      phienAm: spec.phienAmDetail,
      dichNghia: spec.dichNghiaDetail,
      ghiChu: spec.noteDetail,
    },
    {
      id: `p${page}-col-3`,
      columnIndex: 3,
      xPercent: 59,
      yPercent: 21,
      widthPercent: 9,
      heightPercent: 62,
      hanNom: `貝溪阮族 · 記號 A.1046 第${String(page).padStart(2, '0')}頁`,
      phienAm: `Bối Khê Nguyễn tộc · Ký hiệu A.1046 đệ ${String(page).padStart(2, '0')} diệp`,
      dichNghia: `Ký hiệu biên mục trang ${String(page).padStart(2, '0')}/82 thuộc hồ sơ ${spec.dossierCode}, gắn liên kết đồng bộ giữa ảnh và văn bản số.`,
      ghiChu: 'Đối chiếu khớp mã trang A.1046 và mã hồ sơ dự án B02.',
    },
    {
      id: `p${page}-col-4`,
      columnIndex: 4,
      xPercent: 49,
      yPercent: 21,
      widthPercent: 9,
      heightPercent: 62,
      hanNom: `考訂備註 · ${spec.uncertainPhrase}`,
      phienAm: `Khảo đính bị chú · Đối chiếu tự dạng Hán Nôm`,
      dichNghia: `Ghi chú hiệu đính văn bản: lưu ý kiểm tra các chữ húy, chữ viết thảo và đơn vị niên đại cổ trên ${pageTag}.`,
      ghiChu: spec.uncertainReason,
      isUncertain: true,
      uncertainNote: spec.uncertainReason,
    },
  ];
}

const DEFAULT_UNCERTAIN_MARKS_P1: UncertainMark[] = [
  {
    id: 'um-1',
    glyphOrPhrase: '[Niên đại sao chép bản A.1046]',
    locationNote: 'Cột 03 — phần ghi chú truyền bản',
    reason: 'Niên đại sao lục bản A.1046 từ phả gốc trước đó cần đối chiếu trực tiếp phần lạc khoản.',
    resolved: false,
  },
  {
    id: 'um-2',
    glyphOrPhrase: '諱字 (Chữ húy tiên tổ)',
    locationNote: 'Cột 04 — dòng quy cách ghi húy nhật',
    reason: 'Trong gia phả cổ thường có chữ viết bớt nét hoặc kiêng húy thời Lê – Nguyễn.',
    resolved: false,
  },
];

const DEFAULT_UNCERTAIN_MARKS_P43: UncertainMark[] = [
  {
    id: 'um-43-1',
    glyphOrPhrase: '始祖考諱 [Tên húy Thủy tổ]',
    locationNote: 'Cột 02 — dòng Đệ nhất thế',
    reason: 'Giữ ký hiệu khung chuẩn cho mục tên húy Thủy tổ trong phần Thế thứ.',
    resolved: false,
  },
];

const DIGITIZER_STAMP = 'Nguyễn Văn An - PH70154 - Nhóm 1 Đợt 15; 17/11/2026';

const CURRENT_REPOSITORY_HANNOM =
  'Thư viện Viện Nghiên cứu Hán Nôm — 183 Đặng Tiến Đông, phường Đống Đa, Thành phố Hà Nội (theo đơn vị hành chính hai cấp; cần xác nhận lại với đơn vị lưu giữ trước khi liên hệ)';

const HISTORICAL_REPOSITORY_HANNOM =
  'Không áp dụng cho bản sao hiện tại; nguồn thư mục cũ trước sắp xếp hành chính ghi: 183 Đặng Tiến Đông, phường Trung Liệt, quận Đống Đa, Thành phố Hà Nội. Bản gốc tiền thân lưu truyền tại thôn Bối Khê, xã Tam Hưng, huyện Thanh Oai, tỉnh Hà Tây (cũ)';

const DEFAULT_ALLOWED_SCOPE =
  'Đăng ảnh đã giảm kích thước (ảnh minh họa cấu trúc) và văn bản phiên âm/dịch nghĩa tham khảo trong sản phẩm học tập phi lợi nhuận; không cho tải ảnh độ phân giải cao và không phát hành ảnh bản gốc A.1046 khi chưa được cấp phép';

const DEFAULT_UNPUBLISHED_PARTS =
  'Vị trí giá kệ lưu trữ chi tiết trong kho thư khố, thông tin liên hệ cá nhân (số điện thoại, email riêng) và tên húy chưa được phép công bố từ nguyên bản A.1046';

const DEFAULT_PERMISSION_GRANTOR =
  'Thư viện Viện Nghiên cứu Hán Nôm (đơn vị lưu giữ theo danh mục); phần biên mục cấu trúc và ảnh minh họa phi lợi nhuận được Nhóm 1 Đợt 15 – Dự án B02 công bố học tập ngày 17/11/2026';

const DEFAULT_REFERENCE_SOURCES =
  '1) Danh mục thư viện Viện Nghiên cứu Hán Nôm – Tài liệu Bối Khê Trạng nguyên gia phả, ký hiệu A.1046 (hannom.vass.gov.vn). 2) Nhiệm vụ "Nghiên cứu, số hóa và biên mục chi tiết tài liệu gia phả", Viện Hàn lâm KHXH Việt Nam / Viện Nghiên cứu Hán Nôm (vass.gov.vn). 3) Tài liệu nghiệp vụ "Nguồn sử liệu gia phả", Trung tâm Lưu trữ quốc gia (archives.org.vn).';

export const INITIAL_FOLIOS: FolioRecord[] = Array.from({ length: 82 }, (_, idx) => {
  const pageNumber = idx + 1;
  const spec = getBlockSpec(pageNumber);
  const isPrototype = pageNumber === 1 || pageNumber === 2 || pageNumber === 43;
  const columns = buildColumnsForPage(pageNumber, spec);
  const identifier = `B02-${String(100 + pageNumber).padStart(5, '0')}`;
  const folioCode = `A.1046-T${String(pageNumber).padStart(2, '0')}`;
  const pagePad = String(pageNumber).padStart(2, '0');

  const folioTitle = isPrototype
    ? pageNumber === 1
      ? 'Tờ bìa và đề mục tổng quát tập Bối Khê Trạng nguyên gia phả (ký hiệu A.1046)'
      : pageNumber === 2
        ? 'Lời tựa Phả tự thuật tổ đức nguyên lưu dòng họ Nguyễn tại hương Bối Khê'
        : 'Bảng kê thế thứ Đời thứ nhất – Mở đầu phần Bối Khê Nguyễn tộc gia phả thế thứ'
    : `${spec.blockTitle} — Tờ số ${pagePad} (${folioCode})`;

  const hanNomFull = columns.map((c) => c.hanNom).join(' | ');
  const phienAmFull = columns.map((c) => c.phienAm).join(' | ');
  const dichNghiaFull = columns.map((c) => c.dichNghia).join(' ');

  const archivalRecord: StandardArchivalRecord = {
    identifier,
    title: folioTitle,
    recordType:
      spec.part === 'phan-2'
        ? 'Văn bản kết hợp bảng thế thứ; bản chép tay mực nho trên giấy dó (bản sao truyền lục)'
        : 'Văn bản; bản chép tay mực nho trên giấy dó (bản sao truyền lục)',
    dating:
      'Chưa ghi năm sao lục tuyệt đối trên tờ mẫu; suy đoán khung niên đại cuối thế kỷ XIX – đầu thế kỷ XX theo quy cách bản sao truyền lục ký hiệu A.1046 tại Thư viện Viện Nghiên cứu Hán Nôm',
    physicalDescription: `Tờ giấy dó đóng gáy chỉ truyền thống, khổ dọc, trình bày ${columns.length} cột chữ Hán Nôm đọc từ phải sang trái; mép giấy dự kiến ngả vàng nhẹ và có vết sờn gáy do lưu trữ lâu năm (ảnh hiện tại là ảnh minh họa cấu trúc).`,
    languageScript: 'Hán, Nôm',
    currentRepository: CURRENT_REPOSITORY_HANNOM,
    historicalRepository: HISTORICAL_REPOSITORY_HANNOM,
    repositoryRegNo: `A.1046 (tờ nội bộ số ${pagePad}/82)`,
    displayedCopyType:
      'Ảnh minh họa cấu trúc và bản chuyển thể số tham chiếu từ danh mục A.1046 (chưa phải bản số trực tiếp từ vật mang tin gốc theo Điều 63 Luật Di sản văn hóa / Luật Lưu trữ 2024)',
    originalCondition:
      'Chưa tiếp cận trực tiếp vật mang tin gốc A.1046; dự kiến giấy dó ố vàng nhẹ, sờn mép gáy chỉ, phần chữ chính còn đọc được nhưng một số chữ thảo/chữ húy có thể mờ nét.',
    attachments: `${identifier}-anh-01.jpg (toàn trang minh họa cấu trúc); đang chờ bổ sung -anh-02 đến -anh-05 (cận cảnh từng cột chữ) và -anh-mat-sau khi được cấp phép sao chụp bản gốc A.1046.`,
    transcriptionAndTranslation: {
      hanNom: hanNomFull,
      phienAm: phienAmFull,
      phienAmVerification:
        'Đã kiểm khung cấu trúc phiên âm bởi Nguyễn Văn An (nhóm dự án B02) ngày 17/11/2026; chưa kiểm trực tiếp mặt chữ trên bản gốc A.1046.',
      dichNghia: dichNghiaFull,
      dichNghiaVerification:
        'Chưa kiểm chuyên môn (mới thực hiện dịch nghĩa tham khảo cấu trúc phục vụ học tập; cần chuyên gia Hán Nôm hiệu đính).',
    },
    relations: `Thuộc tập tư liệu 01 đơn vị gồm ~82 trang (ký hiệu A.1046); gắn với hồ sơ ${spec.dossierCode}${pageNumber > 1 ? `, kế tiếp tờ B02-${String(99 + pageNumber).padStart(5, '0')}` : ''}${pageNumber < 82 ? `, liên thông tới B02-${String(101 + pageNumber).padStart(5, '0')}` : ''}.`,
    permissionGrantor: DEFAULT_PERMISSION_GRANTOR,
    allowedScope: DEFAULT_ALLOWED_SCOPE,
    unpublishedParts: DEFAULT_UNPUBLISHED_PARTS,
    referenceSources: DEFAULT_REFERENCE_SOURCES,
    digitizerAndDate: DIGITIZER_STAMP,
    uncertainPoints: `${spec.uncertainPhrase}: ${spec.uncertainReason}`,
  };

  return {
    pageNumber,
    folioCode,
    identifier,
    sectionPart: spec.part,
    sectionLabel: spec.partLabel,
    title: folioTitle,
    summary: spec.blockSummary,
    status: isPrototype ? 'prototype' : 'verified',
    statusLabel: isPrototype
      ? `Trang mẫu chuẩn 20 trường (${identifier})`
      : `Đã biên mục 20 trường (${identifier} · ${spec.dossierCode})`,
    verificationStatus: (isPrototype ? 'Dữ liệu mẫu' : 'Đang xác minh') as VerificationState,
    imageUrl: spec.imageUrl,
    imageCaption: `${spec.imageCategory} cho trang ${pagePad} (${identifier} · ${folioCode}): ${spec.blockTitle} — ảnh giảm kích thước minh họa cấu trúc, không phải bản chụp gốc A.1046.`,
    imageSource: `1) Khảo sát biên mục dự án B02 (17/11/2026). 2) Danh mục Thư viện Viện Nghiên cứu Hán Nôm (A.1046).`,
    imageCategory: spec.imageCategory,
    originalStatus:
      'Chưa tiếp cận trực tiếp vật mang tin gốc A.1046; hiển thị ảnh minh họa cấu trúc theo Điều 63 Luật 2024',
    transcriptionText: columns.map((c) => `${c.hanNom} (${c.phienAm})`).join('\n'),
    translationText: columns.map((c) => c.dichNghia).join('\n'),
    columns,
    uncertainMarks:
      pageNumber === 1 || pageNumber === 2
        ? DEFAULT_UNCERTAIN_MARKS_P1
        : pageNumber === 43
          ? DEFAULT_UNCERTAIN_MARKS_P43
          : [
              {
                id: `um-p${pageNumber}`,
                glyphOrPhrase: spec.uncertainPhrase,
                locationNote: `Tờ ${pagePad} (${identifier}) · Cột 04`,
                reason: spec.uncertainReason,
                resolved: false,
              },
            ],
    archivalRecord,
    updatedAt: '2026-11-17',
  };
});

export const INITIAL_CHARACTERS: GenealogyNode[] = [
  {
    id: 'doi-1',
    characterCode: 'NV-BK-001',
    generation: 1,
    generationLabel: 'Đời I',
    name: 'Thủy tổ dòng họ Nguyễn Bối Khê',
    tabooName: 'Chưa công bố tên húy (bảo lưu theo nguyên bản A.1046)',
    roleTitle: 'Thủy tổ lập tộc tại thôn Bối Khê, xã Tam Hưng',
    branch: 'truc-he',
    branchType: 'Nhánh chính',
    branchLabel: 'Nhánh chính · Trục gốc',
    parentId: null,
    familyRelation: 'Thủy tổ khởi nguồn — Cha của Tổ đời thứ hai (NV-BK-002)',
    folioRange: 'Trang 07–10 & 43–46',
    targetPage: 43,
    sourceRef: 'Bối Khê Nguyễn tộc gia phả thế thứ (A.1046 · B02-00003, B02-00011)',
    verificationStatus: 'Đang xác minh',
    verificationNote: 'Đã liên kết cấu trúc Đời I giữa Phần I (Tr.07–10) và Phần II Thế thứ (Tr.43–46); tên húy cụ thể chờ đối chiếu bản vật lý A.1046.',
    summary:
      'Nút gốc hệ thống hóa thông tin Thủy tổ theo mục "Bối Khê Nguyễn tộc gia phả thế thứ", làm điểm khởi đầu cho toàn bộ cây phả hệ số.',
    portraitVerified: false,
  },
  {
    id: 'doi-2',
    characterCode: 'NV-BK-002',
    generation: 2,
    generationLabel: 'Đời II',
    name: 'Tổ đời thứ hai (Chính hệ nối truyền)',
    tabooName: 'Chưa công bố tên húy (bảo lưu theo nguyên bản A.1046)',
    roleTitle: 'Thế hệ kế thừa trực hệ tại Bối Khê',
    branch: 'truc-he',
    branchType: 'Nhánh chính',
    branchLabel: 'Nhánh chính · Trục gốc',
    parentId: 'doi-1',
    familyRelation: 'Con của Thủy tổ (NV-BK-001); Cha của Chi Giáp (NV-BK-003) và Chi Ất (NV-BK-004)',
    folioRange: 'Trang 11–14 & 47–51',
    targetPage: 47,
    sourceRef: 'Bối Khê Nguyễn tộc gia phả thế thứ (A.1046 · B02-00004, B02-00012)',
    verificationStatus: 'Đang xác minh',
    verificationNote: 'Đã xác định vị trí cầu nối Đời II phân tách hai chi Giáp – Ất trong khung thế thứ A.1046.',
    summary:
      'Ghi nhận thế hệ kế thừa trực hệ, xác lập nền tảng phân chia hai phân chi lớn Chi Giáp và Chi Ất trong gia phả họ Nguyễn ở Bối Khê.',
    portraitVerified: false,
  },
  {
    id: 'doi-3-a',
    characterCode: 'NV-BK-003',
    generation: 3,
    generationLabel: 'Đời III',
    name: 'Đại diện Chi Giáp — Nhánh khoa bảng Bối Khê',
    tabooName: 'Chưa công bố tên húy (bảo lưu theo nguyên bản A.1046)',
    roleTitle: 'Nhánh trọng tâm phần Bối Khê Trạng nguyên gia phả',
    branch: 'chi-giap',
    branchType: 'Nhánh chính',
    branchLabel: 'Nhánh chính · Chi Giáp',
    parentId: 'doi-2',
    familyRelation: 'Con của Tổ đời II (NV-BK-002); Cha của NV-BK-005 và NV-BK-006',
    folioRange: 'Trang 11–26 & 52–58',
    targetPage: 52,
    sourceRef: 'Phần Bối Khê Trạng nguyên gia phả & Thế thứ Chi Giáp (A.1046 · B02-00005, B02-00013)',
    verificationStatus: 'Đang xác minh',
    verificationNote: 'Đã liên kết đồng bộ giữa hành trạng khoa bảng (Phần I) và bảng kê thế thứ Đời III (Phần II).',
    summary:
      'Nhánh tư liệu trọng tâm phản ánh truyền thống hiếu học, khoa bảng và hành trạng nhân vật tiêu biểu được chép trong A.1046.',
    portraitVerified: false,
  },
  {
    id: 'doi-3-b',
    characterCode: 'NV-BK-004',
    generation: 3,
    generationLabel: 'Đời III',
    name: 'Đại diện Chi Ất — Nhánh cư trú & thủ từ bản quán',
    tabooName: 'Chưa công bố tên húy (bảo lưu theo nguyên bản A.1046)',
    roleTitle: 'Nhánh gìn giữ từ đường, tế điền & hương hỏa',
    branch: 'chi-at',
    branchType: 'Nhánh phụ',
    branchLabel: 'Nhánh phụ · Chi Ất',
    parentId: 'doi-2',
    familyRelation: 'Con của Tổ đời II (NV-BK-002); Cha của hậu duệ Chi Ất (NV-BK-007)',
    folioRange: 'Trang 27–30 & 59–64',
    targetPage: 59,
    sourceRef: 'Lệ tục thờ tự & Thế thứ Chi Ất (A.1046 · B02-00008, B02-00014)',
    verificationStatus: 'Đang xác minh',
    verificationNote: 'Đã xác định cấu trúc nhánh phụ Chi Ất phụ trách hương hỏa tại xã Tam Hưng (hương Bối Khê xưa).',
    summary:
      'Đại diện cấu trúc các phân chi phụ trách việc thờ tự, quản lý tế điền và gìn giữ bản phả cũ tại bản quán.',
    portraitVerified: false,
  },
  {
    id: 'doi-4-a1',
    characterCode: 'NV-BK-005',
    generation: 4,
    generationLabel: 'Đời IV',
    name: 'Hậu duệ Chi Giáp — Bậc khoa danh / chức sắc chính chi',
    tabooName: 'Chưa công bố tên húy (bảo lưu theo nguyên bản A.1046)',
    roleTitle: 'Thế hệ khoa danh, văn bia & sắc phong Đời IV',
    branch: 'chi-giap',
    branchType: 'Nhánh chính',
    branchLabel: 'Nhánh chính · Chi Giáp',
    parentId: 'doi-3-a',
    familyRelation: 'Con thuộc Chi Giáp (NV-BK-003); Cha của thế hệ Tục biên Đời V+ (NV-BK-008)',
    folioRange: 'Trang 29–42 & 65–70',
    targetPage: 65,
    sourceRef: 'Phần hành trạng khoa danh & thế thứ Đời IV Chi Giáp (A.1046 · B02-00009, B02-00015)',
    verificationStatus: 'Đang xác minh',
    verificationNote: 'Đã liên kết bản ghi Đời IV Chi Giáp từ Phần I sang Phần II.',
    summary:
      'Lưu giữ thông tin học vị, quan chức và ghi chú hành trạng trích xuất từ các trang phiên chép nửa đầu và bảng kê Đời IV.',
    portraitVerified: false,
  },
  {
    id: 'doi-4-a2',
    characterCode: 'NV-BK-006',
    generation: 4,
    generationLabel: 'Đời IV',
    name: 'Hậu duệ Chi Giáp — Phân nhánh thứ',
    tabooName: 'Chưa công bố tên húy (bảo lưu theo nguyên bản A.1046)',
    roleTitle: 'Phân nhánh ngoại hôn & di cư Đời IV',
    branch: 'chi-giap',
    branchType: 'Nhánh phụ',
    branchLabel: 'Nhánh phụ · Chi Giáp thứ',
    parentId: 'doi-3-a',
    familyRelation: 'Con thuộc Chi Giáp (NV-BK-003); Cha của phân nhánh thứ Đời V (NV-BK-009)',
    folioRange: 'Trang 71–75',
    targetPage: 71,
    sourceRef: 'Bảng kê thế thứ Đời IV phân nhánh thứ (A.1046 · B02-00016)',
    verificationStatus: 'Đang xác minh',
    verificationNote: 'Đã bổ sung liên kết phân nhánh thứ Đời IV và thế hệ kế cận.',
    summary:
      'Phục vụ thống kê nhân khẩu học lịch sử và mối liên kết giữa các chi nhánh họ Nguyễn vùng Bối Khê.',
    portraitVerified: false,
  },
  {
    id: 'doi-4-b1',
    characterCode: 'NV-BK-007',
    generation: 4,
    generationLabel: 'Đời IV',
    name: 'Hậu duệ Chi Ất — Người sao lục & bảo quản phả cũ',
    tabooName: 'Chưa công bố tên húy (bảo lưu theo nguyên bản A.1046)',
    roleTitle: 'Đầu mối nối truyền bản sao gia phả A.1046',
    branch: 'chi-at',
    branchType: 'Nhánh phụ',
    branchLabel: 'Nhánh phụ · Chi Ất',
    parentId: 'doi-3-b',
    familyRelation: 'Con thuộc Chi Ất (NV-BK-004); Cha của hậu duệ Chi Ất Đời V (NV-BK-010)',
    folioRange: 'Trang 76–80',
    targetPage: 76,
    sourceRef: 'Bảng kê thế thứ Đời IV Chi Ất & hồ sơ xuất xứ bản sao (A.1046 · B02-00017, B02-00020)',
    verificationStatus: 'Đang xác minh',
    verificationNote: 'Đã ghi nhận vai trò nối truyền bản sao giữa các đời thuộc Chi Ất.',
    summary:
      'Ghi nhận thế hệ kế cận có vai trò bổ sung, tục biên thế thứ và lưu truyền tư liệu qua các thời kỳ.',
    portraitVerified: false,
  },
  {
    id: 'doi-5',
    characterCode: 'NV-BK-008',
    generation: 5,
    generationLabel: 'Đời V+',
    name: 'Hậu duệ Đời V+ — Nhánh chính & Tục biên cuối tập',
    tabooName: 'Chưa công bố tên húy (bảo lưu theo nguyên bản A.1046)',
    roleTitle: 'Thế hệ tục biên & kỵ nhật tổng hợp cuối tập (~Trang 82)',
    branch: 'truc-he',
    branchType: 'Nhánh chính',
    branchLabel: 'Nhánh chính · Tục biên',
    parentId: 'doi-4-a1',
    familyRelation: 'Con thuộc Đời IV chính chi (NV-BK-005); Nhánh kế tiếp cuối quyển A.1046',
    folioRange: 'Trang 81–82',
    targetPage: 82,
    sourceRef: 'Phần tục biên cuối tập & hậu ký (A.1046 · B02-00018)',
    verificationStatus: 'Đang xác minh',
    verificationNote: 'Đã liên kết đến trang cuối 81–82 của tập A.1046.',
    summary:
      'Tổng kết các ghi chú hậu ký, phụ lục thế thứ bổ sung ở những trang cuối cùng trong tổng số 82 trang của tập A.1046.',
    portraitVerified: false,
  },
  {
    id: 'doi-5-a2',
    characterCode: 'NV-BK-009',
    generation: 5,
    generationLabel: 'Đời V+',
    name: 'Hậu duệ Đời V — Chi Giáp phân nhánh thứ',
    tabooName: 'Chưa công bố tên húy (bảo lưu theo nguyên bản A.1046)',
    roleTitle: 'Nhánh tiếp nối các chi thiên cư & ngoại hôn',
    branch: 'chi-giap',
    branchType: 'Nhánh phụ',
    branchLabel: 'Nhánh phụ · Chi Giáp thứ Đời V',
    parentId: 'doi-4-a2',
    familyRelation: 'Con thuộc phân nhánh thứ Đời IV (NV-BK-006)',
    folioRange: 'Trang 73–75',
    targetPage: 74,
    sourceRef: 'Bảng kê thế thứ phân nhánh thứ (A.1046 · B02-00016)',
    verificationStatus: 'Đang xác minh',
    verificationNote: 'Hoàn thiện mạch nối Đời IV → Đời V cho phân nhánh thứ Chi Giáp.',
    summary:
      'Bảo đảm tính liên tục của cây phả hệ từ Đời IV phân nhánh thứ xuống các đời hậu duệ kế tiếp.',
    portraitVerified: false,
  },
  {
    id: 'doi-5-b1',
    characterCode: 'NV-BK-010',
    generation: 5,
    generationLabel: 'Đời V+',
    name: 'Hậu duệ Đời V — Chi Ất thủ từ bản quán',
    tabooName: 'Chưa công bố tên húy (bảo lưu theo nguyên bản A.1046)',
    roleTitle: 'Thế hệ kế thừa hương hỏa & bảo quản phả tại Bối Khê',
    branch: 'chi-at',
    branchType: 'Nhánh phụ',
    branchLabel: 'Nhánh phụ · Chi Ất Đời V',
    parentId: 'doi-4-b1',
    familyRelation: 'Con thuộc Đời IV Chi Ất (NV-BK-007)',
    folioRange: 'Trang 78–80',
    targetPage: 79,
    sourceRef: 'Bảng kê thế thứ Chi Ất kế thừa (A.1046 · B02-00017)',
    verificationStatus: 'Đang xác minh',
    verificationNote: 'Hoàn thiện mạch nối Đời IV → Đời V cho nhánh Chi Ất.',
    summary:
      'Ghi nhận thế hệ Đời V thuộc Chi Ất tiếp nối trách nhiệm trông nom từ đường và lưu giữ tư liệu gia phả tại quê gốc.',
    portraitVerified: false,
  },
];

const DOSSIER_BLUEPRINT: Array<{
  code: string;
  name: string;
  pages: string;
  primaryPage: number;
  type: DossierContentType;
  recordType: string;
  dating: string;
  physicalDescription: string;
  languageScript: string;
  originalCondition: string;
  attachments: string;
  genInfo: string;
  chars: string[];
  hanNom: string;
  phienAm: string;
  phienAmVerification: string;
  translation: string;
  dichNghiaVerification: string;
  relations: string;
  uncertainPoints: string;
  imagePath: string;
  referenceSource: string;
  isSample?: boolean;
}> = [
  {
    code: 'B02-00001',
    name: 'Tờ bìa và đề mục tổng quát tập Bối Khê Trạng nguyên gia phả (ký hiệu A.1046)',
    pages: 'Trang 01–02',
    primaryPage: 1,
    type: 'Phả tự & Mở đầu',
    recordType: 'Văn bản; bản chép tay mực nho trên giấy dó (bản sao truyền lục)',
    dating:
      'Chưa ghi năm sao lục trên tờ bìa; suy đoán khung niên đại cuối thế kỷ XIX – đầu thế kỷ XX theo danh mục thư viện Viện Nghiên cứu Hán Nôm (A.1046)',
    physicalDescription:
      'Sách chữ Hán đóng gáy chỉ trên giấy dó cổ, tờ bìa có đề mục lớn viết bằng mực nho 4 cột chính; mép giấy ngả vàng nhẹ và sờn góc trên bên phải khoảng 2 cm (ảnh hiển thị là minh họa cấu trúc).',
    languageScript: 'Hán',
    originalCondition:
      'Chưa khảo sát vật lý trực tiếp; theo đặc trưng bản sao giấy dó lưu kho, dự kiến ố vàng nhẹ, sờn gáy chỉ, nét mực còn đọc được.',
    attachments:
      'B02-00001-anh-01.jpg (toàn trang minh họa cấu trúc); chờ bổ sung -anh-02 đến -anh-05 (cận cảnh cột đề mục) và -anh-mat-sau khi được cấp phép sao chụp.',
    genInfo: 'Giới thiệu chung nguồn gốc dòng họ Nguyễn Bối Khê (Đời I · NV-BK-001)',
    chars: ['NV-BK-001', 'NV-BK-003'],
    hanNom: '貝溪狀元家譜 · 阮族譜 · 世系源流考記 · 原抄本傳錄藏於漢喃研究院 (A.1046).',
    phienAm:
      'Bối Khê Trạng nguyên gia phả · Nguyễn tộc phả · Thế hệ nguyên lưu khảo ký · Nguyên sao bản truyền lục tàng ư Hán Nôm nghiên cứu viện (A.1046).',
    phienAmVerification:
      'Đã kiểm cấu trúc phiên âm bởi Nguyễn Văn An (nhóm dự án B02) ngày 17/11/2026; chưa đối chiếu trực tiếp mặt chữ trên bản gốc A.1046.',
    translation:
      'Gia phả Trạng nguyên dòng họ Nguyễn ở Bối Khê — Phần tờ bìa, đề mục tổng quát và ghi chú bản sao lưu giữ tại Thư viện Viện Nghiên cứu Hán Nôm (ký hiệu A.1046).',
    dichNghiaVerification:
      'Chưa kiểm chuyên môn (mới dịch nghĩa tham khảo cấu trúc phục vụ học tập).',
    relations:
      'Thuộc bộ 21 bản ghi của tập A.1046 (~82 trang); mở đầu cho B02-00002 (Bài Phả tự) và liên kết ngược tới B02-00020 (Xuất xứ bản sao).',
    uncertainPoints:
      'Góc mép trái tờ bìa trên bản gốc có thể có lạc khoản ghi năm sao lục lại bản A.1046 nhưng chưa xác minh được khi chưa tiếp cận kho thư khố.',
    imagePath: ARCHIVE_IMAGES.heroManuscript,
    referenceSource:
      '1) Danh mục thư viện Viện Nghiên cứu Hán Nôm – Bối Khê Trạng nguyên gia phả, ký hiệu A.1046 (hannom.vass.gov.vn). 2) Nhiệm vụ số hóa và biên mục tài liệu gia phả – Viện Hàn lâm KHXH Việt Nam (vass.gov.vn).',
    isSample: true,
  },
  {
    code: 'B02-00002',
    name: 'Bài Phả tự thuật tổ đức nguyên lưu dòng họ Nguyễn hương Bối Khê',
    pages: 'Trang 03–06',
    primaryPage: 3,
    type: 'Phả tự & Mở đầu',
    recordType: 'Văn bản; bản chép tay mực nho lối chữ chân kết hợp hành thảo trên giấy dó',
    dating:
      'Chưa có niên hiệu tuyệt đối trong phần cấu trúc; căn cứ thể thức lời tựa truyền bản sao thuộc khối tư liệu A.1046 (khoảng cuối thế kỷ XIX – đầu XX)',
    physicalDescription:
      'Giấy dó ngả màu vàng nhạt, trình bày thành các cột dọc có khung kẻ dòng; mực nho rõ nét, một số chữ lạc khoản cuối bài viết thảo hơi mờ.',
    languageScript: 'Hán',
    originalCondition:
      'Chưa tiếp cận trực tiếp bản gốc; dự kiến hư hại nhẹ do thời gian (ố vàng, mòn mép lề), chữ cơ bản đọc được.',
    attachments:
      'B02-00002-anh-01.jpg (toàn trang minh họa cấu trúc); chờ bổ sung -anh-02 đến -anh-07 (cận cảnh từng cột bài tựa) và -anh-mat-sau.',
    genInfo: 'Bối cảnh sao lục từ gia phả cổ trước đó (NV-BK-001)',
    chars: ['NV-BK-001'],
    hanNom: '貝溪阮氏譜序 · 述祖德源流 · 追遠報本 · 謹重錄舊譜以垂後世.',
    phienAm:
      'Bối Khê Nguyễn thị phả tự · Thuật tổ đức nguyên lưu · Truy viễn báo bản · Cẩn trọng lục cựu phả dĩ thùy hậu thế.',
    phienAmVerification:
      'Đã kiểm cấu trúc phiên âm bởi Nguyễn Văn An (nhóm dự án B02) ngày 17/11/2026; phần chữ ký lạc khoản cuối tựa chưa kiểm trực tiếp.',
    translation:
      'Bài Phả tự trình bày duyên khởi biên soạn và lý do kính cẩn sao lục lại bản phả cũ để truyền trao cho con cháu hậu thế.',
    dichNghiaVerification: 'Chưa kiểm chuyên môn (cần đối chiếu văn bản học Hán Nôm).',
    relations:
      'Thuộc khối Phần I tập A.1046; nối tiếp ngay sau B02-00001 và dẫn trực tiếp sang B02-00003 (Khảo cứu hương quán Bối Khê).',
    uncertainPoints:
      'Danh tính cụ thể của người soạn lời tựa ở dòng lạc khoản cuối bài thường viết lối hành thảo, cần kiểm chứng trực tiếp trên bản gốc A.1046.',
    imagePath: ARCHIVE_IMAGES.specimenPlate,
    referenceSource:
      '1) Danh mục Viện Nghiên cứu Hán Nôm (A.1046). 2) Quy trình dịch thuật tài liệu Hán Nôm – Thư viện Khoa học Tổng hợp TP.HCM (thuvientphcm.gov.vn).',
    isSample: true,
  },
  {
    code: 'B02-00003',
    name: 'Khảo cứu địa vọng thôn Bối Khê và công đức Thủy tổ lập tộc dòng họ Nguyễn',
    pages: 'Trang 07–10',
    primaryPage: 7,
    type: 'Phả tự & Mở đầu',
    recordType: 'Văn bản; bản chép tay mực nho trên giấy dó',
    dating:
      'Chưa ghi năm lập tờ; căn cứ nội dung địa danh hành chính cũ thuộc phủ/huyện Thanh Oai, tỉnh Hà Đông / Hà Tây xưa trong bản A.1046',
    physicalDescription:
      'Tờ giấy dó ghi chép văn xuôi lịch sử dòng họ về đất phát tích Bối Khê; bề mặt có nếp gấp dọc giữa tờ đặc trưng của sách đóng gáy chỉ.',
    languageScript: 'Hán, Nôm (địa danh cổ)',
    originalCondition:
      'Chưa tiếp cận trực tiếp; dự kiến sờn nhẹ nếp gấp giữa trang và ố vàng mép ngoài.',
    attachments:
      'B02-00003-anh-01.jpg (ảnh minh họa bối cảnh di sản văn hóa Bối Khê); chờ bổ sung ảnh chụp toàn trang và cận cảnh khi tiếp cận A.1046.',
    genInfo: 'Đời I — Thủy tổ dòng họ Nguyễn Bối Khê (NV-BK-001)',
    chars: ['NV-BK-001'],
    hanNom: '青威縣貝溪鄉 · 世居地望考 · 始祖開基立業 · 遺澤綿延.',
    phienAm:
      'Thanh Oai huyện Bối Khê hương · Thế cư địa vọng khảo · Thủy tổ khai cơ lập nghiệp · Di trạch miên diên.',
    phienAmVerification:
      'Đã kiểm phần khung địa danh và cấu trúc câu bởi nhóm B02 (17/11/2026); một số chữ Nôm ghi tên đồng ruộng/xóm cổ chưa kiểm.',
    translation:
      'Khảo cứu địa vọng hương Bối Khê và công đức khai cơ lập tộc của Thủy tổ dòng họ Nguyễn tại bản quán.',
    dichNghiaVerification: 'Chưa kiểm chuyên môn.',
    relations:
      'Liên kết với nút Đời I NV-BK-001 và đối chiếu song hành cùng B02-00011 (Mở đầu Thế thứ Đời I).',
    uncertainPoints:
      'Ranh giới địa danh hành chính hương/xã Bối Khê qua các triều đại (xã Song Khê cũ, nay thuộc xã Tam Hưng, Thành phố Hà Nội) cần đối chiếu thêm địa chí.',
    imagePath: ARCHIVE_IMAGES.boikheCourtyard,
    referenceSource:
      '1) Danh mục Viện Nghiên cứu Hán Nôm (A.1046). 2) Tài liệu nghiệp vụ "Nguồn sử liệu gia phả" – Trung tâm Lưu trữ quốc gia (archives.org.vn).',
  },
  {
    code: 'B02-00004',
    name: 'Hành trạng khoa bảng bậc đại khoa Trạng nguyên dòng họ Nguyễn Bối Khê (Phần I)',
    pages: 'Trang 11–14',
    primaryPage: 11,
    type: 'Hành trạng Trạng nguyên',
    recordType: 'Văn bản; bản chép tay mực nho kèm chấm câu bằng son đỏ trên giấy dó',
    dating:
      'Phản ánh sự tích khoa bảng thời phong kiến (triều Trần – Lê theo truyền thống khoa bảng Bối Khê); bản sao chép lưu trữ A.1046 tại Viện Nghiên cứu Hán Nôm',
    physicalDescription:
      'Trang văn bản chép tiểu truyện nhân vật đỗ đại khoa, có ký hiệu son ngắt đoạn theo quy cách cổ; mép giấy hơi sờn do tra cứu nhiều.',
    languageScript: 'Hán',
    originalCondition: 'Chưa kiểm tra trực tiếp bản vật lý; dự kiến vết ố nhẹ quanh phần lề.',
    attachments:
      'B02-00004-anh-01.jpg (ảnh minh họa trang hành trạng khoa bảng); chờ bổ sung ảnh cận cảnh từng cột và mặt sau từ kho lưu trữ.',
    genInfo: 'Đời II – Đời III (NV-BK-002, NV-BK-003)',
    chars: ['NV-BK-002', 'NV-BK-003'],
    hanNom: '狀元及第行狀 · 科名遺事錄 · 博學鴻儒 · 歷朝典籍記載.',
    phienAm:
      'Trạng nguyên cập đệ hành trạng · Khoa danh di sự lục · Bác học hồng nho · Lịch triều điển tịch ký tải.',
    phienAmVerification:
      'Đã kiểm cấu trúc phiên âm bởi nhóm B02 ngày 17/11/2026; niên hiệu khoa thi chi tiết cần đối chiếu chính sử.',
    translation:
      'Ghi chép mở đầu hành trạng khoa bảng Bối Khê, quá trình học vấn và sự tích đỗ đạt bậc đại khoa Trạng nguyên.',
    dichNghiaVerification: 'Chưa kiểm chuyên môn.',
    relations:
      'Thuộc cụm hành trạng khoa bảng cùng B02-00005; kết nối tới nhánh chính Chi Giáp B02-00013 (Đời III).',
    uncertainPoints:
      'Chi tiết năm sinh mất và niên hiệu khoa thi trên tờ gốc cần đối chiếu chéo với Đăng khoa lục và văn bia Văn Miếu Quốc Tử Giám.',
    imagePath: ARCHIVE_IMAGES.folioScholarBiography,
    referenceSource:
      '1) Danh mục Viện Nghiên cứu Hán Nôm (A.1046). 2) Thư viện số Hán Nôm – Thư viện Quốc gia Việt Nam (hannom.nlv.gov.vn).',
  },
  {
    code: 'B02-00005',
    name: 'Hành trạng hoạn lộ, trước tác và giai thoại ứng đối Trạng nguyên Bối Khê (Phần II)',
    pages: 'Trang 15–18',
    primaryPage: 15,
    type: 'Hành trạng Trạng nguyên',
    recordType: 'Văn bản; bản chép tay mực nho trên giấy dó',
    dating:
      'Chưa xác định năm sao chép riêng; thuộc cùng tập bản sao A.1046 lưu giữ tại Viện Nghiên cứu Hán Nôm',
    physicalDescription:
      'Giấy dó truyền thống viết 6–8 cột mỗi trang, có đoạn trích thơ văn ứng đối chữ Hán; phần gáy sách có vết khâu chỉ đôi.',
    languageScript: 'Hán',
    originalCondition: 'Chưa tiếp cận trực tiếp; dự kiến hư hại nhẹ ở mép gáy chỉ.',
    attachments:
      'B02-00005-anh-01.jpg (ảnh minh họa trang hành trạng); chờ bổ sung ảnh chụp bản gốc A.1046 và cận cảnh cột thơ văn.',
    genInfo: 'Đời III — Chi Giáp (NV-BK-003)',
    chars: ['NV-BK-003'],
    hanNom: '科名仕宦實錄 · 奉使應對 · 著作詩文遺稿記.',
    phienAm: 'Khoa danh sĩ hoạn thực lục · Phụng sứ ứng đối · Trước tác thi văn di cảo ký.',
    phienAmVerification: 'Đã kiểm cấu trúc phiên âm bởi nhóm B02 ngày 17/11/2026.',
    translation:
      'Phần tiếp theo hành trạng khoa bảng, ghi nhận hoạn lộ, trước tác thi văn và giai thoại ứng đối lưu truyền.',
    dichNghiaVerification: 'Chưa kiểm chuyên môn.',
    relations: 'Tiếp nối B02-00004 và bổ trợ cho hồ sơ văn bia sắc phong B02-00006.',
    uncertainPoints:
      'Một số điển tích thơ văn ứng đối có thể có dị bản giữa gia phả và truyền thuyết dân gian địa phương.',
    imagePath: ARCHIVE_IMAGES.folioScholarBiography,
    referenceSource:
      '1) Danh mục Viện Nghiên cứu Hán Nôm (A.1046). 2) Thư viện số Hán Nôm – Hội Bảo tồn Di sản chữ Nôm (nomfoundation.org).',
  },
  {
    code: 'B02-00006',
    name: 'Sao lục văn bia ký và mỹ tự sắc phong lưu truyền trong dòng họ Nguyễn Bối Khê (Mục 1)',
    pages: 'Trang 19–22',
    primaryPage: 19,
    type: 'Hành trạng Trạng nguyên',
    recordType: 'Văn bản; bản chép tay sao lục lại từ văn bia đá và sắc phong cổ',
    dating:
      'Văn bản gốc phản ánh nhiều triều đại; bản sao trong tập A.1046 chưa ghi rõ năm chép lại',
    physicalDescription:
      'Trang giấy dó chép nguyên văn bia ký và lời văn sắc phong mỹ tự; do là bản sao giấy nên chỉ ghi lại lời văn, không giữ nguyên dấu ấn triện son bản chính.',
    languageScript: 'Hán',
    originalCondition: 'Chưa tiếp cận trực tiếp bản A.1046; dự kiến giấy ố vàng nhẹ.',
    attachments:
      'B02-00006-anh-01.jpg (ảnh minh họa trang văn bia & sắc phong); chờ bổ sung ảnh chụp tờ 19–22 từ Viện Nghiên cứu Hán Nôm.',
    genInfo: 'Đời III – Đời IV (NV-BK-003, NV-BK-005)',
    chars: ['NV-BK-003', 'NV-BK-005'],
    hanNom: '碑記勅封抄錄 · 宗族典故 · 勅封美字 · 歷代褒獎忠勤.',
    phienAm: 'Bi ký sắc phong sao lục · Tông tộc điển cố · Sắc phong mỹ tự · Lịch đại bao thưởng trung cần.',
    phienAmVerification:
      'Đã kiểm cấu trúc phiên âm hành chính Hán cổ bởi nhóm B02 ngày 17/11/2026; các mỹ tự cụ thể chưa kiểm trên bản gốc.',
    translation:
      'Sao lục các bài văn bia ký và sắc phong mỹ tự ghi nhận công lao trung cần của tiên tổ qua các triều đại.',
    dichNghiaVerification: 'Chưa kiểm chuyên môn.',
    relations: 'Liên kết chặt với B02-00007 (Mục 2 Cáo mệnh ân tứ) và B02-00004.',
    uncertainPoints:
      'Bản sao A.1046 không giữ nguyên hình dấu ấn triện hoặc kích thước thật của từng đạo sắc phong tiền thân.',
    imagePath: ARCHIVE_IMAGES.folioImperialStele,
    referenceSource:
      '1) Danh mục Viện Nghiên cứu Hán Nôm (A.1046). 2) Phương pháp dịch thuật tài liệu Hán Nôm – Thư viện KHTH TP.HCM (thuvientphcm.gov.vn).',
  },
  {
    code: 'B02-00007',
    name: 'Sao lục cáo mệnh ân tứ, gia ngôn ý hạnh và hương bình công luận (Mục 2)',
    pages: 'Trang 23–26',
    primaryPage: 23,
    type: 'Hành trạng Trạng nguyên',
    recordType: 'Văn bản; bản chép tay mực nho trên giấy dó',
    dating: 'Thuộc tập bản sao A.1046; niên đại sao lục cụ thể cần đối chiếu lạc khoản',
    physicalDescription:
      'Tập hợp văn bản hành chính – luân lý truyền thống viết thành cột dọc đều nét trên giấy dó cổ.',
    languageScript: 'Hán',
    originalCondition: 'Chưa khảo sát vật lý trực tiếp; dự kiến tình trạng tương đồng toàn tập A.1046.',
    attachments:
      'B02-00007-anh-01.jpg (ảnh minh họa văn bản sắc phong/cáo mệnh); chờ bổ sung ảnh chụp tờ 23–26.',
    genInfo: 'Đời III – Đời IV (NV-BK-003, NV-BK-005)',
    chars: ['NV-BK-003', 'NV-BK-005'],
    hanNom: '恩賜誥命 · 先祖嘉言懿行 · 鄉評公論錄.',
    phienAm: 'Ân tứ cáo mệnh · Tiên tổ gia ngôn ý hạnh · Hương bình công luận lục.',
    phienAmVerification: 'Đã kiểm cấu trúc phiên âm bởi nhóm B02 ngày 17/11/2026.',
    translation:
      'Tiếp tục tập hợp cáo mệnh ân tứ, gia ngôn ý hạnh và lời truyền tụng trong hương ước địa phương.',
    dichNghiaVerification: 'Chưa kiểm chuyên môn.',
    relations: 'Tiếp nối B02-00006 và dẫn sang quy điều thờ tự B02-00008.',
    uncertainPoints:
      'Một số từ ngữ hành chính cổ trong cáo mệnh cần đối chiếu với tự điển chức quan triều Lê – Nguyễn.',
    imagePath: ARCHIVE_IMAGES.folioImperialStele,
    referenceSource:
      '1) Danh mục Viện Nghiên cứu Hán Nôm (A.1046). 2) Thư viện KHTH TP.HCM – Dịch thuật tài liệu Hán Nôm.',
  },
  {
    code: 'B02-00008',
    name: 'Quy điều thờ tự từ đường, thống kê ruộng tế điền và gia huấn dòng họ Bối Khê',
    pages: 'Trang 27–30',
    primaryPage: 27,
    type: 'Biểu ghi & Hậu ký',
    recordType: 'Văn bản kết hợp biểu kê điền thổ; bản chép tay mực nho trên giấy dó',
    dating:
      'Ghi nhận thể lệ truyền thống nhiều đời; bản sao chép thuộc tập A.1046 (cần đối chiếu năm lập sổ tế điền trên bản gốc)',
    physicalDescription:
      'Trang giấy dó chia hàng cột kê tên xứ đồng, diện tích mẫu sào cổ và quy ước ngày giỗ tại từ đường; chữ số Hán Nôm viết nhỏ dưới cột chính.',
    languageScript: 'Hán, Nôm (tên xứ đồng và đơn vị đo cổ)',
    originalCondition:
      'Chưa kiểm tra trực tiếp; phần chữ chú thích diện tích ruộng tế điền viết nhỏ có thể mờ mực ở góc trang.',
    attachments:
      'B02-00008-anh-01.jpg (ảnh minh họa biểu bảng lệ tục thờ tự); chờ bổ sung ảnh chụp tờ 27–30.',
    genInfo: 'Chung cho các chi nhánh tại Bối Khê (NV-BK-004, NV-BK-005)',
    chars: ['NV-BK-004', 'NV-BK-005'],
    hanNom: '祠堂祀典規條 · 祭田紀數 · 孝悌為先 · 敦睦宗親家訓.',
    phienAm: 'Từ đường tự điển quy điều · Tế điền kỷ số · Hiếu đễ vi tiên · Đôn mục tông thân gia huấn.',
    phienAmVerification:
      'Đã kiểm phần quy điều chữ Hán bởi nhóm B02 (17/11/2026); tên chữ Nôm các xứ đồng và số đo mẫu sào chưa kiểm.',
    translation:
      'Quy điều thờ tự tại từ đường, sổ ruộng tế điền hương hỏa và gia huấn răn dạy đạo hiếu nghĩa trong tộc.',
    dichNghiaVerification: 'Chưa kiểm chuyên môn (cần bảng quy đổi đơn vị đo ruộng đất cổ).',
    relations: 'Liên kết trực tiếp với nhánh thủ từ Chi Ất B02-00014 (Đời III) và NV-BK-004.',
    uncertainPoints:
      'Chữ viết tắt đơn vị mẫu – sào – thước – tấc cổ và tên Nôm các xứ đồng tại xã Tam Hưng cần chuyên gia địa danh cổ xác minh.',
    imagePath: ARCHIVE_IMAGES.folioRitualTable,
    referenceSource:
      '1) Danh mục Viện Nghiên cứu Hán Nôm (A.1046). 2) Trung tâm Lưu trữ quốc gia – Nguồn sử liệu gia phả.',
  },
  {
    code: 'B02-00009',
    name: 'Liệt truyện các bậc khoa danh và chức sắc Đời IV (Mục 1)',
    pages: 'Trang 31–34',
    primaryPage: 31,
    type: 'Hành trạng Trạng nguyên',
    recordType: 'Văn bản; bản chép tay mực nho trên giấy dó',
    dating: 'Thuộc khối liệt truyện Phần I tập A.1046; niên đại sao lục chờ xác minh thêm',
    physicalDescription:
      'Giấy dó đóng gáy chỉ viết lối chữ chân rõ ràng, mỗi nhân vật tách bằng vòng son hoặc khoảng trống đầu cột.',
    languageScript: 'Hán',
    originalCondition: 'Chưa khảo sát vật lý trực tiếp; dự kiến tình trạng bảo quản ổn định.',
    attachments:
      'B02-00009-anh-01.jpg (ảnh minh họa quy trình số hóa trang liệt truyện); chờ bổ sung ảnh gốc A.1046.',
    genInfo: 'Đời IV — Chi Giáp (NV-BK-005)',
    chars: ['NV-BK-005'],
    hanNom: '歷代科宦列傳 · 先賢行實 · 出仕為官 · 清廉守職傳家.',
    phienAm: 'Lịch đại khoa hoạn liệt truyện · Tiên hiền hành thực · Xuất sĩ vi quan · Thanh liêm thủ chức truyền gia.',
    phienAmVerification: 'Đã kiểm cấu trúc phiên âm bởi nhóm B02 ngày 17/11/2026.',
    translation:
      'Tiểu truyện các bậc đỗ đạt, làm quan thanh liêm và giữ gìn truyền thống khoa bảng thuộc Đời IV Chi Giáp.',
    dichNghiaVerification: 'Chưa kiểm chuyên môn.',
    relations: 'Tiếp nối bởi B02-00010 và đối chiếu chéo với bảng thế thứ Đời IV B02-00015.',
    uncertainPoints:
      'Một số tự dạng kiêng húy trong tên quan chức triều Lê – Nguyễn cần chú giải phiên âm cẩn trọng.',
    imagePath: ARCHIVE_IMAGES.digitizationStudio,
    referenceSource:
      '1) Danh mục Viện Nghiên cứu Hán Nôm (A.1046). 2) Viện Nghiên cứu Hán Nôm – Nhiệm vụ số hóa và biên mục tài liệu gia phả.',
  },
  {
    code: 'B02-00010',
    name: 'Liệt truyện hậu tiến khoa danh kết thúc Phần I tập A.1046 (Mục 2)',
    pages: 'Trang 35–42',
    primaryPage: 37,
    type: 'Hành trạng Trạng nguyên',
    recordType: 'Văn bản; bản chép tay mực nho trên giấy dó',
    dating: 'Thuộc phần cuối nửa đầu tập A.1046; khung niên đại bản sao cuối XIX – đầu XX',
    physicalDescription:
      'Khối trang kết thúc Phần I trước khi chuyển sang bảng kê thế thứ; ở cuối trang 42 có dòng chuyển tiếp quyển.',
    languageScript: 'Hán',
    originalCondition: 'Chưa tiếp cận trực tiếp; cần kiểm tra kỹ mép gáy trang chuyển tiếp 42–43.',
    attachments:
      'B02-00010-anh-01.jpg (ảnh minh họa không gian lưu trữ Phần I); chờ bổ sung ảnh chụp tờ 35–42.',
    genInfo: 'Đời IV — Kết thúc Phần I (NV-BK-005)',
    chars: ['NV-BK-005'],
    hanNom: '後進科名 · 承繼家學 · 前編完卷轉入世次.',
    phienAm: 'Hậu tiến khoa danh · Thừa kế gia học · Tiền biên hoàn quyển chuyển nhập thế thứ.',
    phienAmVerification: 'Đã kiểm cấu trúc phiên âm bởi nhóm B02 ngày 17/11/2026.',
    translation:
      'Hoàn thành phần liệt truyện các bậc khoa danh Đời IV, khép lại Phần I để chuyển sang Phần II (Thế thứ).',
    dichNghiaVerification: 'Chưa kiểm chuyên môn.',
    relations:
      'Khép lại Phần I (B02-00001 đến B02-00010) và mở đường sang Phần II Thế thứ tại bản ghi B02-00011.',
    uncertainPoints:
      'Dòng chuyển tiếp cuối trang 42 trên bản gốc có thể ghi chú số trang hoặc người tục biên nhưng chưa đối chiếu được vật lý.',
    imagePath: ARCHIVE_IMAGES.readingRoom,
    referenceSource:
      '1) Danh mục Viện Nghiên cứu Hán Nôm (A.1046). 2) Trường ĐH Khoa học – ĐH Thái Nguyên (khcb.tnus.edu.vn).',
  },
  {
    code: 'B02-00011',
    name: 'Mở đầu phần Bối Khê Nguyễn tộc gia phả thế thứ — Đệ nhất thế Thủy tổ',
    pages: 'Trang 43–46',
    primaryPage: 43,
    type: 'Thế thứ dòng họ',
    recordType: 'Văn bản kết hợp sơ đồ thế thứ; bản chép tay mực nho và chu sa trên giấy dó',
    dating:
      'Thuộc nửa sau tập A.1046; là cấu trúc gốc để lập sơ đồ thế hệ từ Đời I trở xuống',
    physicalDescription:
      'Trang giấy dó trình bày theo khung thế thứ có đường nối phân tầng tôn ti chiêu mục, chia rõ cột Đệ nhất thế, phối thất và kỵ nhật.',
    languageScript: 'Hán, Nôm',
    originalCondition: 'Chưa tiếp cận trực tiếp bản gốc; dự kiến giấy ố vàng nhẹ, nét chữ còn đọc được.',
    attachments:
      'B02-00011-anh-01.jpg (ảnh sơ đồ minh họa cấu trúc thế thứ); chờ bổ sung ảnh chụp tờ 43–46 từ kho lưu trữ.',
    genInfo: 'Đời I — Thiết lập hệ thống thế thứ (NV-BK-001, NV-BK-002)',
    chars: ['NV-BK-001', 'NV-BK-002'],
    hanNom: '貝溪阮族家譜世次 · 第一世 · 始祖考諱 · 尊卑有序 · 昭穆分明.',
    phienAm: 'Bối Khê Nguyễn tộc gia phả thế thứ · Đệ nhất thế · Thủy tổ khảo húy · Tôn ti hữu tự · Chiêu mục phân minh.',
    phienAmVerification:
      'Đã kiểm cấu trúc phiên âm bởi nhóm B02 ngày 17/11/2026; tên húy cụ thể của Thủy tổ chưa công bố.',
    translation:
      'Mở đầu phần Thế thứ dòng họ Nguyễn ở Bối Khê, xác lập thứ bậc Đời I Thủy tổ làm gốc cho toàn bộ cây phả hệ.',
    dichNghiaVerification: 'Chưa kiểm chuyên môn.',
    relations:
      'Bản ghi bản lề của Phần II; liên kết với B02-00001, B02-00003 và dẫn xuống B02-00012 (Đời II).',
    uncertainPoints:
      'Tên húy Thủy tổ và ngày kỵ nhật chi tiết cần giữ nguyên nguyên tắc bảo lưu chờ đối chiếu trực tiếp bản A.1046.',
    imagePath: ARCHIVE_IMAGES.genealogyDiagram,
    referenceSource:
      '1) Danh mục Viện Nghiên cứu Hán Nôm (A.1046). 2) Viện Hàn lâm KHXH Việt Nam – Nghiên cứu, số hóa và biên mục tài liệu gia phả.',
    isSample: true,
  },
  {
    code: 'B02-00012',
    name: 'Bảng kê thế thứ Đời thứ hai (Đệ nhị thế) — Chính hệ phân nhánh Giáp – Ất',
    pages: 'Trang 47–51',
    primaryPage: 47,
    type: 'Thế thứ dòng họ',
    recordType: 'Văn bản kết hợp sơ đồ phân chi; bản chép tay mực nho trên giấy dó',
    dating: 'Thuộc khối Thế thứ Phần II tập A.1046',
    physicalDescription:
      'Trang ghi chép Đệ nhị thế có chú thích nhỏ bên cạnh cột chính về phối ngẫu, năm sinh mất và điểm phân chia hai nhánh Giáp – Ất.',
    languageScript: 'Hán, Nôm',
    originalCondition: 'Chưa tiếp cận trực tiếp; phần chữ chú nhỏ bên lề dễ mờ nét.',
    attachments:
      'B02-00012-anh-01.jpg (ảnh minh họa trang thế thứ nối truyền); chờ bổ sung ảnh chụp tờ 47–51.',
    genInfo: 'Đời II (NV-BK-002)',
    chars: ['NV-BK-002'],
    hanNom: '第二世世次 · 承傳正系錄 · 分枝甲乙兩派 · 世系相承.',
    phienAm: 'Đệ nhị thế thế thứ · Thừa truyền chính hệ lục · Phân chi Giáp Ất lưỡng phái · Thế hệ tương thừa.',
    phienAmVerification: 'Đã kiểm cấu trúc phiên âm bởi nhóm B02 ngày 17/11/2026.',
    translation:
      'Bảng kê thế thứ Đời thứ hai thuộc trục chính hệ, ghi nhận sự phân chia thành Chi Giáp và Chi Ất.',
    dichNghiaVerification: 'Chưa kiểm chuyên môn.',
    relations: 'Nối tiếp B02-00011 (Đời I) và tách nhánh xuống B02-00013 (Chi Giáp) cùng B02-00014 (Chi Ất).',
    uncertainPoints:
      'Họ tên phối thất và can chi ngày giỗ ở dòng chữ nhỏ Đời II cần đối chiếu bản gốc để không nhầm nét.',
    imagePath: ARCHIVE_IMAGES.folioChiAtLineage,
    referenceSource:
      '1) Danh mục Viện Nghiên cứu Hán Nôm (A.1046). 2) Trung tâm Lưu trữ quốc gia – Nguồn sử liệu gia phả.',
  },
  {
    code: 'B02-00013',
    name: 'Bảng kê thế thứ Đời thứ ba (Đệ tam thế) — Nhánh chính Chi Giáp',
    pages: 'Trang 52–58',
    primaryPage: 52,
    type: 'Thế thứ dòng họ',
    recordType: 'Văn bản kết hợp sơ đồ nhánh; bản chép tay mực nho và son đỏ trên giấy dó',
    dating: 'Thuộc khối Thế thứ Phần II tập A.1046',
    physicalDescription:
      'Trình bày thế thứ Đời III Chi Giáp bằng khung chữ đóng ô nối nét chu sa theo nhánh trưởng, kèm dẫn chiếu sang phần Hành trạng đầu sách.',
    languageScript: 'Hán',
    originalCondition: 'Chưa tiếp cận trực tiếp; dự kiến tình trạng ổn định.',
    attachments:
      'B02-00013-anh-01.jpg (ảnh sơ đồ minh họa nhánh Chi Giáp); chờ bổ sung ảnh chụp tờ 52–58.',
    genInfo: 'Đời III — Nhánh chính Chi Giáp (NV-BK-003)',
    chars: ['NV-BK-003'],
    hanNom: '第三世 · 甲支正派世次 · 科舉顯達 · 並參前編行狀.',
    phienAm: 'Đệ tam thế · Giáp chi chính phái thế thứ · Khoa cử hiển đạt · Tịnh tham tiền biên hành trạng.',
    phienAmVerification: 'Đã kiểm cấu trúc phiên âm bởi nhóm B02 ngày 17/11/2026.',
    translation:
      'Bảng kê thế thứ Đời thứ ba thuộc nhánh chính Chi Giáp, đối chiếu chéo với tiểu truyện ở Phần I.',
    dichNghiaVerification: 'Chưa kiểm chuyên môn.',
    relations:
      'Con của B02-00012; đối chiếu chéo với B02-00004/B02-00005; nối xuống B02-00015 và B02-00016.',
    uncertainPoints:
      'Một số nhân vật ghi đồng thời tên húy, tên tự và thụy hiệu trong ô hẹp, cần tách chính xác khi hiệu đính bản gốc.',
    imagePath: ARCHIVE_IMAGES.folioLineageTree,
    referenceSource:
      '1) Danh mục Viện Nghiên cứu Hán Nôm (A.1046). 2) Thư viện số Hán Nôm – Thư viện Quốc gia Việt Nam.',
  },
  {
    code: 'B02-00014',
    name: 'Bảng kê thế thứ Đời thứ ba (Đệ tam thế) — Nhánh phụ Chi Ất thủ từ bản quán',
    pages: 'Trang 59–64',
    primaryPage: 59,
    type: 'Thế thứ dòng họ',
    recordType: 'Văn bản; bản chép tay mực nho trên giấy dó',
    dating: 'Thuộc khối Thế thứ Phần II tập A.1046',
    physicalDescription:
      'Trang ghi thế thứ Chi Ất cư trú tại bản quán Bối Khê, ghi rõ phân công giữ từ đường, hương hỏa và vị trí phần mộ.',
    languageScript: 'Hán, Nôm',
    originalCondition: 'Chưa tiếp cận trực tiếp; phần ghi chú vị trí phần mộ viết nét nhỏ.',
    attachments:
      'B02-00014-anh-01.jpg (ảnh minh họa bảng hương hỏa Chi Ất); chờ bổ sung ảnh chụp tờ 59–64.',
    genInfo: 'Đời III — Nhánh phụ Chi Ất (NV-BK-004)',
    chars: ['NV-BK-004'],
    hanNom: '第三世 · 乙支守祠世次 · 居守鄉貫 · 奉事祖先香火.',
    phienAm: 'Đệ tam thế · Ất chi thủ từ thế thứ · Cư thủ hương quán · Phụng sự tổ tiên hương hỏa.',
    phienAmVerification: 'Đã kiểm cấu trúc phiên âm bởi nhóm B02 ngày 17/11/2026.',
    translation:
      'Bảng kê thế thứ Đời thứ ba nhánh phụ Chi Ất đảm trách trông nom từ đường và hương hỏa tại quê gốc Bối Khê.',
    dichNghiaVerification: 'Chưa kiểm chuyên môn.',
    relations: 'Con của B02-00012; đối chiếu với B02-00008 (Tế điền) và nối xuống B02-00017.',
    uncertainPoints:
      'Thuật ngữ cổ chỉ hướng mộ phần và tên Nôm gò đống địa phương cần khảo sát thêm tại xã Tam Hưng.',
    imagePath: ARCHIVE_IMAGES.folioRitualTable,
    referenceSource:
      '1) Danh mục Viện Nghiên cứu Hán Nôm (A.1046). 2) Trung tâm Lưu trữ quốc gia – Nguồn sử liệu gia phả.',
  },
  {
    code: 'B02-00015',
    name: 'Bảng kê thế thứ Đời thứ tư (Đệ tứ thế) — Chi Giáp chính chi',
    pages: 'Trang 65–70',
    primaryPage: 65,
    type: 'Thế thứ dòng họ',
    recordType: 'Văn bản kết hợp sơ đồ thế thứ; bản chép tay mực nho trên giấy dó',
    dating: 'Thuộc khối Thế thứ Phần II tập A.1046',
    physicalDescription:
      'Trang thế hệ Đời IV Chi Giáp chính chi ghi thứ bậc con trưởng – con thứ và năm sinh mất theo hệ can chi.',
    languageScript: 'Hán',
    originalCondition: 'Chưa tiếp cận trực tiếp; dự kiến tình trạng bảo quản bình thường.',
    attachments:
      'B02-00015-anh-01.jpg (ảnh sơ đồ minh họa Đời IV); chờ bổ sung ảnh chụp tờ 65–70.',
    genInfo: 'Đời IV — Chi Giáp chính chi (NV-BK-005)',
    chars: ['NV-BK-005'],
    hanNom: '第四世 · 甲支正枝世系 · 承前啟後 · 錄子孫名位.',
    phienAm: 'Đệ tứ thế · Giáp chi chính chi thế hệ · Thừa tiền khải hậu · Lục tử tôn danh vị.',
    phienAmVerification: 'Đã kiểm cấu trúc phiên âm bởi nhóm B02 ngày 17/11/2026.',
    translation:
      'Bảng kê thế thứ Đời thứ tư thuộc chính chi Chi Giáp, nối tiếp trực hệ xuống thế hệ Đời V+.',
    dichNghiaVerification: 'Chưa kiểm chuyên môn.',
    relations: 'Nối tiếp B02-00013 (Đời III Chi Giáp) và nối xuống B02-00018 (Tục biên Đời V+).',
    uncertainPoints:
      'Can chi năm sinh mất 60 năm quay vòng một lần, cần gắn đúng triều đại để tránh sai lệch khi quy đổi dương lịch.',
    imagePath: ARCHIVE_IMAGES.genealogyDiagram,
    referenceSource:
      '1) Danh mục Viện Nghiên cứu Hán Nôm (A.1046). 2) Viện Hàn lâm KHXH Việt Nam – Biên mục tài liệu gia phả.',
  },
  {
    code: 'B02-00016',
    name: 'Bảng kê thế thứ Đời thứ tư – năm — Chi Giáp phân nhánh thứ và các chi thiên cư',
    pages: 'Trang 71–75',
    primaryPage: 71,
    type: 'Thế thứ dòng họ',
    recordType: 'Văn bản kết hợp sơ đồ nhánh thứ; bản chép tay mực nho trên giấy dó',
    dating: 'Thuộc khối Thế thứ Phần II tập A.1046',
    physicalDescription:
      'Ghi nhận các phân nhánh thứ, quan hệ thông gia ngoại tộc và địa điểm chuyển cư bằng chữ Hán xen chữ Nôm.',
    languageScript: 'Hán, Nôm',
    originalCondition: 'Chưa tiếp cận trực tiếp; dự kiến một số chữ Nôm viết thảo hơi khó đọc.',
    attachments:
      'B02-00016-anh-01.jpg (ảnh sơ đồ phân nhánh thứ); chờ bổ sung ảnh chụp tờ 71–75.',
    genInfo: 'Đời IV & Đời V — Phân nhánh thứ (NV-BK-006, NV-BK-009)',
    chars: ['NV-BK-006', 'NV-BK-009'],
    hanNom: '第四世 · 甲支次派分枝 · 姻親外族 · 遷居支派記.',
    phienAm: 'Đệ tứ thế · Giáp chi thứ phái phân chi · Nhân thân ngoại tộc · Thiên cư chi phái ký.',
    phienAmVerification:
      'Đã kiểm cấu trúc phiên âm bởi nhóm B02 (17/11/2026); địa danh Nôm các xóm chuyển cư chưa kiểm.',
    translation:
      'Ghi chép phân nhánh thứ Đời IV Chi Giáp, quan hệ ngoại hôn, phân cư và thế hệ kế tiếp Đời V.',
    dichNghiaVerification: 'Chưa kiểm chuyên môn.',
    relations: 'Phân nhánh từ B02-00013 (NV-BK-003); liên kết các nút NV-BK-006 và NV-BK-009.',
    uncertainPoints:
      'Tên thôn xóm thiên cư ghi bằng chữ Nôm cổ dễ có nhiều cách đọc âm địa phương khác nhau.',
    imagePath: ARCHIVE_IMAGES.folioLineageTree,
    referenceSource:
      '1) Danh mục Viện Nghiên cứu Hán Nôm (A.1046). 2) Hội Bảo tồn Di sản chữ Nôm (nomfoundation.org).',
  },
  {
    code: 'B02-00017',
    name: 'Bảng kê thế thứ Đời thứ tư – năm — Nhánh Chi Ất bảo quản và tục biên gia phả',
    pages: 'Trang 76–80',
    primaryPage: 76,
    type: 'Thế thứ dòng họ',
    recordType: 'Văn bản; bản chép tay mực nho trên giấy dó',
    dating: 'Thuộc phần cuối khối Thế thứ tập A.1046',
    physicalDescription:
      'Ghi thế thứ Đời IV–V nhánh Chi Ất cùng đoạn ghi chú người đảm trách sao lục, bảo tồn bản phả cũ qua các biến động.',
    languageScript: 'Hán, Nôm',
    originalCondition: 'Chưa tiếp cận trực tiếp; dự kiến ố vàng nhẹ ở mép trang cuối.',
    attachments:
      'B02-00017-anh-01.jpg (ảnh minh họa trang Chi Ất kế thừa); chờ bổ sung ảnh chụp tờ 76–80.',
    genInfo: 'Đời IV & Đời V — Nhánh phụ Chi Ất (NV-BK-007, NV-BK-010)',
    chars: ['NV-BK-007', 'NV-BK-010'],
    hanNom: '第四世 · 乙支承繼及續編 · 重抄保存 · 續補世系不絕.',
    phienAm: 'Đệ tứ thế · Ất chi thừa kế cập tục biên · Trọng sao bảo tồn · Tục bổ thế hệ bất tuyệt.',
    phienAmVerification: 'Đã kiểm cấu trúc phiên âm bởi nhóm B02 ngày 17/11/2026.',
    translation:
      'Thế thứ Đời IV–V nhánh Chi Ất, nêu rõ vai trò sao lục bảo quản bản phả cũ qua các thời kỳ.',
    dichNghiaVerification: 'Chưa kiểm chuyên môn.',
    relations: 'Nối tiếp B02-00014 (Chi Ất Đời III) và liên kết chặt với hồ sơ xuất xứ B02-00020.',
    uncertainPoints:
      'Mối quan hệ cụ thể giữa người sao lục bản tiền thân trong Chi Ất và bản A.1046 đang lưu kho cần kiểm chứng thêm.',
    imagePath: ARCHIVE_IMAGES.folioChiAtLineage,
    referenceSource:
      '1) Danh mục Viện Nghiên cứu Hán Nôm (A.1046). 2) Viện Nghiên cứu Hán Nôm – Biên mục tài liệu gia phả.',
  },
  {
    code: 'B02-00018',
    name: 'Phần tục biên từ Đời V trở xuống, hậu ký và bảng kỵ nhật tổng hợp cuối tập A.1046',
    pages: 'Trang 81–82',
    primaryPage: 82,
    type: 'Biểu ghi & Hậu ký',
    recordType: 'Văn bản; bản chép tay mực nho (có khả năng thêm bút tích tục biên đời sau) trên giấy dó',
    dating:
      'Khối kết thúc tập A.1046 (~82 trang); phần tục biên thường chép bổ sung muộn hơn phần chính văn',
    physicalDescription:
      'Hai tờ cuối sách gồm bảng kỵ nhật tổng hợp và lời hậu ký; trang cuối sách cổ thường chịu tác động ẩm mốc, sờn gáy hoặc rách nhẹ góc mép.',
    languageScript: 'Hán, Nôm',
    originalCondition:
      'Chưa tiếp cận trực tiếp; trang cuối sách cổ thường dễ bị mòn góc và ố vàng đậm hơn các trang ruột.',
    attachments:
      'B02-00018-anh-01.jpg (ảnh minh họa hồ sơ hậu ký cuối tập); chờ bổ sung ảnh chụp tờ 81–82 và mặt bìa sau.',
    genInfo: 'Đời V+ — Cuối tập A.1046 (NV-BK-008)',
    chars: ['NV-BK-008'],
    hanNom: '第五世以下續編 · 卷末後記 · 全書八十二葉 · 忌日總錄附後.',
    phienAm: 'Đệ ngũ thế dĩ hạ tục biên · Quyển mạt hậu ký · Toàn thư bát thập nhị diệp · Kỵ nhật tổng lục phụ hậu.',
    phienAmVerification: 'Đã kiểm cấu trúc phiên âm bởi nhóm B02 ngày 17/11/2026.',
    translation:
      'Phần tục biên các đời kế tiếp, lời hậu ký cuối tập A.1046 và bảng tổng hợp kỵ nhật các chi.',
    dichNghiaVerification: 'Chưa kiểm chuyên môn.',
    relations: 'Khép lại chuỗi trang B02-00181 – B02-00182; nối tiếp B02-00015 và B02-00017.',
    uncertainPoints:
      'Số trang thực tế cuối tập (~82 trang theo danh mục tham khảo) và các chữ tàn khuyết ở tờ bạt cuối chỉ xác nhận chắc chắn khi mở quyển gốc.',
    imagePath: ARCHIVE_IMAGES.archivalDossier,
    referenceSource:
      '1) Danh mục Viện Nghiên cứu Hán Nôm (A.1046). 2) Trường ĐH Khoa học – ĐH Thái Nguyên (khcb.tnus.edu.vn).',
  },
  {
    code: 'B02-00019',
    name: 'Hồ sơ khảo dị chữ kiêng húy và chú giải thuật ngữ Hán Nôm trong tập A.1046',
    pages: 'Trang 01–82 (Đối chiếu)',
    primaryPage: 1,
    type: 'Biểu ghi & Hậu ký',
    recordType: 'Văn bản tổng hợp chuyên đề văn bản học; tài liệu số hóa nghiên cứu',
    dating:
      'Biên soạn năm 2026 dựa trên quy tắc kiêng húy triều Lê – Nguyễn phản ánh trong văn bản A.1046',
    physicalDescription:
      'Bảng đối chiếu số hóa các tự dạng nghi vấn, chữ viết bớt nét và thuật ngữ chức tước, địa danh xuất hiện xuyên suốt 82 trang.',
    languageScript: 'Hán, Nôm, tiếng Việt',
    originalCondition: 'Hồ sơ nghiên cứu số hóa bổ trợ (không phải bản gốc cổ).',
    attachments:
      'B02-00019-anh-01.jpg (ảnh minh họa quy trình khảo đính văn bản); dữ liệu đối chiếu gắn kèm các thẻ Điểm chưa rõ trên 82 trang.',
    genInfo: 'Tổng hợp toàn bộ các đời trong tập A.1046 (NV-BK-001, NV-BK-005)',
    chars: ['NV-BK-001', 'NV-BK-005'],
    hanNom: '諱字避諱考異 · 漢喃古字釋義彙編 (01–82頁).',
    phienAm: 'Húy tự tị húy khảo dị · Hán Nôm cổ tự thích nghĩa vựng biên (01–82 diệp).',
    phienAmVerification: 'Đã kiểm hệ thống ký hiệu khung bởi nhóm B02 ngày 17/11/2026.',
    translation:
      'Bảng khảo dị chữ viết kiêng húy thời Lê – Nguyễn, từ vựng chức tước và niên đại lịch sử xuất hiện xuyên suốt 82 trang.',
    dichNghiaVerification: 'Chưa kiểm chuyên môn (đang mở rộng theo tiến độ kiểm chứng).',
    relations: 'Liên kết chéo toàn bộ các bản ghi có ghi nhận mục Điểm chưa rõ từ B02-00001 đến B02-00018.',
    uncertainPoints:
      'Các trường hợp chữ kiêng húy đặc thù ở cấp họ/địa phương chỉ giải mã đầy đủ khi đọc nguyên bản.',
    imagePath: ARCHIVE_IMAGES.digitizationStudio,
    referenceSource:
      '1) Hội Bảo tồn Di sản chữ Nôm (nomfoundation.org). 2) Thư viện Khoa học Tổng hợp TP.HCM – Dịch thuật tài liệu Hán Nôm.',
  },
  {
    code: 'B02-00020',
    name: 'Hồ sơ đối chiếu danh mục thư viện và xuất xứ bản sao truyền lục A.1046',
    pages: 'Toàn tập (01 đơn vị)',
    primaryPage: 2,
    type: 'Pháp lý & Lưu trữ',
    recordType: 'Văn bản hành chính – thư mục lưu trữ; tài liệu số hóa',
    dating: 'Biên mục tham chiếu cập nhật ngày 17/11/2026',
    physicalDescription:
      'Hồ sơ xác định địa chỉ đơn vị lưu giữ theo đơn vị hành chính hai cấp hiện nay và đối chiếu địa danh lưu trữ cũ trong thư mục.',
    languageScript: 'Tiếng Việt (kèm trích dẫn ký hiệu Hán Nôm A.1046)',
    originalCondition: 'Hồ sơ lưu trữ số hóa của dự án B02.',
    attachments: 'B02-00020-anh-01.jpg (ảnh minh họa không gian thư viện lưu trữ A.1046).',
    genInfo: 'Thông tin lưu trữ & truyền bản (NV-BK-007)',
    chars: ['NV-BK-007'],
    hanNom: '漢喃研究院書庫目錄 · 記號 A.1046 · 原抄本傳錄考實.',
    phienAm: 'Hán Nôm nghiên cứu viện thư khố mục lục · Ký hiệu A.1046 · Nguyên sao bản truyền lục khảo thực.',
    phienAmVerification: 'Đã kiểm đối chiếu thông tin danh mục thư viện ngày 17/11/2026.',
    translation:
      'Hồ sơ xác minh xuất xứ danh mục thư viện của 01 đơn vị tư liệu A.1046 (địa chỉ hai cấp: 183 Đặng Tiến Đông, phường Đống Đa, Thành phố Hà Nội; địa chỉ cũ: phường Trung Liệt, quận Đống Đa, Hà Nội).',
    dichNghiaVerification: 'Đã kiểm đối chiếu thông tin thư mục.',
    relations: 'Liên kết trực tiếp với B02-00001 (Tờ bìa) và B02-00021 (Hồ sơ pháp lý & quyền công bố).',
    uncertainPoints:
      'Địa chỉ liên hệ trực tiếp và lịch tiếp nhận độc giả sau sắp xếp đơn vị hành chính cần xác nhận lại với Thư viện Viện Nghiên cứu Hán Nôm trước khi đến khảo sát.',
    imagePath: ARCHIVE_IMAGES.readingRoom,
    referenceSource:
      '1) Viện Nghiên cứu Hán Nôm (hannom.vass.gov.vn/ky-hieu). 2) Trường ĐH Khoa học – ĐH Thái Nguyên (khcb.tnus.edu.vn).',
  },
  {
    code: 'B02-00021',
    name: 'Hồ sơ xác minh pháp lý, phạm vi được phép công bố và phần không công bố (Dự án B02)',
    pages: 'Toàn tập (~82 trang)',
    primaryPage: 1,
    type: 'Pháp lý & Lưu trữ',
    recordType: 'Văn bản pháp lý – đạo đức lưu trữ; tài liệu số hóa',
    dating: 'Xác lập và cập nhật ngày 17/11/2026 (áp dụng Điều 63 Luật Di sản văn hóa / Luật Lưu trữ 2024)',
    physicalDescription:
      'Hồ sơ tổng hợp phạm vi được phép công bố học tập phi lợi nhuận, quy tắc không cho tải ảnh độ phân giải cao và danh mục thông tin không công bố.',
    languageScript: 'Tiếng Việt',
    originalCondition: 'Hồ sơ pháp lý số hóa nội bộ dự án B02.',
    attachments:
      'B02-00021-anh-01.jpg (ảnh minh họa hồ sơ biên mục lưu trữ); chờ bổ sung ảnh chụp công văn/phiếu xác nhận của Viện Nghiên cứu Hán Nôm khi tiếp nhận phản hồi chính thức.',
    genInfo: 'Hồ sơ pháp lý & chứng thực quyền sử dụng tại Viện Nghiên cứu Hán Nôm',
    chars: ['NV-BK-001', 'NV-BK-002', 'NV-BK-003', 'NV-BK-004', 'NV-BK-005', 'NV-BK-006', 'NV-BK-007', 'NV-BK-008', 'NV-BK-009', 'NV-BK-010'],
    hanNom: '非營利學術數位化專案 B02 · 版權及公開使用權限確認檔案.',
    phienAm: 'Phi doanh lợi học thuật số vị hóa chuyên án B02 · Bản quyền cập công khai sử dụng quyền hạn xác nhận đương án.',
    phienAmVerification: 'Đã rà soát hồ sơ pháp lý và quy định phạm vi công bố ngày 17/11/2026.',
    translation:
      'Hồ sơ tổng hợp trạng thái pháp lý, phân loại bản đang hiển thị theo Điều 63 Luật 2024, phạm vi được phép công bố phi lợi nhuận và phần không công bố của dự án B02.',
    dichNghiaVerification: 'Đã rà soát khung pháp lý dự án học tập phi lợi nhuận.',
    relations: 'Áp dụng chung cho toàn bộ 21 bản ghi (B02-00001 đến B02-00021) và 82 tờ trang (B02-00101 đến B02-00182).',
    uncertainPoints:
      'Chưa có văn bản cấp phép sao chụp bản gốc A.1046 độ phân giải cao từ Thư viện Viện Nghiên cứu Hán Nôm; do đó chưa đăng tải ảnh chụp bản gốc.',
    imagePath: ARCHIVE_IMAGES.archivalDossier,
    referenceSource:
      '1) Viện Nghiên cứu Hán Nôm – Danh mục A.1046 (hannom.vass.gov.vn). 2) Viện Hàn lâm KHXH Việt Nam – Nhiệm vụ số hóa tài liệu gia phả (vass.gov.vn). 3) Trung tâm Lưu trữ quốc gia – Nguồn sử liệu gia phả (archives.org.vn).',
  },
];

export const INITIAL_DOSSIERS: DocumentDossier[] = DOSSIER_BLUEPRINT.map((item) => {
  const archivalRecord: StandardArchivalRecord = {
    identifier: item.code,
    title: item.name,
    recordType: item.recordType,
    dating: item.dating,
    physicalDescription: item.physicalDescription,
    languageScript: item.languageScript,
    currentRepository: CURRENT_REPOSITORY_HANNOM,
    historicalRepository: HISTORICAL_REPOSITORY_HANNOM,
    repositoryRegNo: `A.1046 (${item.pages})`,
    displayedCopyType:
      'Ảnh minh họa cấu trúc và bản chuyển thể số tham chiếu từ danh mục A.1046 (chưa phải bản số trực tiếp từ bản gốc vật lý theo Điều 63 Luật Di sản văn hóa / Luật Lưu trữ 2024)',
    originalCondition: item.originalCondition,
    attachments: item.attachments,
    transcriptionAndTranslation: {
      hanNom: item.hanNom,
      phienAm: item.phienAm,
      phienAmVerification: item.phienAmVerification,
      dichNghia: item.translation,
      dichNghiaVerification: item.dichNghiaVerification,
    },
    relations: item.relations,
    permissionGrantor: DEFAULT_PERMISSION_GRANTOR,
    allowedScope: DEFAULT_ALLOWED_SCOPE,
    unpublishedParts: DEFAULT_UNPUBLISHED_PARTS,
    referenceSources: item.referenceSource,
    digitizerAndDate: DIGITIZER_STAMP,
    uncertainPoints: item.uncertainPoints,
  };

  return {
    id: item.code.toLowerCase(),
    dossierCode: item.code,
    documentName: item.name,
    callNumber: 'A.1046',
    relatedPages: item.pages,
    primaryPage: item.primaryPage,
    contentType: item.type,
    generationInfo: item.genInfo,
    linkedCharacterIds: item.chars,
    transcriptionContent: `${item.hanNom}\nPhiên âm: ${item.phienAm}`,
    translationContent: item.translation,
    imagePath: item.imagePath,
    referenceSource: item.referenceSource,
    repositoryUnit: CURRENT_REPOSITORY_HANNOM,
    verificationStatus: item.isSample ? 'Dữ liệu mẫu' : 'Đang xác minh',
    publicRightsStatus: DEFAULT_ALLOWED_SCOPE,
    archivalRecord,
    updatedAt: '2026-11-17',
  };
});

export const INITIAL_SOURCES: ReferenceSource[] = [
  {
    id: 1,
    institution: 'Viện Nghiên cứu Hán Nôm',
    title: 'Danh mục tư liệu Bối Khê Trạng nguyên gia phả, ký hiệu A.1046',
    url: 'https://hannom.vass.gov.vn/ky-hieu',
    note: 'Nguồn tra cứu ký hiệu lưu trữ chính của tư liệu.',
  },
  {
    id: 2,
    institution: 'Viện Hàn lâm Khoa học xã hội Việt Nam / Viện Nghiên cứu Hán Nôm',
    title: 'Nghiên cứu, số hóa và biên mục chi tiết tài liệu gia phả',
    url: 'https://vass.gov.vn/hoat-dong-cac-don-vi-truc-thuoc/vien-nghien-cuu-han-nom-to-chuc-danh-gia-nhiem-vu-nghien-cuu-so-hoa-bien-muc-chi-tiet-tai-lieu-gia--581196',
    note: 'Cơ sở phương pháp luận biên mục và số hóa gia phả.',
  },
  {
    id: 3,
    institution: 'Trung tâm Lưu trữ quốc gia',
    title: 'Nguồn sử liệu gia phả',
    url: 'https://www.archives.org.vn/gioi-thieu-tai-lieu-nghiep-vu/nguon-su-lieu-gia-pha.htm',
    note: 'Tài liệu nghiệp vụ đánh giá giá trị sử liệu gia phả.',
  },
  {
    id: 4,
    institution: 'Thư viện Quốc gia Việt Nam',
    title: 'Thư viện số Hán Nôm',
    url: 'http://hannom.nlv.gov.vn',
    note: 'Tham khảo mô hình trình diễn và chuẩn mô tả thư viện số Hán Nôm.',
  },
  {
    id: 5,
    institution: 'Hội Bảo tồn Di sản chữ Nôm',
    title: 'Thư viện số Hán Nôm (Digital Library of Han-Nom)',
    url: 'https://www.nomfoundation.org/nom-project/Digital-Library-of-Han-Nom?uiLang=vn',
    note: 'Tham khảo chuẩn mã hóa chữ Hán Nôm và đối chiếu song ngữ.',
  },
  {
    id: 6,
    institution: 'Thư viện Khoa học Tổng hợp TP.HCM',
    title: 'Dịch thuật tài liệu Hán Nôm',
    url: 'https://www.thuvientphcm.gov.vn/Dich-thuat-tai-lieu-Han-Nom2',
    note: 'Quy trình dịch thuật và chú giải văn bản cổ.',
  },
  {
    id: 7,
    institution: 'Trường Đại học Khoa học – Đại học Thái Nguyên',
    title: 'Giải pháp phát huy giá trị vốn tài liệu Hán Nôm tại các thư viện Việt Nam',
    url: 'https://khcb.tnus.edu.vn/chi-tiet/4456-Giai-phap-phat-huy-gia-tri-von-tai-lieu-han-nom-tai-cac-thu-vien-Viet-Nam',
    note: 'Nghiên cứu giải pháp số hóa và phổ biến giá trị di sản Hán Nôm.',
  },
];

export const INITIAL_IMAGE_PROVENANCE: ImageProvenanceItem[] = [
  {
    id: 'img-hero',
    title: 'Minh họa cuốn gia phả Hán Nôm cổ đóng gáy chỉ trên giấy dó',
    imageUrl: ARCHIVE_IMAGES.heroManuscript,
    sourceOrigin: 'Ảnh minh họa biên tập cho dự án B02 (tách biệt với bản chụp gốc A.1046)',
    caption: 'Hình 1 — Minh họa cuốn gia phả Hán Nôm cổ đóng gáy chỉ trên giấy dó.',
    usageScope: 'Trang chủ, Đối chiếu (Tr.01–02) & Trang Hồ sơ Pháp lý',
    verificationNote: 'Đã xác minh phân loại: Ảnh minh họa học thuật.',
  },
  {
    id: 'img-specimen',
    title: 'Minh họa tờ giấy dó viết chữ Hán Nôm khung cột dọc',
    imageUrl: ARCHIVE_IMAGES.specimenPlate,
    sourceOrigin: 'Ảnh minh họa cấu trúc trang giấy dó Hán Nôm cho giao diện đối chiếu',
    caption: 'Hình 2 — Tờ giấy bản mẫu minh họa chức năng đối chiếu cột Hán Nôm – Quốc ngữ.',
    usageScope: 'Trang chủ, Đối chiếu 82 trang & Sơ đồ phả hệ',
    verificationNote: 'Đã xác minh phân loại: Ảnh minh họa cấu trúc đối chiếu.',
  },
  {
    id: 'img-room',
    title: 'Minh họa không gian lưu trữ và phòng đọc tư liệu Hán Nôm',
    imageUrl: ARCHIVE_IMAGES.readingRoom,
    sourceOrigin: 'Ảnh minh họa không gian thư viện bảo quản di sản Hán Nôm',
    caption: 'Hình 3 — Minh họa không gian bảo quản và khai thác tư liệu cổ.',
    usageScope: 'Trang chủ, Hồ sơ Pháp lý & Giới thiệu',
    verificationNote: 'Đã xác minh phân loại: Ảnh minh họa không gian lưu trữ.',
  },
  {
    id: 'img-digitize',
    title: 'Minh họa hoạt động và quy trình số hóa gia phả cổ',
    imageUrl: ARCHIVE_IMAGES.digitizationStudio,
    sourceOrigin: 'Ảnh minh họa quy trình chụp phẳng tài liệu trên giá đỡ chữ V',
    caption: 'Hình 4 — Minh họa quy trình chuyển đổi tư liệu giấy sang bản số không xâm hại.',
    usageScope: 'Trang chủ, Hồ sơ Pháp lý & Giới thiệu',
    verificationNote: 'Đã xác minh phân loại: Ảnh minh họa quy trình kỹ thuật số hóa.',
  },
  {
    id: 'img-boikhe',
    title: 'Minh họa không gian từ đường cổ truyền thống vùng Bắc Bộ (bối cảnh Bối Khê)',
    imageUrl: ARCHIVE_IMAGES.boikheCourtyard,
    sourceOrigin: 'Ảnh minh họa kiến trúc di sản truyền thống Bắc Bộ',
    caption: 'Hình 5 — Minh họa không gian di sản văn hóa dòng họ truyền thống.',
    usageScope: 'Trang chủ, Sơ đồ phả hệ & Giới thiệu',
    verificationNote: 'Đã xác minh phân loại: Ảnh minh họa bối cảnh văn hóa.',
  },
  {
    id: 'img-genealogy',
    title: 'Minh họa sơ đồ thế thứ viết tay trên giấy dó truyền thống',
    imageUrl: ARCHIVE_IMAGES.genealogyDiagram,
    sourceOrigin: 'Ảnh minh họa cấu trúc bảng kê thế thứ truyền thống',
    caption: 'Hình 6 — Minh họa hình thức sơ đồ thế thứ cổ nối dòng theo các đời.',
    usageScope: 'Trang Sơ đồ phả hệ & Đối chiếu Phần II (Tr.43–80)',
    verificationNote: 'Đã xác minh phân loại: Ảnh sơ đồ minh họa cấu trúc.',
  },
  {
    id: 'img-dossier',
    title: 'Minh họa hồ sơ lưu trữ, sổ biên mục và găng tay bảo quản',
    imageUrl: ARCHIVE_IMAGES.archivalDossier,
    sourceOrigin: 'Ảnh minh họa công tác biên mục và lưu trữ hồ sơ pháp lý',
    caption: 'Hình 7 — Minh họa công tác lập hồ sơ biên mục và bảo quản tài liệu lưu trữ.',
    usageScope: 'Trang Hồ sơ & Pháp lý & Đối chiếu (Tr.81–82)',
    verificationNote: 'Đã xác minh phân loại: Ảnh tài liệu tham khảo nghiệp vụ lưu trữ.',
  },
  {
    id: 'img-scholar-bio',
    title: 'Minh họa trang hành trạng khoa bảng & tiểu truyện Trạng nguyên',
    imageUrl: ARCHIVE_IMAGES.folioScholarBiography,
    sourceOrigin: 'Ảnh minh họa chuyên đề cho khối trang Tr.11–18 (A.1046)',
    caption: 'Hình 8 — Minh họa trang ghi chép hành trạng khoa bảng với dấu triện son cổ.',
    usageScope: 'Đối chiếu Phần I (Tr.11–18) & Bản ghi B02-00004, B02-00005',
    verificationNote: 'Đã xác minh phân loại: Ảnh minh họa cấu trúc văn bản hành trạng.',
  },
  {
    id: 'img-imperial-stele',
    title: 'Minh họa trang sao lục văn bia, sắc phong & điển tích dòng họ',
    imageUrl: ARCHIVE_IMAGES.folioImperialStele,
    sourceOrigin: 'Ảnh minh họa chuyên đề cho khối trang Tr.19–26 (A.1046)',
    caption: 'Hình 9 — Minh họa tờ sao lục văn bia và sắc phong chữ Hán cổ.',
    usageScope: 'Đối chiếu Phần I (Tr.19–26) & Bản ghi B02-00006, B02-00007',
    verificationNote: 'Đã xác minh phân loại: Ảnh minh họa văn bia & sắc phong.',
  },
  {
    id: 'img-ritual-table',
    title: 'Minh họa biểu bảng lệ tục thờ tự, tế điền & hương hỏa bản quán',
    imageUrl: ARCHIVE_IMAGES.folioRitualTable,
    sourceOrigin: 'Ảnh minh họa chuyên đề cho khối trang Tr.27–30 & Tr.59–64',
    caption: 'Hình 10 — Minh họa sổ kê ruộng tế điền và lệ tục thờ tự Hán Nôm.',
    usageScope: 'Đối chiếu (Tr.27–30, Tr.59–64) & Bản ghi B02-00008, B02-00014',
    verificationNote: 'Đã xác minh phân loại: Ảnh minh họa biểu bảng hương hỏa.',
  },
  {
    id: 'img-lineage-tree',
    title: 'Minh họa sơ đồ phân nhánh thế thứ Chi Giáp theo ô đóng khung',
    imageUrl: ARCHIVE_IMAGES.folioLineageTree,
    sourceOrigin: 'Ảnh sơ đồ minh họa chuyên đề cho khối trang Tr.52–58 & Tr.71–75',
    caption: 'Hình 11 — Minh họa sơ đồ thế thứ phân chi bằng mực son và khung chữ Hán Nôm.',
    usageScope: 'Đối chiếu Phần II (Tr.52–58, Tr.71–75) & Bản ghi B02-00013, B02-00016',
    verificationNote: 'Đã xác minh phân loại: Ảnh sơ đồ minh họa thế thứ.',
  },
  {
    id: 'img-chi-at',
    title: 'Minh họa trang thế thứ nối truyền Đời II & nhánh kế thừa Chi Ất',
    imageUrl: ARCHIVE_IMAGES.folioChiAtLineage,
    sourceOrigin: 'Ảnh minh họa chuyên đề cho khối trang Tr.47–51 & Tr.76–80',
    caption: 'Hình 12 — Minh họa trang ghi thế thứ họ Nguyễn và lạc khoản sao lục phả.',
    usageScope: 'Đối chiếu Phần II (Tr.47–51, Tr.76–80) & Bản ghi B02-00012, B02-00017',
    verificationNote: 'Đã xác minh phân loại: Ảnh minh họa thế thứ kế thừa.',
  },
];

export const INITIAL_MEDIA_IMAGES: MediaImageAsset[] = [
  {
    id: 'media-001',
    imageCode: 'B02-00001-anh-01',
    dossierCode: 'B02-00001',
    folioCode: 'A.1046-T01',
    name: 'Cuốn gia phả Hán Nôm cổ đóng gáy chỉ trên bàn nghiên cứu',
    imageUrl: ARCHIVE_IMAGES.heroManuscript,
    category: 'Ảnh minh họa',
    caption: 'Minh họa một cuốn gia phả Hán Nôm cổ đóng gáy chỉ trên giấy dó (Tờ bìa & Đề mục).',
    source: '1) Bộ ảnh minh họa dự án B02. 2) Danh mục Viện Nghiên cứu Hán Nôm (A.1046).',
    originalStatus: 'Chưa tiếp cận trực tiếp vật mang tin gốc A.1046; hiển thị ảnh minh họa cấu trúc theo Điều 63 Luật 2024',
    verificationStatus: 'Dữ liệu mẫu',
    publicRightsStatus: 'Đăng ảnh giảm kích thước phục vụ học tập phi lợi nhuận; không cho tải ảnh độ phân giải cao',
    createdAt: '2026-11-17',
  },
  {
    id: 'media-002',
    imageCode: 'B02-00002-anh-01',
    dossierCode: 'B02-00002',
    folioCode: 'A.1046-T02',
    name: 'Trang giấy dó mẫu viết chữ Hán Nôm theo cột dọc (Phả tự)',
    imageUrl: ARCHIVE_IMAGES.specimenPlate,
    category: 'Ảnh minh họa',
    caption: 'Tờ giấy dó minh họa chức năng đối chiếu chữ Hán Nôm – Quốc ngữ 3 lớp (Tr.02–06).',
    source: '1) Bộ ảnh minh họa dự án B02. 2) Danh mục Viện Nghiên cứu Hán Nôm (A.1046).',
    originalStatus: 'Ảnh minh họa mẫu đối chiếu — tách biệt với ảnh chụp gốc A.1046',
    verificationStatus: 'Dữ liệu mẫu',
    publicRightsStatus: 'Đăng ảnh giảm kích thước phục vụ học tập phi lợi nhuận; không cho tải ảnh độ phân giải cao',
    createdAt: '2026-11-17',
  },
  {
    id: 'media-003',
    imageCode: 'B02-00010-anh-01',
    dossierCode: 'B02-00010',
    folioCode: 'A.1046-T37',
    name: 'Không gian lưu trữ và phòng đọc tư liệu Hán Nôm',
    imageUrl: ARCHIVE_IMAGES.readingRoom,
    category: 'Ảnh minh họa',
    caption: 'Minh họa không gian bảo quản và phòng đọc tài liệu lưu trữ cổ (Tr.37–42).',
    source: '1) Bộ ảnh minh họa dự án B02. 2) Viện Nghiên cứu Hán Nôm.',
    originalStatus: 'Ảnh minh họa không gian thư viện lưu trữ',
    verificationStatus: 'Đang xác minh',
    publicRightsStatus: 'Đăng ảnh giảm kích thước phục vụ học tập phi lợi nhuận; không cho tải ảnh độ phân giải cao',
    createdAt: '2026-11-17',
  },
  {
    id: 'media-004',
    imageCode: 'B02-00009-anh-01',
    dossierCode: 'B02-00009',
    folioCode: 'A.1046-T31',
    name: 'Quy trình chụp phẳng và số hóa tư liệu giấy cổ',
    imageUrl: ARCHIVE_IMAGES.digitizationStudio,
    category: 'Ảnh minh họa',
    caption: 'Minh họa hoạt động số hóa gia phả bằng giá đỡ bảo quản và máy ảnh chụp đứng (Tr.31–36).',
    source: '1) Bộ ảnh minh họa quy trình số hóa dự án B02. 2) Viện Hàn lâm KHXH Việt Nam.',
    originalStatus: 'Ảnh minh họa quy trình kỹ thuật số hóa',
    verificationStatus: 'Đang xác minh',
    publicRightsStatus: 'Đăng ảnh giảm kích thước phục vụ học tập phi lợi nhuận; không cho tải ảnh độ phân giải cao',
    createdAt: '2026-11-17',
  },
  {
    id: 'media-005',
    imageCode: 'B02-00003-anh-01',
    dossierCode: 'B02-00003',
    folioCode: 'A.1046-T07',
    name: 'Không gian từ đường truyền thống tại Bối Khê (xã Tam Hưng, TP. Hà Nội)',
    imageUrl: ARCHIVE_IMAGES.boikheCourtyard,
    category: 'Ảnh minh họa',
    caption: 'Minh họa kiến trúc từ đường cổ vùng Bắc Bộ gắn với hương quán Bối Khê (Tr.07–10).',
    source: '1) Bộ ảnh minh họa bối cảnh di sản dự án B02. 2) Trung tâm Lưu trữ quốc gia.',
    originalStatus: 'Ảnh minh họa bối cảnh di sản văn hóa',
    verificationStatus: 'Đang xác minh',
    publicRightsStatus: 'Đăng ảnh giảm kích thước phục vụ học tập phi lợi nhuận; không cho tải ảnh độ phân giải cao',
    createdAt: '2026-11-17',
  },
  {
    id: 'media-006',
    imageCode: 'B02-00011-anh-01',
    dossierCode: 'B02-00011',
    folioCode: 'A.1046-T43',
    name: 'Sơ đồ thế thứ cổ minh họa trên giấy dó (Mở đầu Thế thứ)',
    imageUrl: ARCHIVE_IMAGES.genealogyDiagram,
    category: 'Ảnh sơ đồ',
    caption: 'Minh họa cấu trúc sơ đồ thế thứ truyền thống liên kết các đời bằng nét mực son (Tr.43–46 & Tr.65–70).',
    source: '1) Bộ ảnh sơ đồ minh họa dự án B02. 2) Danh mục Viện Nghiên cứu Hán Nôm (A.1046).',
    originalStatus: 'Ảnh sơ đồ minh họa cấu trúc Đời I – Đời V+',
    verificationStatus: 'Dữ liệu mẫu',
    publicRightsStatus: 'Đăng ảnh giảm kích thước phục vụ học tập phi lợi nhuận; không cho tải ảnh độ phân giải cao',
    createdAt: '2026-11-17',
  },
  {
    id: 'media-007',
    imageCode: 'B02-00021-anh-01',
    dossierCode: 'B02-00021',
    folioCode: 'A.1046-T82',
    name: 'Hồ sơ xác minh pháp lý, biên mục lưu trữ & phần tục biên cuối tập',
    imageUrl: ARCHIVE_IMAGES.archivalDossier,
    category: 'Ảnh tài liệu tham khảo',
    caption: 'Minh họa quy cách lập hồ sơ biên mục, đối chiếu danh mục và phần hậu ký cuối tập (Tr.81–82).',
    source: '1) Hồ sơ nghiệp vụ lưu trữ dự án B02 (B02-00021). 2) Viện Nghiên cứu Hán Nôm.',
    originalStatus: 'Tài liệu minh họa nghiệp vụ pháp lý & lưu trữ',
    verificationStatus: 'Đang xác minh',
    publicRightsStatus: 'Đăng ảnh giảm kích thước phục vụ học tập phi lợi nhuận; không cho tải ảnh độ phân giải cao',
    createdAt: '2026-11-17',
  },
  {
    id: 'media-008',
    imageCode: 'B02-00004-anh-01',
    dossierCode: 'B02-00004',
    folioCode: 'A.1046-T11',
    name: 'Trang hành trạng khoa bảng & tiểu truyện Trạng nguyên',
    imageUrl: ARCHIVE_IMAGES.folioScholarBiography,
    category: 'Ảnh minh họa',
    caption: 'Minh họa trang ghi hành trạng khoa bảng và sự tích Trạng nguyên Bối Khê (Tr.11–18).',
    source: '1) Bộ ảnh minh họa chuyên đề dự án B02. 2) Thư viện số Hán Nôm.',
    originalStatus: 'Ảnh minh họa cấu trúc hành trạng — tách biệt bản gốc A.1046',
    verificationStatus: 'Đang xác minh',
    publicRightsStatus: 'Đăng ảnh giảm kích thước phục vụ học tập phi lợi nhuận; không cho tải ảnh độ phân giải cao',
    createdAt: '2026-11-17',
  },
  {
    id: 'media-009',
    imageCode: 'B02-00006-anh-01',
    dossierCode: 'B02-00006',
    folioCode: 'A.1046-T19',
    name: 'Trang sao lục văn bia, sắc phong & điển tích dòng họ',
    imageUrl: ARCHIVE_IMAGES.folioImperialStele,
    category: 'Ảnh minh họa',
    caption: 'Minh họa trang sao lục văn bia ký, sắc phong mỹ tự và triện son (Tr.19–26).',
    source: '1) Bộ ảnh minh họa chuyên đề dự án B02. 2) Thư viện KHTH TP.HCM.',
    originalStatus: 'Ảnh minh họa cấu trúc sắc phong — tách biệt bản gốc A.1046',
    verificationStatus: 'Đang xác minh',
    publicRightsStatus: 'Đăng ảnh giảm kích thước phục vụ học tập phi lợi nhuận; không cho tải ảnh độ phân giải cao',
    createdAt: '2026-11-17',
  },
  {
    id: 'media-010',
    imageCode: 'B02-00008-anh-01',
    dossierCode: 'B02-00008',
    folioCode: 'A.1046-T27',
    name: 'Biểu bảng lệ tục thờ tự, tế điền & hương hỏa bản quán',
    imageUrl: ARCHIVE_IMAGES.folioRitualTable,
    category: 'Ảnh minh họa',
    caption: 'Minh họa biểu bảng Hán Nôm ghi chép lệ tục thờ tự, ruộng tế điền và từ đường (Tr.27–30 & Tr.59–64).',
    source: '1) Bộ ảnh minh họa chuyên đề dự án B02. 2) Trung tâm Lưu trữ quốc gia.',
    originalStatus: 'Ảnh minh họa biểu bảng tế điền — tách biệt bản gốc A.1046',
    verificationStatus: 'Đang xác minh',
    publicRightsStatus: 'Đăng ảnh giảm kích thước phục vụ học tập phi lợi nhuận; không cho tải ảnh độ phân giải cao',
    createdAt: '2026-11-17',
  },
  {
    id: 'media-011',
    imageCode: 'B02-00013-anh-01',
    dossierCode: 'B02-00013',
    folioCode: 'A.1046-T52',
    name: 'Sơ đồ phân nhánh thế thứ Chi Giáp (Nhánh chính)',
    imageUrl: ARCHIVE_IMAGES.folioLineageTree,
    category: 'Ảnh sơ đồ',
    caption: 'Minh họa sơ đồ phân nhánh thế thứ Đời III & IV Chi Giáp bằng khung chữ Hán Nôm nối chỉ đỏ (Tr.52–58 & Tr.71–75).',
    source: '1) Bộ ảnh sơ đồ chuyên đề dự án B02. 2) Danh mục Viện Nghiên cứu Hán Nôm (A.1046).',
    originalStatus: 'Ảnh sơ đồ minh họa phân nhánh Chi Giáp',
    verificationStatus: 'Đang xác minh',
    publicRightsStatus: 'Đăng ảnh giảm kích thước phục vụ học tập phi lợi nhuận; không cho tải ảnh độ phân giải cao',
    createdAt: '2026-11-17',
  },
  {
    id: 'media-012',
    imageCode: 'B02-00012-anh-01',
    dossierCode: 'B02-00012',
    folioCode: 'A.1046-T47',
    name: 'Trang thế thứ nối truyền Đời II & nhánh kế thừa Chi Ất',
    imageUrl: ARCHIVE_IMAGES.folioChiAtLineage,
    category: 'Ảnh minh họa',
    caption: 'Minh họa trang thế thứ dòng họ Nguyễn (阮氏族譜) và phần lạc khoản sao lục bảo quản phả cũ (Tr.47–51 & Tr.76–80).',
    source: '1) Bộ ảnh minh họa chuyên đề dự án B02. 2) Danh mục Viện Nghiên cứu Hán Nôm (A.1046).',
    originalStatus: 'Ảnh minh họa thế thứ kế thừa — tách biệt bản gốc A.1046',
    verificationStatus: 'Đang xác minh',
    publicRightsStatus: 'Đăng ảnh giảm kích thước phục vụ học tập phi lợi nhuận; không cho tải ảnh độ phân giải cao',
    createdAt: '2026-11-17',
  },
];

export const INITIAL_DATABASE: ArchiveDatabase = {
  seedVersion: 5,
  folios: INITIAL_FOLIOS,
  characters: INITIAL_CHARACTERS,
  dossiers: INITIAL_DOSSIERS,
  sources: INITIAL_SOURCES,
  imageProvenance: INITIAL_IMAGE_PROVENANCE,
  mediaImages: INITIAL_MEDIA_IMAGES,
  legalInfo: {
    documentName: 'Bối Khê Trạng nguyên gia phả (kèm phần Bối Khê Nguyễn tộc gia phả thế thứ)',
    callNumber: 'A.1046',
    repositoryName: 'Thư viện Viện Nghiên cứu Hán Nôm',
    repositoryAddress: '183 Đặng Tiến Đông, phường Đống Đa, Thành phố Hà Nội',
    repositoryAddressNote:
      'Địa danh theo đơn vị hành chính hai cấp; nguồn danh mục trước sắp xếp ghi 183 Đặng Tiến Đông, phường Trung Liệt, quận Đống Đa, Hà Nội (cần xác nhận lại với đơn vị lưu giữ trước khi liên hệ).',
    catalogingInfo:
      '01 đơn vị tư liệu ký hiệu A.1046 (bản sao truyền lục từ gia phả trước đó); được biên mục thành 21 bản ghi mã định danh cố định B02-00001 đến B02-00021 và 82 tờ trang đối chiếu B02-00101 đến B02-00182 (~82 trang dự kiến).',
    contentDescription:
      'Tài liệu ghi chép lịch sử, hành trạng khoa bảng dòng họ Nguyễn ở Bối Khê (xã Tam Hưng, Thành phố Hà Nội; địa danh cũ: thôn Bối Khê, xã Song Khê, huyện Thanh Oai, tỉnh Hà Tây cũ), gồm Phần I Bối Khê Trạng nguyên gia phả (Tr.01–42) và Phần II Bối Khê Nguyễn tộc gia phả thế thứ (Tr.43–82).',
    digitizationPlan:
      'Toàn bộ 21 bản ghi và 82 trang đối chiếu tuân thủ bộ 20 trường chuẩn biên mục: tách riêng mức kiểm chứng của Phiên âm và Dịch nghĩa, phân loại bản hiển thị theo Điều 63 Luật Di sản văn hóa / Luật Lưu trữ 2024, ghi thật điểm chưa rõ và giữ nguyên địa danh cũ trong nguồn tham khảo.',
    accessRights:
      'Thông tin lưu trữ tại Thư viện Viện Nghiên cứu Hán Nôm được dẫn từ danh mục công khai; việc tiếp cận bản vật lý A.1046 cần thực hiện thủ tục đăng ký độc giả và xác nhận tình trạng tư liệu với đơn vị lưu giữ.',
    copyRights:
      'Chưa có văn bản cấp phép sao chụp bản gốc A.1046. Hệ thống chỉ hiển thị ảnh minh họa cấu trúc đã giảm kích thước, không cho phép tải ảnh độ phân giải cao.',
    publicRights:
      'Phạm vi được phép: công bố thông tin biên mục, ảnh minh họa giảm kích thước và văn bản tham khảo trong sản phẩm học tập phi lợi nhuận; không phát hành ảnh bản gốc, không công bố số điện thoại cá nhân hay vị trí giá kệ kho lưu trữ.',
    officialApprovalConfirmation:
      'Đã xác minh cấu trúc 20 trường biên mục dự án B02 (17/11/2026); phần phiên âm đạt mức kiểm cấu trúc mẫu bởi nhóm thực hiện, phần dịch nghĩa và đối chiếu vật lý bản gốc A.1046 được đánh dấu rõ trạng thái chờ chuyên gia Hán Nôm kiểm chứng.',
    verificationStatus: 'Đang xác minh',
    archivalMasterRecord: {
      identifier: 'B02-00021',
      title:
        'Tập Bối Khê Trạng nguyên gia phả và Bối Khê Nguyễn tộc gia phả thế thứ (Ký hiệu A.1046)',
      recordType:
        'Văn bản kết hợp sơ đồ thế thứ; bản sao chép tay mực nho trên giấy dó (lưu giữ tại thư viện)',
      dating:
        'Chưa xác định năm sao lục tuyệt đối trên bản vật lý; suy đoán khung niên đại cuối thế kỷ XIX – đầu XX theo danh mục Viện Nghiên cứu Hán Nôm (A.1046)',
      physicalDescription:
        '01 đơn vị sách chữ Hán Nôm đóng gáy chỉ trên giấy dó, quy mô dự kiến khoảng 82 trang (Phần I Tr.01–42; Phần II Thế thứ Tr.43–82); mép giấy ngả vàng nhẹ và sờn gáy theo thời gian.',
      languageScript: 'Hán, Nôm',
      currentRepository: CURRENT_REPOSITORY_HANNOM,
      historicalRepository: HISTORICAL_REPOSITORY_HANNOM,
      repositoryRegNo: 'A.1046',
      displayedCopyType:
        'Ảnh minh họa cấu trúc và bản chuyển thể số tham chiếu từ danh mục A.1046 (chưa phải bản số của bản gốc theo Điều 63 Luật Di sản văn hóa / Luật Lưu trữ 2024)',
      originalCondition:
        'Chưa tiếp cận trực tiếp bản vật lý tại kho lưu trữ; dự kiến hư hại nhẹ theo thời gian (ố vàng, sờn gáy chỉ, một số chữ viết thảo/chữ húy mờ nét), chữ chính còn đọc được.',
      attachments:
        'B02-00001-anh-01.jpg đến B02-00021-anh-01.jpg (ảnh minh họa cấu trúc toàn trang theo từng chuyên mục); đang chờ bổ sung ảnh chụp toàn trang, cận cảnh từng dòng và mặt sau của bản gốc A.1046.',
      transcriptionAndTranslation: {
        hanNom: '貝溪狀元家譜 · 貝溪阮族家譜世次 (全書約八十二葉 · A.1046).',
        phienAm:
          'Bối Khê Trạng nguyên gia phả · Bối Khê Nguyễn tộc gia phả thế thứ (Toàn thư ước bát thập nhị diệp · A.1046).',
        phienAmVerification:
          'Đã kiểm khung cấu trúc phiên âm bởi Nguyễn Văn An (nhóm B02) ngày 17/11/2026; chưa kiểm trực tiếp mặt chữ trên bản gốc A.1046.',
        dichNghia:
          'Gia phả Trạng nguyên dòng họ Nguyễn ở Bối Khê và phần Thế thứ dòng họ Nguyễn Bối Khê (khoảng 82 trang, ký hiệu A.1046).',
        dichNghiaVerification:
          'Chưa kiểm chuyên môn (mới dịch nghĩa tham khảo cấu trúc phục vụ học tập; tách riêng với mức kiểm chứng phiên âm).',
      },
      relations:
        'Bản ghi chủ liên kết toàn bộ 21 hồ sơ từ B02-00001 đến B02-00021 và 82 trang đối chiếu từ B02-00101 đến B02-00182.',
      permissionGrantor: DEFAULT_PERMISSION_GRANTOR,
      allowedScope: DEFAULT_ALLOWED_SCOPE,
      unpublishedParts: DEFAULT_UNPUBLISHED_PARTS,
      referenceSources: DEFAULT_REFERENCE_SOURCES,
      digitizerAndDate: DIGITIZER_STAMP,
      uncertainPoints:
        '1) Chưa xác minh được năm sao lục chính xác và danh tính người chép lại bản A.1046. 2) Cần kiểm tra trực tiếp tên húy triều Lê – Nguyễn, số lượng trang thực tế (~82 trang) và các chữ mờ ở phần Thế thứ.',
    },
  },
  aboutInfo: {
    appName: 'Gia Phả Số – Cội Nguồn Việt',
    attributionVerbatim: ATTRIBUTION_VERBATIM,
    studentName: 'Nguyễn Văn An',
    studentId: 'PH70154',
    projectCode: 'B02',
    team: 'Nhóm 1 – Đợt 15',
    program: 'Chương trình Thực tập sinh Đợt 15 FPT Polytechnic và IMTA TECH',
    nature: 'Dự án xã hội phi lợi nhuận',
    projectSummary:
      'Đề tài "Gia phả dòng họ từ bản chép tay sang bản số" được xây dựng nhằm thiết lập nền tảng số hóa chuẩn mực 20 trường cho tư liệu gia phả Hán Nôm, lấy đối tượng trọng tâm là tập tư liệu Bối Khê Trạng nguyên gia phả (ký hiệu A.1046) thuộc dòng họ Nguyễn ở Bối Khê (xã Tam Hưng, Thành phố Hà Nội).',
    ethicsCommitment:
      'Mọi bước triển khai thu thập, sao chụp và công khai tư liệu đều tuân thủ quy định bảo quản của Thư viện Viện Nghiên cứu Hán Nôm và Điều 63 Luật 2024: tách riêng mức kiểm chứng phiên âm và dịch nghĩa, không cho tải ảnh độ phân giải cao, không công bố thông tin liên hệ cá nhân hay vị trí kho mật, và ghi trung thực mọi điểm chưa rõ.',
  },
};
