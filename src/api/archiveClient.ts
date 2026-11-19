import type {
  AboutInfo,
  ArchiveDatabase,
  DigitizeManuscriptResponse,
  DocumentDossier,
  FolioRecord,
  GenealogyNode,
  ImageCategory,
  ImageProvenanceItem,
  LegalRightsInfo,
  MediaImageAsset,
  ProjectQARequest,
  ProjectQAResponse,
  ReferenceSource,
  SourceCheckResult,
  VerificationState,
} from '../types/archive';

const TOKEN_STORAGE_KEY = 'giapha_admin_token';

function getStoredToken(): string | null {
  try {
    return window.sessionStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function setStoredToken(token: string | null): void {
  try {
    if (token) {
      window.sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {
    // Ignore storage unavailability
  }
}

async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = (await response.json().catch(() => ({}))) as { error?: string } & T;
  if (!response.ok) {
    if (response.status === 401) {
      setStoredToken(null);
    }
    throw new Error(data.error || `Yêu cầu thất bại (mã lỗi ${response.status}).`);
  }
  return data;
}

export function readFileAsBase64(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error(`Không đọc được tệp ${file.name}.`));
      }
    };
    reader.onerror = () => reject(new Error(`Không đọc được tệp ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

export function validateImageFile(file: File): string | null {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.type.toLowerCase())) {
    return `Tệp "${file.name}" không đúng định dạng (chỉ hỗ trợ JPG, PNG, WEBP).`;
  }
  if (file.size <= 0 || file.size > 5 * 1024 * 1024) {
    return `Tệp "${file.name}" vượt quá dung lượng tối đa 5MB.`;
  }
  return null;
}

export async function fetchArchive(): Promise<ArchiveDatabase> {
  return apiRequest<ArchiveDatabase>('/api/archive');
}

export async function checkReferenceSources(
  sourceIds?: number[]
): Promise<{ results: SourceCheckResult[] }> {
  return apiRequest<{ results: SourceCheckResult[] }>('/api/sources/check', {
    method: 'POST',
    body: JSON.stringify({ sourceIds }),
  });
}

export async function getAuthStatus(): Promise<{ authenticated: boolean; username: string | null }> {
  return apiRequest<{ authenticated: boolean; username: string | null }>('/api/auth/me');
}

export async function loginAdmin(
  username: string,
  password: string
): Promise<{ authenticated: boolean; username: string; token: string }> {
  const res = await apiRequest<{ authenticated: boolean; username: string; token: string }>(
    '/api/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }
  );
  if (res.token) {
    setStoredToken(res.token);
  }
  return res;
}

export async function logoutAdmin(): Promise<void> {
  try {
    await apiRequest<{ authenticated: boolean }>('/api/auth/logout', { method: 'POST' });
  } finally {
    setStoredToken(null);
  }
}

export async function uploadImageFile(file: File): Promise<{ imageUrl: string }> {
  const err = validateImageFile(file);
  if (err) throw new Error(err);

  const dataBase64 = await readFileAsBase64(file);
  return apiRequest<{ imageUrl: string }>('/api/admin/upload', {
    method: 'POST',
    body: JSON.stringify({
      fileName: file.name,
      mimeType: file.type,
      dataBase64,
    }),
  });
}

export async function createMediaAsset(
  payload: Partial<MediaImageAsset> & { syncToFolio?: boolean }
): Promise<{ media: MediaImageAsset }> {
  return apiRequest<{ media: MediaImageAsset }>('/api/admin/media', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateMediaAsset(
  id: string,
  patch: Partial<MediaImageAsset> & { syncToFolio?: boolean }
): Promise<{ media: MediaImageAsset }> {
  return apiRequest<{ media: MediaImageAsset }>(`/api/admin/media/${id}`, {
    method: 'PUT',
    body: JSON.stringify(patch),
  });
}

export async function deleteMediaAsset(id: string): Promise<{ deletedId: string }> {
  return apiRequest<{ deletedId: string }>(`/api/admin/media/${id}`, {
    method: 'DELETE',
  });
}

export interface BatchUploadPayloadItem {
  fileName: string;
  mimeType: string;
  dataBase64: string;
  targetPage: number;
  dossierCode?: string;
  name?: string;
  category?: ImageCategory;
  caption?: string;
  source?: string;
  originalStatus?: string;
  verificationStatus?: VerificationState;
  publicRightsStatus?: string;
}

export async function batchUploadMedia(
  items: BatchUploadPayloadItem[]
): Promise<{ created: MediaImageAsset[] }> {
  return apiRequest<{ created: MediaImageAsset[] }>('/api/admin/media/batch', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
}

export async function updateFolio(
  pageNumber: number,
  patch: Partial<FolioRecord>
): Promise<{ folio: FolioRecord }> {
  return apiRequest<{ folio: FolioRecord }>(`/api/admin/folios/${pageNumber}`, {
    method: 'PUT',
    body: JSON.stringify(patch),
  });
}

export async function clearFolioImage(pageNumber: number): Promise<{ folio: FolioRecord }> {
  return apiRequest<{ folio: FolioRecord }>(`/api/admin/folios/${pageNumber}/image`, {
    method: 'DELETE',
  });
}

export async function createDossier(
  payload: Partial<DocumentDossier>
): Promise<{ dossier: DocumentDossier }> {
  return apiRequest<{ dossier: DocumentDossier }>('/api/admin/dossiers', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateDossier(
  id: string,
  patch: Partial<DocumentDossier>
): Promise<{ dossier: DocumentDossier }> {
  return apiRequest<{ dossier: DocumentDossier }>(`/api/admin/dossiers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(patch),
  });
}

export async function deleteDossier(id: string): Promise<{ deletedId: string }> {
  return apiRequest<{ deletedId: string }>(`/api/admin/dossiers/${id}`, {
    method: 'DELETE',
  });
}

export async function createCharacter(
  payload: Partial<GenealogyNode>
): Promise<{ character: GenealogyNode }> {
  return apiRequest<{ character: GenealogyNode }>('/api/admin/characters', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateCharacter(
  id: string,
  patch: Partial<GenealogyNode>
): Promise<{ character: GenealogyNode }> {
  return apiRequest<{ character: GenealogyNode }>(`/api/admin/characters/${id}`, {
    method: 'PUT',
    body: JSON.stringify(patch),
  });
}

export async function deleteCharacter(id: string): Promise<{ deletedId: string }> {
  return apiRequest<{ deletedId: string }>(`/api/admin/characters/${id}`, {
    method: 'DELETE',
  });
}

export async function createSource(
  payload: Omit<ReferenceSource, 'id'>
): Promise<{ source: ReferenceSource }> {
  return apiRequest<{ source: ReferenceSource }>('/api/admin/sources', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateSource(
  id: number,
  patch: Partial<ReferenceSource>
): Promise<{ source: ReferenceSource }> {
  return apiRequest<{ source: ReferenceSource }>(`/api/admin/sources/${id}`, {
    method: 'PUT',
    body: JSON.stringify(patch),
  });
}

export async function deleteSource(id: number): Promise<{ deletedId: number }> {
  return apiRequest<{ deletedId: number }>(`/api/admin/sources/${id}`, {
    method: 'DELETE',
  });
}

export async function updateLegalInfo(
  patch: Partial<LegalRightsInfo>
): Promise<{ legalInfo: LegalRightsInfo }> {
  return apiRequest<{ legalInfo: LegalRightsInfo }>('/api/admin/legal', {
    method: 'PUT',
    body: JSON.stringify(patch),
  });
}

export async function upsertImageProvenance(
  item: Partial<ImageProvenanceItem>
): Promise<{ item: ImageProvenanceItem }> {
  return apiRequest<{ item: ImageProvenanceItem }>('/api/admin/provenance', {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

export async function updateAboutInfo(
  patch: Partial<AboutInfo>
): Promise<{ aboutInfo: AboutInfo }> {
  return apiRequest<{ aboutInfo: AboutInfo }>('/api/admin/about', {
    method: 'PUT',
    body: JSON.stringify(patch),
  });
}

export interface DigitizeManuscriptPayload {
  mimeType?: string;
  dataBase64?: string;
  sourceImageUrl?: string;
  pageNumber?: number;
  sectionHint?: string;
  customPrompt?: string;
}

export async function digitizeManuscript(
  payload: DigitizeManuscriptPayload
): Promise<DigitizeManuscriptResponse> {
  return apiRequest<DigitizeManuscriptResponse>('/api/digitize', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function askProjectQA(
  payload: ProjectQARequest
): Promise<ProjectQAResponse> {
  return apiRequest<ProjectQAResponse>('/api/qa', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
