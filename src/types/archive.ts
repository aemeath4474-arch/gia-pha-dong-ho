export type AppSection =
  | 'overview'
  | 'comparator'
  | 'digitize'
  | 'genealogy'
  | 'dossiers'
  | 'dossier'
  | 'about';

export type VerificationState = 'Chưa xác minh' | 'Dữ liệu mẫu' | 'Đang xác minh' | 'Đã xác minh';

export type ImageCategory =
  | 'Ảnh tư liệu gốc'
  | 'Ảnh bản sao số hóa'
  | 'Ảnh minh họa'
  | 'Ảnh sơ đồ'
  | 'Ảnh tài liệu tham khảo';

export interface MediaImageAsset {
  id: string;
  imageCode: string;
  dossierCode: string;
  folioCode: string;
  name: string;
  imageUrl: string;
  category: ImageCategory;
  caption: string;
  source: string;
  originalStatus: string;
  verificationStatus: VerificationState;
  publicRightsStatus: string;
  createdAt: string;
}

export interface UncertainMark {
  id: string;
  glyphOrPhrase: string;
  locationNote: string;
  reason: string;
  resolved: boolean;
}

export interface ManuscriptColumnLine {
  id: string;
  columnIndex: number;
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  hanNom: string;
  phienAm: string;
  dichNghia: string;
  ghiChu: string;
  isUncertain?: boolean;
  uncertainNote?: string;
}

export interface TranscriptionTranslationBlock {
  hanNom: string;
  phienAm: string;
  phienAmVerification: string;
  dichNghia: string;
  dichNghiaVerification: string;
}

export interface StandardArchivalRecord {
  identifier: string;
  title: string;
  recordType: string;
  dating: string;
  physicalDescription: string;
  languageScript: string;
  currentRepository: string;
  historicalRepository: string;
  repositoryRegNo: string;
  displayedCopyType: string;
  originalCondition: string;
  attachments: string;
  transcriptionAndTranslation: TranscriptionTranslationBlock;
  relations: string;
  permissionGrantor: string;
  allowedScope: string;
  unpublishedParts: string;
  referenceSources: string;
  digitizerAndDate: string;
  uncertainPoints: string;
}

export interface FolioRecord {
  pageNumber: number;
  folioCode: string;
  identifier: string;
  sectionPart: 'phan-1' | 'phan-2';
  sectionLabel: string;
  title: string;
  summary: string;
  status: 'prototype' | 'planned' | 'verified';
  statusLabel: string;
  verificationStatus: VerificationState;
  imageUrl: string;
  imageCaption: string;
  imageSource: string;
  imageCategory?: ImageCategory;
  originalStatus?: string;
  transcriptionText: string;
  translationText: string;
  columns: ManuscriptColumnLine[];
  uncertainMarks: UncertainMark[];
  archivalRecord: StandardArchivalRecord;
  updatedAt: string;
}

export interface GenealogyNode {
  id: string;
  characterCode: string;
  generation: number;
  generationLabel: string;
  name: string;
  tabooName: string;
  roleTitle: string;
  branch: 'truc-he' | 'chi-giap' | 'chi-at';
  branchType: 'Nhánh chính' | 'Nhánh phụ';
  branchLabel: string;
  parentId: string | null;
  familyRelation: string;
  folioRange: string;
  targetPage: number;
  sourceRef: string;
  verificationStatus: VerificationState;
  verificationNote: string;
  summary: string;
  portraitUrl?: string;
  portraitCaption?: string;
  portraitSource?: string;
  portraitVerified?: boolean;
}

export type DossierContentType =
  | 'Phả tự & Mở đầu'
  | 'Hành trạng Trạng nguyên'
  | 'Thế thứ dòng họ'
  | 'Biểu ghi & Hậu ký'
  | 'Pháp lý & Lưu trữ';

export interface DocumentDossier {
  id: string;
  dossierCode: string;
  documentName: string;
  callNumber: string;
  relatedPages: string;
  primaryPage: number;
  contentType: DossierContentType;
  generationInfo: string;
  linkedCharacterIds: string[];
  transcriptionContent: string;
  translationContent: string;
  imagePath: string;
  referenceSource: string;
  repositoryUnit: string;
  verificationStatus: 'Dữ liệu mẫu' | 'Chờ bổ sung' | 'Đang xác minh' | 'Đã xác minh';
  publicRightsStatus: string;
  archivalRecord: StandardArchivalRecord;
  updatedAt: string;
}

export interface ReferenceSource {
  id: number;
  institution: string;
  title: string;
  url: string;
  note?: string;
}

export interface SourceCheckResult {
  id: number;
  url: string;
  reachable: boolean;
  statusCode: number | null;
  checkedAt: string;
  message: string;
}

export interface ImageProvenanceItem {
  id: string;
  title: string;
  imageUrl: string;
  sourceOrigin: string;
  caption: string;
  usageScope: string;
  verificationNote: string;
}

export interface LegalRightsInfo {
  documentName: string;
  callNumber: string;
  repositoryName: string;
  repositoryAddress: string;
  repositoryAddressNote: string;
  catalogingInfo: string;
  contentDescription: string;
  digitizationPlan: string;
  accessRights: string;
  copyRights: string;
  publicRights: string;
  officialApprovalConfirmation: string;
  verificationStatus: VerificationState;
  archivalMasterRecord: StandardArchivalRecord;
}

export interface AboutInfo {
  appName: string;
  attributionVerbatim: string;
  studentName: string;
  studentId: string;
  projectCode: string;
  team: string;
  program: string;
  nature: string;
  projectSummary: string;
  ethicsCommitment: string;
}

export interface ArchiveDatabase {
  seedVersion?: number;
  folios: FolioRecord[];
  characters: GenealogyNode[];
  dossiers: DocumentDossier[];
  sources: ReferenceSource[];
  imageProvenance: ImageProvenanceItem[];
  mediaImages: MediaImageAsset[];
  legalInfo: LegalRightsInfo;
  aboutInfo: AboutInfo;
}

export interface DigitizeColumnResult {
  columnIndex: number;
  hanNom: string;
  phienAm: string;
  dichNghia: string;
  ghiChu: string;
  isUncertain: boolean;
  uncertainNote: string;
}

export interface DigitizeUncertainSegment {
  glyphOrPhrase: string;
  locationNote: string;
  reason: string;
}

export interface DigitizeGenealogySuggestion {
  suggestedCode: string;
  generation: number;
  generationLabel: string;
  name: string;
  tabooName: string;
  roleTitle: string;
  branchType: 'Nhánh chính' | 'Nhánh phụ';
  familyRelation: string;
  summary: string;
}

export interface DigitizeManuscriptResponse {
  documentTitle: string;
  sectionHint: string;
  readingDirection: string;
  summary: string;
  fullHanNomText: string;
  fullPhienAmText: string;
  fullVietnameseTranslation: string;
  columns: DigitizeColumnResult[];
  uncertainSegments: DigitizeUncertainSegment[];
  extractedGenealogy: DigitizeGenealogySuggestion[];
  digitizedAt: string;
  modelUsed: string;
}
