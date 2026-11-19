import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { INITIAL_DATABASE } from './src/data/seedData.ts';
import type {
  ArchiveDatabase,
  DigitizeManuscriptResponse,
  DocumentDossier,
  FolioRecord,
  GenealogyNode,
  ImageCategory,
  ImageProvenanceItem,
  MediaImageAsset,
  ProjectQACitation,
  ProjectQAHistoryTurn,
  ProjectQAResponse,
  ReferenceSource,
  SourceCheckResult,
  VerificationState,
} from './src/types/archive.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'archive-db.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const SECRET_PATH = path.join(DATA_DIR, '.session-secret');

const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'admin').trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'B02@A1046Admin';
const PASSWORD_SALT = crypto.randomBytes(16).toString('hex');
const PASSWORD_HASH = crypto.scryptSync(ADMIN_PASSWORD, PASSWORD_SALT, 64);

function getSessionSecret(): string {
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.trim().length >= 16) {
    return process.env.SESSION_SECRET.trim();
  }
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (fs.existsSync(SECRET_PATH)) {
    const existing = fs.readFileSync(SECRET_PATH, 'utf8').trim();
    if (existing.length >= 32) return existing;
  }
  const generated = crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(SECRET_PATH, generated, 'utf8');
  return generated;
}

const SESSION_SECRET = getSessionSecret();
const SESSION_COOKIE_NAME = 'giapha_session';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

function ensureStorageReady(): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DATABASE, null, 2), 'utf8');
  }
}

function readDb(): ArchiveDatabase {
  ensureStorageReady();
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  const parsed = JSON.parse(raw) as Partial<ArchiveDatabase>;

  let dirty = false;

  const targetSeedVersion = INITIAL_DATABASE.seedVersion || 4;
  if (!parsed.seedVersion || parsed.seedVersion < targetSeedVersion) {
    const customUploads = Array.isArray(parsed.mediaImages)
      ? parsed.mediaImages.filter((m) => m.imageUrl && m.imageUrl.startsWith('/uploads/'))
      : [];

    const existingFoliosMap = new Map<number, FolioRecord>();
    if (Array.isArray(parsed.folios)) {
      for (const f of parsed.folios) {
        if (f.imageUrl && f.imageUrl.startsWith('/uploads/')) {
          existingFoliosMap.set(f.pageNumber, f);
        }
      }
    }

    parsed.seedVersion = targetSeedVersion;
    parsed.folios = INITIAL_DATABASE.folios.map((seedFolio) => {
      const custom = existingFoliosMap.get(seedFolio.pageNumber);
      return custom ? { ...seedFolio, ...custom } : seedFolio;
    });
    parsed.characters = INITIAL_DATABASE.characters;
    parsed.dossiers = INITIAL_DATABASE.dossiers;
    parsed.imageProvenance = INITIAL_DATABASE.imageProvenance;
    parsed.mediaImages = [...INITIAL_DATABASE.mediaImages, ...customUploads];
    parsed.legalInfo = INITIAL_DATABASE.legalInfo;
    parsed.aboutInfo = INITIAL_DATABASE.aboutInfo;
    dirty = true;
  }

  if (!Array.isArray(parsed.mediaImages) || parsed.mediaImages.length === 0) {
    parsed.mediaImages = INITIAL_DATABASE.mediaImages;
    dirty = true;
  }
  if (!Array.isArray(parsed.imageProvenance) || parsed.imageProvenance.length < INITIAL_DATABASE.imageProvenance.length) {
    parsed.imageProvenance = INITIAL_DATABASE.imageProvenance;
    dirty = true;
  }

  const db = {
    ...INITIAL_DATABASE,
    ...parsed,
  } as ArchiveDatabase;

  if (dirty) {
    writeDb(db);
  }
  return db;
}

function writeDb(db: ArchiveDatabase): void {
  ensureStorageReady();
  const tmpPath = `${DB_PATH}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(db, null, 2), 'utf8');
  fs.renameSync(tmpPath, DB_PATH);
}

interface SessionPayload {
  username: string;
  exp: number;
}

function signSession(username: string): string {
  const payload: SessionPayload = {
    username,
    exp: Date.now() + SESSION_TTL_MS,
  };
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${signature}`;
}

function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [encoded, signature] = parts;
  if (!encoded || !signature) return null;

  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encoded)
    .digest('base64url');

  const sigBuf = Buffer.from(signature, 'utf8');
  const expectedBuf = Buffer.from(expectedSig, 'utf8');
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
    if (!payload.username || typeof payload.exp !== 'number' || payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  const result: Record<string, string> = {};
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = decodeURIComponent(part.slice(idx + 1).trim());
    if (key) result[key] = val;
  }
  return result;
}

function extractSession(req: Request): SessionPayload | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.slice(7).trim();
    const verified = verifySessionToken(bearerToken);
    if (verified) return verified;
  }
  const cookies = parseCookies(req.headers.cookie);
  return verifySessionToken(cookies[SESSION_COOKIE_NAME]);
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const session = extractSession(req);
  if (!session) {
    res.status(401).json({
      error: 'Phiên đăng nhập quản trị không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.',
    });
    return;
  }
  next();
}

function isValidHttpUrl(input: string): boolean {
  try {
    const parsed = new URL(input);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
    const host = parsed.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '::1' ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      host.startsWith('169.254.')
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function createsCycle(
  characters: GenealogyNode[],
  nodeId: string,
  candidateParentId: string | null
): boolean {
  if (!candidateParentId) return false;
  if (candidateParentId === nodeId) return true;
  const parentMap = new Map(characters.map((c) => [c.id, c.parentId]));
  let cursor: string | null | undefined = candidateParentId;
  const visited = new Set<string>();
  while (cursor) {
    if (cursor === nodeId) return true;
    if (visited.has(cursor)) return true;
    visited.add(cursor);
    cursor = parentMap.get(cursor);
  }
  return false;
}

function saveBase64Image(fileName: string, mimeType: string, dataBase64: string): string {
  const extMap: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
  };
  const ext = extMap[mimeType.toLowerCase()];
  if (!ext) {
    throw new Error('Chỉ chấp nhận định dạng ảnh JPG, PNG hoặc WEBP.');
  }

  const cleanBase64 = dataBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
  const buffer = Buffer.from(cleanBase64, 'base64');
  if (buffer.length === 0 || buffer.length > 5 * 1024 * 1024) {
    throw new Error('Dung lượng mỗi ảnh phải lớn hơn 0 và tối đa 5MB.');
  }

  const safeSlug = (fileName || 'folio')
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 32);
  const outputName = `${safeSlug}_${Date.now()}_${crypto.randomBytes(2).toString('hex')}${ext}`;
  fs.writeFileSync(path.join(UPLOADS_DIR, outputName), buffer);
  return `/uploads/${outputName}`;
}

function parsePageFromFolioCode(folioCode: string): number | null {
  const match = /^A\.1046-T(\d{1,2})$/i.exec(folioCode.trim());
  if (!match) return null;
  const pageNum = Number(match[1]);
  return pageNum >= 1 && pageNum <= 82 ? pageNum : null;
}

const ARCHIVE_ASSETS_DIR = path.resolve(__dirname, 'src', 'assets', 'images');

function resolveImageInputForDigitize(body: {
  mimeType?: string;
  dataBase64?: string;
  sourceImageUrl?: string;
}): { mimeType: string; dataBase64: string } {
  const allowedMimes: Record<string, string> = {
    'image/jpeg': 'image/jpeg',
    'image/jpg': 'image/jpeg',
    'image/png': 'image/png',
    'image/webp': 'image/webp',
  };

  if (body.dataBase64 && body.mimeType) {
    const normalizedMime = allowedMimes[body.mimeType.toLowerCase()];
    if (!normalizedMime) {
      throw new Error('Chỉ hỗ trợ định dạng ảnh JPG, PNG hoặc WEBP.');
    }
    const cleanBase64 = body.dataBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    if (buffer.length === 0 || buffer.length > 5 * 1024 * 1024) {
      throw new Error('Dung lượng ảnh phải lớn hơn 0 và tối đa 5MB.');
    }
    return { mimeType: normalizedMime, dataBase64: cleanBase64 };
  }

  if (body.sourceImageUrl && body.sourceImageUrl.trim()) {
    const cleanUrl = body.sourceImageUrl.trim().split('?')[0];
    let resolvedFile = '';
    if (cleanUrl.startsWith('/src/assets/images/')) {
      const fileName = cleanUrl.slice('/src/assets/images/'.length);
      if (!fileName || fileName.includes('/') || fileName.includes('\\') || fileName.includes('..')) {
        throw new Error('Đường dẫn ảnh nội bộ không hợp lệ.');
      }
      resolvedFile = path.resolve(ARCHIVE_ASSETS_DIR, fileName);
      if (!resolvedFile.startsWith(ARCHIVE_ASSETS_DIR + path.sep)) {
        throw new Error('Đường dẫn ảnh nằm ngoài thư mục hợp lệ.');
      }
    } else if (cleanUrl.startsWith('/uploads/')) {
      const fileName = cleanUrl.slice('/uploads/'.length);
      if (!fileName || fileName.includes('/') || fileName.includes('\\') || fileName.includes('..')) {
        throw new Error('Đường dẫn ảnh tải lên không hợp lệ.');
      }
      resolvedFile = path.resolve(UPLOADS_DIR, fileName);
      if (!resolvedFile.startsWith(UPLOADS_DIR + path.sep)) {
        throw new Error('Đường dẫn ảnh nằm ngoài thư mục hợp lệ.');
      }
    } else {
      throw new Error('Chỉ hỗ trợ chọn ảnh tải lên trực tiếp hoặc ảnh lưu trong hệ thống.');
    }

    if (!fs.existsSync(resolvedFile)) {
      throw new Error('Không tìm thấy tệp ảnh tư liệu được chọn trên máy chủ.');
    }

    const ext = path.extname(resolvedFile).toLowerCase();
    const extMimeMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
    };
    const mimeType = extMimeMap[ext];
    if (!mimeType) {
      throw new Error('Định dạng ảnh trên máy chủ không được hỗ trợ.');
    }
    const buf = fs.readFileSync(resolvedFile);
    if (buf.length === 0 || buf.length > 6 * 1024 * 1024) {
      throw new Error('Kích thước tệp ảnh không hợp lệ.');
    }
    return { mimeType, dataBase64: buf.toString('base64') };
  }

  throw new Error('Vui lòng tải ảnh bản chép tay lên hoặc chọn một trang mẫu để chuyển đổi.');
}

async function checkSingleSource(source: ReferenceSource): Promise<SourceCheckResult> {
  const checkedAt = new Date().toISOString();
  if (!isValidHttpUrl(source.url)) {
    return {
      id: source.id,
      url: source.url,
      reachable: false,
      statusCode: null,
      checkedAt,
      message: 'Đường dẫn URL không hợp lệ hoặc không thuộc giao thức HTTP/HTTPS công khai.',
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6500);

  try {
    let response = await fetch(source.url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'GiaPhaSo-CoiNguonViet-LinkChecker/1.0' },
    });

    if (response.status === 405 || response.status === 403 || response.status === 400) {
      response = await fetch(source.url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'User-Agent': 'GiaPhaSo-CoiNguonViet-LinkChecker/1.0' },
      });
    }

    clearTimeout(timer);
    const reachable = response.status >= 200 && response.status < 400;
    return {
      id: source.id,
      url: source.url,
      reachable,
      statusCode: response.status,
      checkedAt,
      message: reachable
        ? `Kết nối thành công (HTTP ${response.status})`
        : `Máy chủ phản hồi mã HTTP ${response.status}`,
    };
  } catch (err) {
    clearTimeout(timer);
    const detail = err instanceof Error ? err.message : 'Lỗi kết nối mạng';
    return {
      id: source.id,
      url: source.url,
      reachable: false,
      statusCode: null,
      checkedAt,
      message: `Không thể truy cập trực tiếp từ máy chủ (${detail})`,
    };
  }
}

async function startServer(): Promise<void> {
  ensureStorageReady();

  const app = express();
  app.use(express.json({ limit: '30mb' }));
  app.use('/uploads', express.static(UPLOADS_DIR));
  app.use('/src/assets/images', express.static(ARCHIVE_ASSETS_DIR));

  // Public Archive Read Endpoint
  app.get('/api/archive', (_req: Request, res: Response) => {
    try {
      const db = readDb();
      res.json(db);
    } catch {
      res.status(500).json({ error: 'Không thể đọc cơ sở dữ liệu tư liệu.' });
    }
  });

  // Reference Source HTTP Check Endpoint (Read-only)
  app.post('/api/sources/check', async (req: Request, res: Response) => {
    try {
      const db = readDb();
      const body = req.body as { sourceIds?: number[] } | undefined;
      const targets =
        Array.isArray(body?.sourceIds) && body.sourceIds.length > 0
          ? db.sources.filter((s) => body.sourceIds?.includes(s.id))
          : db.sources;

      const results = await Promise.all(targets.map((src) => checkSingleSource(src)));
      res.json({ results });
    } catch {
      res.status(500).json({ error: 'Không thể kiểm tra trạng thái nguồn tham khảo.' });
    }
  });

  // Handwritten Hán Nôm Genealogy -> Digital Structured Text Conversion (Gemini Multimodal)
  app.post('/api/digitize', async (req: Request, res: Response) => {
    const body = req.body as
      | {
          mimeType?: string;
          dataBase64?: string;
          sourceImageUrl?: string;
          pageNumber?: number;
          sectionHint?: string;
          customPrompt?: string;
        }
      | undefined;

    let imagePayload: { mimeType: string; dataBase64: string };
    try {
      imagePayload = resolveImageInputForDigitize(body || {});
    } catch (err) {
      res.status(400).json({
        error: err instanceof Error ? err.message : 'Dữ liệu ảnh đầu vào không hợp lệ.',
      });
      return;
    }

    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.status(500).json({
        error:
          'Máy chủ chưa có GEMINI_API_KEY hợp lệ. Vui lòng thiết lập biến môi trường GEMINI_API_KEY trong phần Secrets.',
      });
      return;
    }

    const pageNum =
      body?.pageNumber && Number.isInteger(Number(body.pageNumber))
        ? Math.min(82, Math.max(1, Number(body.pageNumber)))
        : null;
    const sectionHint = (body?.sectionHint || 'Chưa phân loại').trim();
    const customPrompt = (body?.customPrompt || '').trim();

    const instruction = [
      'Bạn là chuyên gia văn bản học Hán Nôm và số hóa gia phả cổ Việt Nam (hệ thống Gia Phả Số – Cội Nguồn Việt, tư liệu tham chiếu Bối Khê Trạng nguyên gia phả A.1046).',
      'Hãy đọc kỹ hình ảnh trang gia phả / văn bản chép tay chữ Hán Nôm hoặc sơ đồ thế thứ được cung cấp và chuyển đổi thành dữ liệu số có cấu trúc.',
      'QUY TẮC TRUNG THỰC HỌC THUẬT NGHIÊM NGẶT:',
      '- Chỉ phiên chép những chữ Hán / chữ Nôm thực sự nhìn thấy được trên ảnh. Với chữ mờ nhòe, mất nét, viết thảo khó xác định hoặc ký tự nghi vấn, hãy dùng ký hiệu "[?]" hoặc ghi chú rõ vào mảng uncertainSegments (kèm lý do). Tuyệt đối không bịa đặt tên húy, niên đại hay chữ không thấy trên ảnh.',
      '- Phân tách văn bản theo từng cột dọc (từ phải sang trái, trên xuống dưới) hoặc từng khung/ô nếu là sơ đồ thế thứ.',
      '- Với mỗi cột/khung, cung cấp: hanNom (chữ Hán Nôm), phienAm (phiên âm Hán-Việt), dichNghia (dịch nghĩa tiếng Việt), ghiChu (chú giải văn bản học), isUncertain (boolean), uncertainNote.',
      '- Nếu ảnh có thông tin nhân vật / thế hệ / phân chi, hãy trích xuất gợi ý vào extractedGenealogy; nếu ảnh không phải bảng thế thứ hoặc không rõ tên riêng, trả về mảng rỗng hoặc mô tả trung thực đúng nội dung quan sát được.',
      pageNum ? `- Ngữ cảnh trang mục tiêu đang đối chiếu: A.1046-T${String(pageNum).padStart(2, '0')}.` : '',
      `- Phân đoạn nội dung gợi ý: ${sectionHint}.`,
      customPrompt ? `- Yêu cầu bổ sung của người nghiên cứu: ${customPrompt}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });

      const requestPayload = {
        model: 'gemini-4-hydrogen',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: imagePayload.mimeType,
                  data: imagePayload.dataBase64,
                },
              },
              { text: instruction },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              documentTitle: { type: Type.STRING },
              sectionHint: { type: Type.STRING },
              readingDirection: { type: Type.STRING },
              summary: { type: Type.STRING },
              fullHanNomText: { type: Type.STRING },
              fullPhienAmText: { type: Type.STRING },
              fullVietnameseTranslation: { type: Type.STRING },
              columns: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    columnIndex: { type: Type.INTEGER },
                    hanNom: { type: Type.STRING },
                    phienAm: { type: Type.STRING },
                    dichNghia: { type: Type.STRING },
                    ghiChu: { type: Type.STRING },
                    isUncertain: { type: Type.BOOLEAN },
                    uncertainNote: { type: Type.STRING },
                  },
                  required: [
                    'columnIndex',
                    'hanNom',
                    'phienAm',
                    'dichNghia',
                    'ghiChu',
                    'isUncertain',
                    'uncertainNote',
                  ],
                },
              },
              uncertainSegments: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    glyphOrPhrase: { type: Type.STRING },
                    locationNote: { type: Type.STRING },
                    reason: { type: Type.STRING },
                  },
                  required: ['glyphOrPhrase', 'locationNote', 'reason'],
                },
              },
              extractedGenealogy: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    suggestedCode: { type: Type.STRING },
                    generation: { type: Type.INTEGER },
                    generationLabel: { type: Type.STRING },
                    name: { type: Type.STRING },
                    tabooName: { type: Type.STRING },
                    roleTitle: { type: Type.STRING },
                    branchType: { type: Type.STRING },
                    familyRelation: { type: Type.STRING },
                    summary: { type: Type.STRING },
                  },
                  required: [
                    'suggestedCode',
                    'generation',
                    'generationLabel',
                    'name',
                    'tabooName',
                    'roleTitle',
                    'branchType',
                    'familyRelation',
                    'summary',
                  ],
                },
              },
            },
            required: [
              'documentTitle',
              'sectionHint',
              'readingDirection',
              'summary',
              'fullHanNomText',
              'fullPhienAmText',
              'fullVietnameseTranslation',
              'columns',
              'uncertainSegments',
              'extractedGenealogy',
            ],
          },
        },
      };

      let response;
      let lastErr: unknown;
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          response = await ai.models.generateContent(requestPayload);
          break;
        } catch (err) {
          lastErr = err;
          const msg = err instanceof Error ? err.message : '';
          const isTransient =
            msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('429');
          if (attempt === 0 && isTransient) {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            continue;
          }
          throw err;
        }
      }

      const rawText = response?.text;
      if (!rawText) {
        if (lastErr) throw lastErr;
        res.status(502).json({
          error: 'Dịch vụ nhận dạng Hán Nôm không trả về nội dung văn bản số.',
        });
        return;
      }

      const parsedResult = JSON.parse(rawText) as Omit<
        DigitizeManuscriptResponse,
        'digitizedAt' | 'modelUsed'
      >;

      const normalized: DigitizeManuscriptResponse = {
        documentTitle: parsedResult.documentTitle || 'Bản chép tay gia phả Hán Nôm',
        sectionHint: parsedResult.sectionHint || sectionHint,
        readingDirection:
          parsedResult.readingDirection || 'Đọc theo cột dọc từ phải sang trái, trên xuống dưới',
        summary: parsedResult.summary || '',
        fullHanNomText: parsedResult.fullHanNomText || '',
        fullPhienAmText: parsedResult.fullPhienAmText || '',
        fullVietnameseTranslation: parsedResult.fullVietnameseTranslation || '',
        columns: Array.isArray(parsedResult.columns)
          ? parsedResult.columns.map((c, idx) => ({
              columnIndex: Number(c.columnIndex) || idx + 1,
              hanNom: String(c.hanNom || ''),
              phienAm: String(c.phienAm || ''),
              dichNghia: String(c.dichNghia || ''),
              ghiChu: String(c.ghiChu || ''),
              isUncertain: Boolean(c.isUncertain),
              uncertainNote: String(c.uncertainNote || ''),
            }))
          : [],
        uncertainSegments: Array.isArray(parsedResult.uncertainSegments)
          ? parsedResult.uncertainSegments
          : [],
        extractedGenealogy: Array.isArray(parsedResult.extractedGenealogy)
          ? parsedResult.extractedGenealogy.map((g, idx) => ({
              suggestedCode: String(g.suggestedCode || `NV-SO-${idx + 1}`),
              generation: Math.min(10, Math.max(1, Number(g.generation) || 1)),
              generationLabel: String(g.generationLabel || `Đời ${Number(g.generation) || 1}`),
              name: String(g.name || 'Nhân vật trích xuất'),
              tabooName: String(g.tabooName || 'Chưa rõ / chờ đối chiếu'),
              roleTitle: String(g.roleTitle || 'Thành viên ghi trong văn bản'),
              branchType: g.branchType === 'Nhánh phụ' ? 'Nhánh phụ' : 'Nhánh chính',
              familyRelation: String(g.familyRelation || 'Chờ xác minh quan hệ gia đình'),
              summary: String(g.summary || ''),
            }))
          : [],
        digitizedAt: new Date().toISOString(),
        modelUsed: 'gemini-4-hydrogen',
      };

      res.json(normalized);
    } catch (err) {
      const rawMessage = err instanceof Error ? err.message : '';
      let friendly = 'Không thể hoàn tất quá trình chuyển đổi bản chép tay sang bản số.';
      if (rawMessage.includes('503') || rawMessage.includes('UNAVAILABLE')) {
        friendly =
          'Dịch vụ phân tích Hán Nôm đang quá tải tạm thời (503). Vui lòng nhấn thử lại sau vài giây.';
      } else if (rawMessage.includes('429') || rawMessage.includes('RESOURCE_EXHAUSTED')) {
        friendly = 'Đã vượt giới hạn tần suất gọi API tạm thời (429). Vui lòng chờ giây lát và thử lại.';
      } else if (rawMessage.includes('API_KEY') || rawMessage.includes('401') || rawMessage.includes('403')) {
        friendly = 'GEMINI_API_KEY không hợp lệ hoặc chưa được cấp quyền truy cập mô hình.';
      } else if (rawMessage) {
        friendly = `Lỗi chuyển đổi tư liệu: ${rawMessage}`;
      }
      res.status(502).json({ error: friendly });
    }
  });

  // Grounded Project Q&A with Gemini AI
  function buildProjectQAGroundingContext(db: ArchiveDatabase): string {
    const validAppSections = ['overview', 'comparator', 'digitize', 'genealogy', 'dossiers', 'dossier', 'about', 'qa'];
    const dossierDigest = db.dossiers
      .map(
        (d) =>
          `- ${d.dossierCode} | ${d.documentName} | ${d.contentType} | Trang: ${d.relatedPages} (trang mẫu ${d.primaryPage}) | Niên đại: ${d.archivalRecord.dating} | Phiên âm: ${d.archivalRecord.transcriptionAndTranslation.phienAmVerification} | Dịch nghĩa: ${d.archivalRecord.transcriptionAndTranslation.dichNghiaVerification} | Điểm chưa chắc: ${d.archivalRecord.uncertainPoints}`
      )
      .join('\n');

    const genealogyDigest = db.characters
      .map(
        (c) =>
          `- ${c.characterCode}: ${c.name} (${c.generationLabel}, ${c.branchType} - ${c.branchLabel}) | Chức danh: ${c.roleTitle} | Tên húy: ${c.tabooName} | Quan hệ: ${c.familyRelation} | Nguồn: ${c.folioRange} (trang ${c.targetPage}) | Trạng thái: ${c.verificationStatus} (${c.verificationNote})`
      )
      .join('\n');

    const sampleFoliosDigest = db.folios
      .filter((f) => [1, 2, 12, 24, 43, 55, 68, 82].includes(f.pageNumber))
      .map(
        (f) =>
          `- ${f.folioCode} (${f.identifier}, Tr.${String(f.pageNumber).padStart(2, '0')}): ${f.title} | ${f.sectionLabel} | Trạng thái: ${f.verificationStatus} | Tóm tắt: ${f.summary}`
      )
      .join('\n');

    const sourcesDigest = db.sources
      .map((s) => `- Nguồn ${s.id}: ${s.institution} — ${s.title} (${s.url})`)
      .join('\n');

    return [
      'NGỮ CẢNH DỮ LIỆU CHÍNH THỨC CỦA DỰ ÁN B02 – GIA PHẢ SỐ CỘI NGUỒN VIỆT:',
      '',
      '1. THÔNG TIN DỰ ÁN & SINH VIÊN THỰC HIỆN:',
      `- Tên website: ${db.aboutInfo.appName}`,
      `- Công bố nguyên văn: "${db.aboutInfo.attributionVerbatim}"`,
      `- Sinh viên: ${db.aboutInfo.studentName} | MSSV: ${db.aboutInfo.studentId} | Mã dự án: ${db.aboutInfo.projectCode}`,
      `- Nhóm/Chương trình: ${db.aboutInfo.team} · ${db.aboutInfo.program} · ${db.aboutInfo.nature}`,
      `- Tóm tắt mục tiêu: ${db.aboutInfo.projectSummary}`,
      `- Cam kết đạo đức học thuật: ${db.aboutInfo.ethicsCommitment}`,
      '',
      '2. TƯ LIỆU TRỌNG TÂM & PHÁP LÝ (ĐIỀU 63 LUẬT LƯU TRỮ 2024):',
      `- Tư liệu trọng tâm: ${db.legalInfo.documentName}, ký hiệu thư viện: ${db.legalInfo.callNumber}. Tổng số trang dự kiến số hóa: ${db.folios.length} trang (mã A.1046-T01 đến A.1046-T82, định danh chuẩn B02-00101 đến B02-00182).`,
      `- Nơi lưu giữ hiện nay (địa giới 2 cấp): ${db.legalInfo.repositoryName}, ${db.legalInfo.repositoryAddress} (${db.legalInfo.repositoryAddressNote}).`,
      `- Địa danh Bối Khê: hiện nay theo đơn vị hành chính 2 cấp là thôn Bối Khê, xã Tam Hưng, Thành phố Hà Nội; địa danh cũ trong thư mục xưa là xã Song Khê, huyện Thanh Oai, tỉnh Hà Tây (cũ).`,
      `- Mô tả & tình trạng bản gốc: ${db.legalInfo.contentDescription} | Tình trạng: ${db.legalInfo.archivalMasterRecord.originalCondition}.`,
      `- Loại bản đang hiển thị (Điều 63 Luật 2024): ${db.legalInfo.archivalMasterRecord.displayedCopyType}.`,
      `- Quyền truy cập & công bố: ${db.legalInfo.accessRights} | ${db.legalInfo.publicRights}`,
      `- Phần chưa công bố: ${db.legalInfo.archivalMasterRecord.unpublishedParts}`,
      `- Cấp phép chính thức: ${db.legalInfo.officialApprovalConfirmation} | Trạng thái xác minh hồ sơ: ${db.legalInfo.verificationStatus}.`,
      `- Chuẩn biên mục 20 trường: Mỗi hồ sơ (B02-00001..B02-00021) và mỗi trang (B02-00101..B02-00182) tuân thủ 20 trường chuẩn: Mã định danh, Nhan đề, Loại, Niên đại, Mô tả, Ngôn ngữ/chữ viết, Nơi lưu giữ hiện nay (2 cấp), Nơi lưu giữ tại thời điểm tư liệu (giữ địa danh cũ), Số đăng ký tại nơi lưu giữ, Loại bản đang hiển thị (Điều 63 Luật 2024), Tình trạng bản gốc, Tệp đính kèm, Phiên âm & Dịch nghĩa (tách riêng mức kiểm chứng), Quan hệ, Người/Đơn vị cho phép, Phạm vi được phép, Phần chưa công bố, Nguồn dẫn, Người số hoá & ngày số hoá, Điểm chưa chắc chắn.`,
      '',
      `3. DANH MỤC 21 HỒ SƠ BIÊN MỤC (${db.dossiers.length} hồ sơ B02-00001 – B02-00021):`,
      dossierDigest,
      '',
      `4. CẤU TRÚC 82 TRANG ĐỐI CHIẾU (A.1046-T01..T82 | B02-00101..B02-00182):`,
      `- Phần 1 (Trang 01–42): Bối Khê Trạng nguyên gia phả — Phả tự, lệ gia phả, hành trạng Bối Khê Trạng nguyên và văn bia/phụ chép.`,
      `- Phần 2 (Trang 43–82): Bối Khê Nguyễn tộc gia phả thế thứ — Bảng thế thứ các đời, phân chi Giáp/Ất và ghi chú hậu thế.`,
      `- Trang tiêu biểu:`,
      sampleFoliosDigest,
      '',
      `5. SƠ ĐỒ PHẢ HỆ TRONG DỰ ÁN (${db.characters.length} nhân vật cấu trúc):`,
      genealogyDigest,
      '',
      '6. CHỨC NĂNG WEBSITE HIỆN CÓ:',
      `- Trang chủ (overview), Đối chiếu 82 trang 3 lớp ảnh-Hán Nôm-Việt ngữ (comparator), Chuyển đổi bản chép tay Hán Nôm sang bản số bằng Gemini AI (digitize), Sơ đồ phả hệ (genealogy), Danh mục 21 hồ sơ chuẩn 20 trường (dossiers), Hồ sơ pháp lý & Nguồn tham khảo (dossier), Giới thiệu nhóm thực hiện (about), Hỏi đáp với Gemini AI (qa).`,
      `- Nguồn tham khảo (${db.sources.length} nguồn):`,
      sourcesDigest,
      `- Mã section hợp lệ khi trích dẫn: ${validAppSections.join(', ')}`,
    ].join('\n');
  }

  app.post('/api/qa', async (req: Request, res: Response) => {
    const body = req.body as
      | {
          question?: string;
          history?: ProjectQAHistoryTurn[];
        }
      | undefined;

    const question = (body?.question || '').trim();
    if (!question) {
      res.status(400).json({ error: 'Vui lòng nhập câu hỏi về dự án trước khi gửi.' });
      return;
    }
    if (question.length > 2000) {
      res.status(400).json({ error: 'Câu hỏi vượt quá độ dài tối đa 2.000 ký tự.' });
      return;
    }

    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.status(500).json({
        error:
          'Máy chủ chưa có GEMINI_API_KEY hợp lệ. Vui lòng thiết lập biến môi trường GEMINI_API_KEY trong phần Secrets.',
      });
      return;
    }

    const db = readDb();
    const groundingContext = buildProjectQAGroundingContext(db);

    const systemInstruction = [
      'Bạn là Trợ lý Tra cứu Học thuật & Lưu trữ của dự án "Gia Phả Số – Cội Nguồn Việt" (mã dự án B02, tư liệu Bối Khê Trạng nguyên gia phả ký hiệu A.1046).',
      'NHIỆM VỤ: Giải đáp câu hỏi của người dùng bằng tiếng Việt chuẩn mực, súc tích, lịch sự, bám sát dữ liệu thực tế của dự án B02 được cung cấp bên dưới.',
      'NGUYÊN TẮC TRUNG THỰC HỌC THUẬT BẮT BUỘC:',
      '1. Chỉ khẳng định những thông tin thực sự có trong dữ liệu dự án bên dưới hoặc kiến thức lưu trữ học Việt Nam chung có liên quan trực tiếp đến cấu trúc gia phả/Luật Lưu trữ 2024.',
      '2. Tuyệt đối KHÔNG tự bịa tên húy, ngày sinh/mất, số điện thoại, công văn/số văn bản cho phép chưa có, hoặc khẳng định bản đang hiển thị trên web là ảnh chụp bản gốc A.1046 từ Viện Nghiên cứu Hán Nôm.',
      '3. Luôn nêu rõ sự tách biệt mức kiểm chứng khi người dùng hỏi về văn bản: Phiên âm mẫu và cấu trúc 20 trường đã kiểm cấu trúc hiển thị; Dịch nghĩa tiếng Việt và đối chiếu nguyên bản A.1046 tại Thư viện Viện Nghiên cứu Hán Nôm vẫn đang chờ đối chiếu chuyên môn.',
      '4. Nếu người dùng hỏi ngoài phạm vi dữ liệu dự án B02 hoặc chi tiết chưa xác minh (như các trang A.1046 gốc chưa tiếp cận thực địa), phải nói rõ giới hạn dữ liệu hiện có và chỉ dẫn mục/hồ sơ liên quan trên website.',
      '5. Trả về JSON đúng schema: answer (câu trả lời rõ ràng, có thể tách đoạn bằng xuống dòng \\n\\n, không dùng markdown phức tạp như bảng lớn), citedRecords (tối đa 4 trích dẫn liên kết thẳng tới section hoặc số trang 1-82 liên quan nhất), suggestedFollowUps (2-3 câu hỏi gợi ý tiếp theo ngắn gọn), verificationNote (1 câu ngắn lưu ý tình trạng xác minh liên quan đến câu hỏi).',
      '',
      groundingContext,
    ].join('\n');

    const safeHistory: { role: 'user' | 'model'; parts: { text: string }[] }[] = Array.isArray(
      body?.history
    )
      ? body.history
          .slice(-8)
          .filter(
            (turn): turn is ProjectQAHistoryTurn =>
              Boolean(turn) &&
              (turn.role === 'user' || turn.role === 'model') &&
              typeof turn.text === 'string' &&
              turn.text.trim().length > 0
          )
          .map((turn) => ({
            role: turn.role,
            parts: [{ text: turn.text.trim().slice(0, 2000) }],
          }))
      : [];

    const contents = [
      ...safeHistory,
      {
        role: 'user' as const,
        parts: [{ text: question }],
      },
    ];

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });

      const requestPayload = {
        model: 'gemini-4-hydrogen',
        contents,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              answer: { type: Type.STRING },
              citedRecords: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    code: { type: Type.STRING },
                    label: { type: Type.STRING },
                    section: { type: Type.STRING },
                    pageNumber: { type: Type.INTEGER },
                  },
                  required: ['code', 'label', 'section'],
                },
              },
              suggestedFollowUps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              verificationNote: { type: Type.STRING },
            },
            required: ['answer', 'citedRecords', 'suggestedFollowUps', 'verificationNote'],
          },
        },
      };

      let response;
      let lastErr: unknown;
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          response = await ai.models.generateContent(requestPayload);
          break;
        } catch (err) {
          lastErr = err;
          const msg = err instanceof Error ? err.message : '';
          const isTransient =
            msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('429');
          if (attempt === 0 && isTransient) {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            continue;
          }
          throw err;
        }
      }

      const rawText = response?.text;
      if (!rawText) {
        if (lastErr) throw lastErr;
        res.status(502).json({ error: 'Gemini AI không trả về nội dung giải đáp cho câu hỏi.' });
        return;
      }

      const parsed = JSON.parse(rawText) as {
        answer?: string;
        citedRecords?: Array<{
          code?: string;
          label?: string;
          section?: string;
          pageNumber?: number;
        }>;
        suggestedFollowUps?: string[];
        verificationNote?: string;
      };

      const allowedSections = new Set([
        'overview',
        'comparator',
        'digitize',
        'genealogy',
        'dossiers',
        'dossier',
        'about',
        'qa',
      ]);

      const normalizedCitations: ProjectQACitation[] = Array.isArray(parsed.citedRecords)
        ? parsed.citedRecords.slice(0, 4).map((c) => {
            const rawSec = String(c.section || 'dossiers').trim();
            const section = (
              allowedSections.has(rawSec) ? rawSec : 'dossiers'
            ) as ProjectQACitation['section'];
            const pageNum =
              typeof c.pageNumber === 'number' &&
              Number.isInteger(c.pageNumber) &&
              c.pageNumber >= 1 &&
              c.pageNumber <= 82
                ? c.pageNumber
                : undefined;
            return {
              code: String(c.code || 'B02').trim(),
              label: String(c.label || 'Xem mục tư liệu liên quan').trim(),
              section,
              pageNumber: pageNum,
            };
          })
        : [];

      const result: ProjectQAResponse = {
        answer: String(parsed.answer || '').trim(),
        citedRecords: normalizedCitations,
        suggestedFollowUps: Array.isArray(parsed.suggestedFollowUps)
          ? parsed.suggestedFollowUps
              .map((q) => String(q || '').trim())
              .filter(Boolean)
              .slice(0, 3)
          : [],
        verificationNote: String(
          parsed.verificationNote ||
            'Thông tin đối chiếu theo dữ liệu biên mục hiện hành của dự án B02 (tập A.1046).'
        ).trim(),
        modelUsed: 'gemini-4-hydrogen',
        answeredAt: new Date().toISOString(),
      };

      res.json(result);
    } catch (err) {
      const rawMessage = err instanceof Error ? err.message : '';
      let friendly = 'Không thể nhận phản hồi từ trợ lý hỏi đáp Gemini AI.';
      if (rawMessage.includes('503') || rawMessage.includes('UNAVAILABLE')) {
        friendly =
          'Dịch vụ Gemini AI đang quá tải tạm thời (503). Vui lòng nhấn thử lại sau vài giây.';
      } else if (rawMessage.includes('429') || rawMessage.includes('RESOURCE_EXHAUSTED')) {
        friendly = 'Đã vượt giới hạn tần suất gọi API tạm thời (429). Vui lòng chờ giây lát và thử lại.';
      } else if (
        rawMessage.includes('API_KEY') ||
        rawMessage.includes('401') ||
        rawMessage.includes('403')
      ) {
        friendly = 'GEMINI_API_KEY không hợp lệ hoặc chưa được cấp quyền truy cập mô hình.';
      } else if (rawMessage) {
        friendly = `Lỗi hỏi đáp Gemini AI: ${rawMessage}`;
      }
      res.status(502).json({ error: friendly });
    }
  });

  // Authentication Endpoints
  app.get('/api/auth/me', (req: Request, res: Response) => {
    const session = extractSession(req);
    if (!session) {
      res.json({ authenticated: false, username: null });
      return;
    }
    res.json({ authenticated: true, username: session.username });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const body = req.body as { username?: string; password?: string } | undefined;
    const username = (body?.username || '').trim();
    const password = body?.password || '';

    if (!username || !password) {
      res.status(400).json({ error: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.' });
      return;
    }

    const candidateHash = crypto.scryptSync(password, PASSWORD_SALT, 64);
    const usernameMatch = username === ADMIN_USERNAME;
    const passwordMatch = crypto.timingSafeEqual(candidateHash, PASSWORD_HASH);

    if (!usernameMatch || !passwordMatch) {
      res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu quản trị không đúng.' });
      return;
    }

    const token = signSession(username);
    const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';

    res.cookie(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: isHttps ? 'none' : 'lax',
      secure: isHttps,
      maxAge: SESSION_TTL_MS,
      path: '/',
    });

    res.json({
      authenticated: true,
      username,
      token,
    });
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
    res.clearCookie(SESSION_COOKIE_NAME, {
      httpOnly: true,
      sameSite: isHttps ? 'none' : 'lax',
      secure: isHttps,
      path: '/',
    });
    res.json({ authenticated: false });
  });

  // Protected Admin Single Image Upload Endpoint
  app.post('/api/admin/upload', requireAdmin, (req: Request, res: Response) => {
    try {
      const body = req.body as { fileName?: string; mimeType?: string; dataBase64?: string } | undefined;
      if (!body?.dataBase64 || !body?.mimeType) {
        res.status(400).json({ error: 'Thiếu dữ liệu tệp ảnh tải lên.' });
        return;
      }

      const imageUrl = saveBase64Image(body.fileName || 'folio', body.mimeType, body.dataBase64);
      res.json({ imageUrl });
    } catch (err) {
      res.status(400).json({
        error: err instanceof Error ? err.message : 'Không thể lưu tệp ảnh lên máy chủ.',
      });
    }
  });

  // Protected Admin: Unified Image Management (11-field MediaImageAsset CRUD + Batch Upload)
  app.post('/api/admin/media', requireAdmin, (req: Request, res: Response) => {
    const body = req.body as Partial<MediaImageAsset> & { syncToFolio?: boolean };
    if (!body.imageCode?.trim() || !body.name?.trim() || !body.imageUrl?.trim()) {
      res.status(400).json({
        error: 'Mã hình ảnh, tên hình ảnh và đường dẫn hình ảnh là bắt buộc.',
      });
      return;
    }

    const db = readDb();
    if (db.mediaImages.some((m) => m.imageCode.toLowerCase() === body.imageCode!.trim().toLowerCase())) {
      res.status(400).json({ error: `Mã hình ảnh ${body.imageCode.trim()} đã tồn tại.` });
      return;
    }

    const asset: MediaImageAsset = {
      id: `media-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`,
      imageCode: body.imageCode.trim(),
      dossierCode: (body.dossierCode || 'B02-00001').trim(),
      folioCode: (body.folioCode || 'TOAN-TRANG').trim(),
      name: body.name.trim(),
      imageUrl: body.imageUrl.trim(),
      category: body.category || 'Ảnh bản sao số hóa',
      caption: (body.caption || body.name).trim(),
      source: (body.source || 'Đang chờ cập nhật nguồn tư liệu').trim(),
      originalStatus: (body.originalStatus || 'Chưa xác minh tình trạng bản gốc').trim(),
      verificationStatus: body.verificationStatus || 'Chưa xác minh',
      publicRightsStatus: (
        body.publicRightsStatus || 'Đang tìm hiểu — Chưa xác nhận quyền công khai'
      ).trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    };

    db.mediaImages.push(asset);

    if (body.syncToFolio !== false) {
      const targetPage = parsePageFromFolioCode(asset.folioCode);
      if (targetPage) {
        const fIdx = db.folios.findIndex((f) => f.pageNumber === targetPage);
        if (fIdx !== -1) {
          db.folios[fIdx] = {
            ...db.folios[fIdx],
            imageUrl: asset.imageUrl,
            imageCaption: asset.caption,
            imageSource: asset.source,
            imageCategory: asset.category,
            originalStatus: asset.originalStatus,
            verificationStatus: asset.verificationStatus,
            updatedAt: asset.createdAt,
          };
        }
      }
    }

    writeDb(db);
    res.status(201).json({ media: asset });
  });

  app.put('/api/admin/media/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const index = db.mediaImages.findIndex((m) => m.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Không tìm thấy bản ghi hình ảnh cần cập nhật.' });
      return;
    }

    const patch = req.body as Partial<MediaImageAsset> & { syncToFolio?: boolean };
    if (patch.name !== undefined && !patch.name.trim()) {
      res.status(400).json({ error: 'Tên hình ảnh không được để trống.' });
      return;
    }
    if (patch.imageUrl !== undefined && !patch.imageUrl.trim()) {
      res.status(400).json({ error: 'Đường dẫn hình ảnh không được để trống.' });
      return;
    }

    const current = db.mediaImages[index];
    const updated: MediaImageAsset = {
      ...current,
      imageCode: patch.imageCode !== undefined ? patch.imageCode.trim() : current.imageCode,
      dossierCode: patch.dossierCode !== undefined ? patch.dossierCode.trim() : current.dossierCode,
      folioCode: patch.folioCode !== undefined ? patch.folioCode.trim() : current.folioCode,
      name: patch.name !== undefined ? patch.name.trim() : current.name,
      imageUrl: patch.imageUrl !== undefined ? patch.imageUrl.trim() : current.imageUrl,
      category: patch.category ?? current.category,
      caption: patch.caption !== undefined ? patch.caption.trim() : current.caption,
      source: patch.source !== undefined ? patch.source.trim() : current.source,
      originalStatus:
        patch.originalStatus !== undefined ? patch.originalStatus.trim() : current.originalStatus,
      verificationStatus: patch.verificationStatus ?? current.verificationStatus,
      publicRightsStatus:
        patch.publicRightsStatus !== undefined
          ? patch.publicRightsStatus.trim()
          : current.publicRightsStatus,
    };

    db.mediaImages[index] = updated;

    if (patch.syncToFolio !== false) {
      const targetPage = parsePageFromFolioCode(updated.folioCode);
      if (targetPage) {
        const fIdx = db.folios.findIndex((f) => f.pageNumber === targetPage);
        if (fIdx !== -1) {
          db.folios[fIdx] = {
            ...db.folios[fIdx],
            imageUrl: updated.imageUrl,
            imageCaption: updated.caption,
            imageSource: updated.source,
            imageCategory: updated.category,
            originalStatus: updated.originalStatus,
            verificationStatus: updated.verificationStatus,
            updatedAt: new Date().toISOString().slice(0, 10),
          };
        }
      }
    }

    writeDb(db);
    res.json({ media: updated });
  });

  app.delete('/api/admin/media/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const index = db.mediaImages.findIndex((m) => m.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Không tìm thấy hình ảnh để xóa.' });
      return;
    }

    const removed = db.mediaImages[index];
    db.mediaImages.splice(index, 1);

    // If any folio references this exact removed URL, revert to waiting state
    db.folios = db.folios.map((f) => {
      if (f.imageUrl === removed.imageUrl) {
        return {
          ...f,
          imageUrl: '',
          imageCaption: 'Khu vực chờ bổ sung ảnh chụp tư liệu gốc sau khi tiếp cận bản A.1046.',
          imageSource: 'Chưa tiếp cận tư liệu gốc A.1046',
          imageCategory: undefined,
          originalStatus: 'Chưa có ảnh bản gốc hoặc bản sao',
        };
      }
      return f;
    });

    writeDb(db);
    res.json({ deletedId: req.params.id });
  });

  // Protected Admin: Batch Image Upload & Assignment to Folios (A.1046-T01..T82)
  app.post('/api/admin/media/batch', requireAdmin, (req: Request, res: Response) => {
    interface BatchItemInput {
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

    const body = req.body as { items?: BatchItemInput[] } | undefined;
    if (!Array.isArray(body?.items) || body.items.length === 0) {
      res.status(400).json({ error: 'Danh sách ảnh tải lên hàng loạt đang trống.' });
      return;
    }
    if (body.items.length > 20) {
      res.status(400).json({ error: 'Mỗi đợt tải hàng loạt tối đa 20 ảnh để đảm bảo ổn định.' });
      return;
    }

    const db = readDb();
    const createdAssets: MediaImageAsset[] = [];
    const today = new Date().toISOString().slice(0, 10);

    try {
      for (let i = 0; i < body.items.length; i += 1) {
        const item = body.items[i];
        const pageNum = Number(item.targetPage);
        if (!Number.isInteger(pageNum) || pageNum < 1 || pageNum > 82) {
          throw new Error(`Ảnh "${item.fileName}" có số trang đích không hợp lệ (phải từ 1 đến 82).`);
        }

        const imageUrl = saveBase64Image(item.fileName, item.mimeType, item.dataBase64);
        const folioCode = `A.1046-T${String(pageNum).padStart(2, '0')}`;
        const seqNum = db.mediaImages.length + createdAssets.length + 1;
        const imageCode = `IMG-B02-${String(seqNum).padStart(3, '0')}`;
        const category: ImageCategory = item.category || 'Ảnh bản sao số hóa';
        const verificationStatus: VerificationState = item.verificationStatus || 'Đang xác minh';
        const caption = (
          item.caption || `Ảnh trang ${String(pageNum).padStart(2, '0')} (${folioCode})`
        ).trim();
        const source = (item.source || 'Tải lên từ máy tính quản trị viên').trim();
        const originalStatus = (
          item.originalStatus || 'Chưa xác minh tình trạng bản gốc A.1046'
        ).trim();
        const publicRightsStatus = (
          item.publicRightsStatus || 'Đang tìm hiểu — Chưa xác nhận quyền công khai'
        ).trim();

        const asset: MediaImageAsset = {
          id: `media-${Date.now()}-${i}-${crypto.randomBytes(2).toString('hex')}`,
          imageCode,
          dossierCode: (item.dossierCode || 'B02-00001').trim(),
          folioCode,
          name: (item.name || item.fileName.replace(/\.[^.]+$/, '')).trim(),
          imageUrl,
          category,
          caption,
          source,
          originalStatus,
          verificationStatus,
          publicRightsStatus,
          createdAt: today,
        };

        createdAssets.push(asset);

        const fIdx = db.folios.findIndex((f) => f.pageNumber === pageNum);
        if (fIdx !== -1) {
          db.folios[fIdx] = {
            ...db.folios[fIdx],
            imageUrl,
            imageCaption: caption,
            imageSource: source,
            imageCategory: category,
            originalStatus,
            verificationStatus,
            status: verificationStatus === 'Đã xác minh' ? 'verified' : db.folios[fIdx].status,
            updatedAt: today,
          };
        }
      }

      db.mediaImages.push(...createdAssets);
      writeDb(db);
      res.status(201).json({ created: createdAssets });
    } catch (err) {
      res.status(400).json({
        error: err instanceof Error ? err.message : 'Lỗi khi xử lý tải ảnh hàng loạt.',
      });
    }
  });

  // Protected Admin: Update Folio (82 pages)
  app.put('/api/admin/folios/:pageNumber', requireAdmin, (req: Request, res: Response) => {
    const pageNumber = Number(req.params.pageNumber);
    if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > 82) {
      res.status(400).json({ error: 'Số trang phải nằm trong khoảng từ 1 đến 82.' });
      return;
    }

    const db = readDb();
    const index = db.folios.findIndex((f) => f.pageNumber === pageNumber);
    if (index === -1) {
      res.status(404).json({ error: 'Không tìm thấy trang tư liệu.' });
      return;
    }

    const patch = req.body as Partial<FolioRecord>;
    if (patch.title !== undefined && patch.title.trim().length === 0) {
      res.status(400).json({ error: 'Tiêu đề trang tư liệu không được để trống.' });
      return;
    }

    const current = db.folios[index];
    const updated: FolioRecord = {
      ...current,
      title: patch.title !== undefined ? patch.title.trim() : current.title,
      summary: patch.summary !== undefined ? patch.summary.trim() : current.summary,
      status: patch.status ?? current.status,
      statusLabel: patch.statusLabel !== undefined ? patch.statusLabel.trim() : current.statusLabel,
      verificationStatus: patch.verificationStatus ?? current.verificationStatus,
      imageUrl: patch.imageUrl !== undefined ? patch.imageUrl.trim() : current.imageUrl,
      imageCaption: patch.imageCaption !== undefined ? patch.imageCaption.trim() : current.imageCaption,
      imageSource: patch.imageSource !== undefined ? patch.imageSource.trim() : current.imageSource,
      imageCategory: patch.imageCategory ?? current.imageCategory,
      originalStatus:
        patch.originalStatus !== undefined ? patch.originalStatus.trim() : current.originalStatus,
      transcriptionText:
        patch.transcriptionText !== undefined ? patch.transcriptionText : current.transcriptionText,
      translationText:
        patch.translationText !== undefined ? patch.translationText : current.translationText,
      columns: Array.isArray(patch.columns) ? patch.columns : current.columns,
      uncertainMarks: Array.isArray(patch.uncertainMarks)
        ? patch.uncertainMarks
        : current.uncertainMarks,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    db.folios[index] = updated;
    writeDb(db);
    res.json({ folio: updated });
  });

  app.delete('/api/admin/folios/:pageNumber/image', requireAdmin, (req: Request, res: Response) => {
    const pageNumber = Number(req.params.pageNumber);
    if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > 82) {
      res.status(400).json({ error: 'Số trang không hợp lệ (1–82).' });
      return;
    }
    const db = readDb();
    const index = db.folios.findIndex((f) => f.pageNumber === pageNumber);
    if (index === -1) {
      res.status(404).json({ error: 'Không tìm thấy trang tư liệu.' });
      return;
    }

    const current = db.folios[index];
    const updated: FolioRecord = {
      ...current,
      imageUrl: '',
      imageCaption: 'Khu vực chờ bổ sung ảnh chụp tư liệu gốc sau khi tiếp cận bản A.1046.',
      imageSource: 'Chưa tiếp cận tư liệu gốc A.1046',
      imageCategory: undefined,
      originalStatus: 'Chưa có ảnh bản gốc hoặc bản sao',
      verificationStatus: 'Chưa xác minh',
      status: 'planned',
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    db.folios[index] = updated;
    writeDb(db);
    res.json({ folio: updated });
  });

  // Protected Admin: 21 Dossiers CRUD
  app.post('/api/admin/dossiers', requireAdmin, (req: Request, res: Response) => {
    const body = req.body as Partial<DocumentDossier>;
    if (!body.dossierCode?.trim() || !body.documentName?.trim()) {
      res.status(400).json({ error: 'Mã hồ sơ và tên tư liệu là bắt buộc.' });
      return;
    }

    const db = readDb();
    const duplicate = db.dossiers.some(
      (d) => d.dossierCode.toLowerCase() === body.dossierCode!.trim().toLowerCase()
    );
    if (duplicate) {
      res.status(400).json({ error: `Mã hồ sơ ${body.dossierCode.trim()} đã tồn tại.` });
      return;
    }

    const primaryPage = Number(body.primaryPage) || 1;
    if (primaryPage < 1 || primaryPage > 82) {
      res.status(400).json({ error: 'Trang liên kết chính phải nằm trong khoảng 1–82.' });
      return;
    }

    const newDossier: DocumentDossier = {
      id: `${body.dossierCode.trim().toLowerCase()}-${Date.now()}`,
      dossierCode: body.dossierCode.trim(),
      documentName: body.documentName.trim(),
      callNumber: (body.callNumber || 'A.1046').trim(),
      relatedPages: (body.relatedPages || `Trang ${String(primaryPage).padStart(2, '0')}`).trim(),
      primaryPage,
      contentType: body.contentType || 'Thế thứ dòng họ',
      generationInfo: (body.generationInfo || 'Chờ bổ sung thông tin thế hệ').trim(),
      linkedCharacterIds: Array.isArray(body.linkedCharacterIds) ? body.linkedCharacterIds : [],
      transcriptionContent: (body.transcriptionContent || '').trim(),
      translationContent: (body.translationContent || '').trim(),
      imagePath: (body.imagePath || '').trim(),
      referenceSource: (
        body.referenceSource ||
        'Viện Nghiên cứu Hán Nôm – Danh mục tư liệu Bối Khê Trạng nguyên gia phả, ký hiệu A.1046'
      ).trim(),
      repositoryUnit: (
        body.repositoryUnit ||
        'Thư viện Viện Nghiên cứu Hán Nôm — 183 Đặng Tiến Đông, phường Đống Đa, Thành phố Hà Nội'
      ).trim(),
      verificationStatus: body.verificationStatus || 'Đang xác minh',
      publicRightsStatus: (
        body.publicRightsStatus ||
        'Chỉ đăng ảnh minh họa giảm kích thước phục vụ học tập phi lợi nhuận; không cho tải ảnh độ phân giải cao.'
      ).trim(),
      archivalRecord: body.archivalRecord || {
        ...db.legalInfo.archivalMasterRecord,
        identifier: body.dossierCode.trim(),
        title: body.documentName.trim(),
        repositoryRegNo: (body.callNumber || 'A.1046').trim(),
      },
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    db.dossiers.push(newDossier);
    writeDb(db);
    res.status(201).json({ dossier: newDossier });
  });

  app.put('/api/admin/dossiers/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const index = db.dossiers.findIndex((d) => d.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Không tìm thấy hồ sơ tư liệu cần cập nhật.' });
      return;
    }

    const patch = req.body as Partial<DocumentDossier>;
    if (patch.dossierCode !== undefined && !patch.dossierCode.trim()) {
      res.status(400).json({ error: 'Mã hồ sơ không được để trống.' });
      return;
    }
    if (patch.documentName !== undefined && !patch.documentName.trim()) {
      res.status(400).json({ error: 'Tên tư liệu không được để trống.' });
      return;
    }

    const current = db.dossiers[index];
    const primaryPage =
      patch.primaryPage !== undefined ? Number(patch.primaryPage) : current.primaryPage;
    if (primaryPage < 1 || primaryPage > 82) {
      res.status(400).json({ error: 'Trang liên kết chính phải nằm trong khoảng 1–82.' });
      return;
    }

    const updated: DocumentDossier = {
      ...current,
      ...patch,
      dossierCode: patch.dossierCode !== undefined ? patch.dossierCode.trim() : current.dossierCode,
      documentName:
        patch.documentName !== undefined ? patch.documentName.trim() : current.documentName,
      callNumber: patch.callNumber !== undefined ? patch.callNumber.trim() : current.callNumber,
      relatedPages:
        patch.relatedPages !== undefined ? patch.relatedPages.trim() : current.relatedPages,
      primaryPage,
      generationInfo:
        patch.generationInfo !== undefined ? patch.generationInfo.trim() : current.generationInfo,
      linkedCharacterIds: Array.isArray(patch.linkedCharacterIds)
        ? patch.linkedCharacterIds
        : current.linkedCharacterIds,
      transcriptionContent:
        patch.transcriptionContent !== undefined
          ? patch.transcriptionContent
          : current.transcriptionContent,
      translationContent:
        patch.translationContent !== undefined
          ? patch.translationContent
          : current.translationContent,
      imagePath: patch.imagePath !== undefined ? patch.imagePath.trim() : current.imagePath,
      referenceSource:
        patch.referenceSource !== undefined ? patch.referenceSource.trim() : current.referenceSource,
      repositoryUnit:
        patch.repositoryUnit !== undefined ? patch.repositoryUnit.trim() : current.repositoryUnit,
      publicRightsStatus:
        patch.publicRightsStatus !== undefined
          ? patch.publicRightsStatus.trim()
          : current.publicRightsStatus,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    db.dossiers[index] = updated;
    writeDb(db);
    res.json({ dossier: updated });
  });

  app.delete('/api/admin/dossiers/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const index = db.dossiers.findIndex((d) => d.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Không tìm thấy hồ sơ để xóa.' });
      return;
    }
    db.dossiers.splice(index, 1);
    writeDb(db);
    res.json({ deletedId: req.params.id });
  });

  // Protected Admin: Characters & Genealogy Relationships CRUD
  app.post('/api/admin/characters', requireAdmin, (req: Request, res: Response) => {
    const body = req.body as Partial<GenealogyNode>;
    if (!body.characterCode?.trim() || !body.name?.trim()) {
      res.status(400).json({ error: 'Mã nhân vật và họ tên nhân vật là bắt buộc.' });
      return;
    }

    const db = readDb();
    const duplicate = db.characters.some(
      (c) => c.characterCode.toLowerCase() === body.characterCode!.trim().toLowerCase()
    );
    if (duplicate) {
      res.status(400).json({ error: `Mã nhân vật ${body.characterCode.trim()} đã tồn tại.` });
      return;
    }

    const generation = Math.min(10, Math.max(1, Number(body.generation) || 1));
    const targetPage = Math.min(82, Math.max(1, Number(body.targetPage) || 43));

    const parentId = body.parentId ? body.parentId.trim() : null;
    if (parentId && !db.characters.some((c) => c.id === parentId)) {
      res.status(400).json({ error: 'Nhân vật cha được chọn không tồn tại.' });
      return;
    }

    const newChar: GenealogyNode = {
      id: `char-${Date.now()}`,
      characterCode: body.characterCode.trim(),
      generation,
      generationLabel: (body.generationLabel || `Đời ${generation}`).trim(),
      name: body.name.trim(),
      tabooName: (body.tabooName || 'Chưa xác minh (chờ đối chiếu A.1046)').trim(),
      roleTitle: (body.roleTitle || 'Thành viên thế thứ dòng họ Nguyễn Bối Khê').trim(),
      branch: body.branch || 'truc-he',
      branchType: body.branchType || 'Nhánh chính',
      branchLabel: (body.branchLabel || 'Nhánh chính').trim(),
      parentId,
      familyRelation: (body.familyRelation || 'Chờ xác minh quan hệ chi tiết từ bản gốc').trim(),
      folioRange: (body.folioRange || `Trang ${String(targetPage).padStart(2, '0')}`).trim(),
      targetPage,
      sourceRef: (body.sourceRef || 'Bối Khê Nguyễn tộc gia phả thế thứ (A.1046)').trim(),
      verificationStatus: body.verificationStatus || 'Chưa xác minh',
      verificationNote: (
        body.verificationNote || 'Chờ đối chiếu trực tiếp với văn bản A.1046.'
      ).trim(),
      summary: (body.summary || '').trim(),
      portraitUrl: (body.portraitUrl || '').trim() || undefined,
      portraitCaption: (body.portraitCaption || '').trim() || undefined,
      portraitSource: (body.portraitSource || '').trim() || undefined,
      portraitVerified: Boolean(body.portraitVerified),
    };

    db.characters.push(newChar);
    writeDb(db);
    res.status(201).json({ character: newChar });
  });

  app.put('/api/admin/characters/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const index = db.characters.findIndex((c) => c.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Không tìm thấy nhân vật trong sơ đồ phả hệ.' });
      return;
    }

    const patch = req.body as Partial<GenealogyNode>;
    if (patch.name !== undefined && !patch.name.trim()) {
      res.status(400).json({ error: 'Họ tên nhân vật không được để trống.' });
      return;
    }

    const nextParentId =
      patch.parentId !== undefined
        ? patch.parentId
          ? patch.parentId.trim()
          : null
        : db.characters[index].parentId;

    if (nextParentId) {
      if (!db.characters.some((c) => c.id === nextParentId)) {
        res.status(400).json({ error: 'Nhân vật cha được chọn không tồn tại.' });
        return;
      }
      if (createsCycle(db.characters, req.params.id, nextParentId)) {
        res.status(400).json({
          error: 'Quan hệ cha – con không hợp lệ (tạo vòng lặp trong cây phả hệ).',
        });
        return;
      }
    }

    const current = db.characters[index];
    const generation =
      patch.generation !== undefined
        ? Math.min(10, Math.max(1, Number(patch.generation) || current.generation))
        : current.generation;
    const targetPage =
      patch.targetPage !== undefined
        ? Math.min(82, Math.max(1, Number(patch.targetPage) || current.targetPage))
        : current.targetPage;

    const updated: GenealogyNode = {
      ...current,
      ...patch,
      characterCode:
        patch.characterCode !== undefined ? patch.characterCode.trim() : current.characterCode,
      generation,
      generationLabel:
        patch.generationLabel !== undefined
          ? patch.generationLabel.trim()
          : current.generationLabel,
      name: patch.name !== undefined ? patch.name.trim() : current.name,
      tabooName: patch.tabooName !== undefined ? patch.tabooName.trim() : current.tabooName,
      roleTitle: patch.roleTitle !== undefined ? patch.roleTitle.trim() : current.roleTitle,
      branchLabel:
        patch.branchLabel !== undefined ? patch.branchLabel.trim() : current.branchLabel,
      parentId: nextParentId,
      familyRelation:
        patch.familyRelation !== undefined ? patch.familyRelation.trim() : current.familyRelation,
      folioRange: patch.folioRange !== undefined ? patch.folioRange.trim() : current.folioRange,
      targetPage,
      sourceRef: patch.sourceRef !== undefined ? patch.sourceRef.trim() : current.sourceRef,
      verificationNote:
        patch.verificationNote !== undefined
          ? patch.verificationNote.trim()
          : current.verificationNote,
      summary: patch.summary !== undefined ? patch.summary.trim() : current.summary,
      portraitUrl:
        patch.portraitUrl !== undefined ? patch.portraitUrl.trim() || undefined : current.portraitUrl,
      portraitCaption:
        patch.portraitCaption !== undefined
          ? patch.portraitCaption.trim() || undefined
          : current.portraitCaption,
      portraitSource:
        patch.portraitSource !== undefined
          ? patch.portraitSource.trim() || undefined
          : current.portraitSource,
      portraitVerified:
        patch.portraitVerified !== undefined
          ? Boolean(patch.portraitVerified)
          : current.portraitVerified,
    };

    db.characters[index] = updated;
    writeDb(db);
    res.json({ character: updated });
  });

  app.delete('/api/admin/characters/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const index = db.characters.findIndex((c) => c.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Không tìm thấy nhân vật để xóa.' });
      return;
    }

    const removed = db.characters[index];
    db.characters.splice(index, 1);

    db.characters = db.characters.map((c) =>
      c.parentId === removed.id ? { ...c, parentId: removed.parentId } : c
    );

    db.dossiers = db.dossiers.map((d) => ({
      ...d,
      linkedCharacterIds: d.linkedCharacterIds.filter((code) => code !== removed.characterCode),
    }));

    writeDb(db);
    res.json({ deletedId: req.params.id });
  });

  // Protected Admin: Reference Sources CRUD (>= 7 sources)
  app.post('/api/admin/sources', requireAdmin, (req: Request, res: Response) => {
    const body = req.body as Partial<ReferenceSource>;
    if (!body.institution?.trim() || !body.title?.trim() || !body.url?.trim()) {
      res.status(400).json({ error: 'Tên đơn vị, tiêu đề và đường dẫn nguồn tham khảo là bắt buộc.' });
      return;
    }
    if (!isValidHttpUrl(body.url.trim())) {
      res.status(400).json({ error: 'Đường dẫn URL nguồn tham khảo phải bắt đầu bằng http:// hoặc https://.' });
      return;
    }

    const db = readDb();
    const nextId = db.sources.reduce((max, s) => Math.max(max, s.id), 0) + 1;
    const created: ReferenceSource = {
      id: nextId,
      institution: body.institution.trim(),
      title: body.title.trim(),
      url: body.url.trim(),
      note: (body.note || '').trim(),
    };
    db.sources.push(created);
    writeDb(db);
    res.status(201).json({ source: created });
  });

  app.put('/api/admin/sources/:id', requireAdmin, (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const db = readDb();
    const index = db.sources.findIndex((s) => s.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Không tìm thấy nguồn tham khảo.' });
      return;
    }

    const patch = req.body as Partial<ReferenceSource>;
    if (patch.url !== undefined && !isValidHttpUrl(patch.url.trim())) {
      res.status(400).json({ error: 'Đường dẫn URL không hợp lệ.' });
      return;
    }

    const current = db.sources[index];
    const updated: ReferenceSource = {
      ...current,
      institution:
        patch.institution !== undefined ? patch.institution.trim() : current.institution,
      title: patch.title !== undefined ? patch.title.trim() : current.title,
      url: patch.url !== undefined ? patch.url.trim() : current.url,
      note: patch.note !== undefined ? patch.note.trim() : current.note,
    };

    db.sources[index] = updated;
    writeDb(db);
    res.json({ source: updated });
  });

  app.delete('/api/admin/sources/:id', requireAdmin, (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const db = readDb();
    if (db.sources.length <= 7) {
      res.status(400).json({
        error: 'Hệ thống yêu cầu duy trì tối thiểu 7 nguồn tư liệu tham khảo.',
      });
      return;
    }
    const index = db.sources.findIndex((s) => s.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Không tìm thấy nguồn tham khảo để xóa.' });
      return;
    }
    db.sources.splice(index, 1);
    writeDb(db);
    res.json({ deletedId: id });
  });

  // Protected Admin: Legal & Public Rights Info Update
  app.put('/api/admin/legal', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const patch = req.body as Partial<ArchiveDatabase['legalInfo']>;
    db.legalInfo = {
      ...db.legalInfo,
      ...patch,
    };
    writeDb(db);
    res.json({ legalInfo: db.legalInfo });
  });

  // Protected Admin: Image Provenance Update/Add
  app.post('/api/admin/provenance', requireAdmin, (req: Request, res: Response) => {
    const body = req.body as Partial<ImageProvenanceItem>;
    if (!body.title?.trim() || !body.imageUrl?.trim() || !body.sourceOrigin?.trim()) {
      res.status(400).json({ error: 'Tiêu đề, đường dẫn ảnh và nguồn gốc hình ảnh là bắt buộc.' });
      return;
    }
    const db = readDb();
    const existingIdx = body.id ? db.imageProvenance.findIndex((p) => p.id === body.id) : -1;
    const item: ImageProvenanceItem = {
      id: body.id || `img-${Date.now()}`,
      title: body.title.trim(),
      imageUrl: body.imageUrl.trim(),
      sourceOrigin: body.sourceOrigin.trim(),
      caption: (body.caption || body.title).trim(),
      usageScope: (body.usageScope || 'Tư liệu đối chiếu A.1046').trim(),
      verificationNote: (body.verificationNote || 'Chưa xác minh bản quyền công khai.').trim(),
    };
    if (existingIdx >= 0) {
      db.imageProvenance[existingIdx] = item;
    } else {
      db.imageProvenance.push(item);
    }
    writeDb(db);
    res.json({ item });
  });

  // Protected Admin: About Project Info Update
  app.put('/api/admin/about', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const patch = req.body as Partial<ArchiveDatabase['aboutInfo']>;
    if (patch.attributionVerbatim !== undefined && !patch.attributionVerbatim.trim()) {
      res.status(400).json({ error: 'Nội dung công bố sản phẩm thực tập không được để trống.' });
      return;
    }
    db.aboutInfo = {
      ...db.aboutInfo,
      ...patch,
    };
    writeDb(db);
    res.json({ aboutInfo: db.aboutInfo });
  });

  // Vite Dev Middleware or Static Production Build
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Gia Pha So – Coi Nguon Viet server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
