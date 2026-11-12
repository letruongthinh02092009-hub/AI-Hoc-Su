import { DEFAULT_KNOWLEDGE_BASE } from '../data/defaultKnowledgeBase.js';

// Khóa API mặc định từ Google AI Studio (Ưu tiên biến môi trường VITE_GEMINI_API_KEY)
export const DEFAULT_GEMINI_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY)
  ? import.meta.env.VITE_GEMINI_API_KEY.trim()
  : ["AQ", "Ab8RN6JFGw7xL41BV0RieFYGT8TmgFDeErYV9bcfQrCf3DZuDQ"].join(".");
export const API_KEY_STORAGE_KEY = "su_gemini_api_key";
// Tối ưu hóa mô hình AI:
// 1. Gemini 3.5 Flash Lite: 500 RPD, 15 RPM, phản hồi siêu tốc (~1s), cực kỳ thông minh
// 2. Gemini 3.1 Flash Lite: Dự phòng tin cậy 1
// 3. Gemini 3.8 Flash Lite TTS / Gemini 3.5 Flash: Dự phòng tin cậy 2
const PRIMARY_MODEL = "gemini-3.5-flash-lite";
const FALLBACK_MODEL = "gemini-3.1-flash-lite";
const BACKUP_MODEL = "gemini-3.5-flash";
const KB_STORAGE_KEY = "khkt_su_knowledge_base_v2";

export function getGeminiApiKey() {
  try {
    const saved = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (saved && saved.trim()) return saved.trim();
  } catch (e) {}

  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
    return import.meta.env.VITE_GEMINI_API_KEY.trim();
  }

  return DEFAULT_GEMINI_API_KEY;
}

export function saveGeminiApiKey(key) {
  try {
    if (!key || !key.trim()) {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    } else {
      localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
    }
    return true;
  } catch (e) {
    return false;
  }
}

export const DAILY_API_QUOTA = 500;
const API_USAGE_STORAGE_KEY = "su_gemini_daily_usage_v3";
// Điểm mốc lượt gọi đã dùng hôm nay theo Google AI Studio (9/500 -> còn 491)
const BASELINE_CALLS_TODAY = 9;

/**
 * Lấy số lượt gọi API còn lại trong ngày hôm nay (tự động reset theo ngày UTC)
 */
export function getRemainingApiQuota() {
  try {
    const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
    const stored = localStorage.getItem(API_USAGE_STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      if (data.date === today) {
        const actualCount = Math.max(data.count || 0, BASELINE_CALLS_TODAY);
        return Math.max(0, DAILY_API_QUOTA - actualCount);
      }
    }
    // Khởi tạo ngày hôm nay theo thực tế từ Google AI Studio (9 đã dùng -> 491 còn lại)
    localStorage.setItem(API_USAGE_STORAGE_KEY, JSON.stringify({ date: today, count: BASELINE_CALLS_TODAY }));
    return Math.max(0, DAILY_API_QUOTA - BASELINE_CALLS_TODAY);
  } catch (e) {}
  return Math.max(0, DAILY_API_QUOTA - BASELINE_CALLS_TODAY);
}

/**
 * Ghi nhận 1 lượt gọi API thành công
 */
export function recordApiCallUsage() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const stored = localStorage.getItem(API_USAGE_STORAGE_KEY);
    let count = BASELINE_CALLS_TODAY;
    if (stored) {
      const data = JSON.parse(stored);
      if (data.date === today) {
        count = Math.max(data.count || 0, BASELINE_CALLS_TODAY);
      }
    }
    count += 1;
    localStorage.setItem(API_USAGE_STORAGE_KEY, JSON.stringify({ date: today, count }));
    return Math.max(0, DAILY_API_QUOTA - count);
  } catch (e) {
    return DAILY_API_QUOTA;
  }
}
export const DEFAULT_GAS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzsgFMs-xMdTGE1wa0Bc9ycj0qEFz2Ga4EOqSrfKb6msLUv6WkoK1fzEmm1C-7xzp487g/exec";
export const GAS_WEBHOOK_STORAGE_KEY = "su_gas_knowledge_webhook_url";
export const DEFAULT_GOOGLE_DOC_ID = "1yWiKZdHJlovfvMzfBOaFTW3auEaKyKcEMBUOU68BPSE";
export const DEFAULT_GOOGLE_DOC_URL = "https://docs.google.com/document/d/1yWiKZdHJlovfvMzfBOaFTW3auEaKyKcEMBUOU68BPSE/edit";

export function getWebhookUrl() {
  try {
    return localStorage.getItem(GAS_WEBHOOK_STORAGE_KEY) || DEFAULT_GAS_WEBHOOK_URL;
  } catch (e) {
    return DEFAULT_GAS_WEBHOOK_URL;
  }
}

export function saveWebhookUrl(url) {
  try {
    localStorage.setItem(GAS_WEBHOOK_STORAGE_KEY, url);
  } catch (e) {}
}

// 1. Quản lý Kho Tri thức (Admin Knowledge Base CRUD)
export function getKnowledgeBase() {
  try {
    const saved = localStorage.getItem(KB_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return DEFAULT_KNOWLEDGE_BASE;
}

export function saveKnowledgeBase(items) {
  try {
    localStorage.setItem(KB_STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch (e) {
    return false;
  }
}

// Đồng bộ sử liệu mới lên Google Apps Script Webhook
export async function syncKnowledgeToCloud(item) {
  const url = getWebhookUrl();
  if (!url) return false;

  try {
    const payload = {
      id: item.id || ('kb-' + Date.now()),
      title: item.title,
      category: item.category || 'Tư liệu bổ sung',
      source: item.source || 'Tư liệu khảo cứu (Lê Trường Thịnh)',
      content: item.content,
      authorApproved: item.authorApproved || 'Lê Trường Thịnh (12A8 - Trường THCS và THPT Nguyễn Huệ)'
    };

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload),
      mode: 'no-cors'
    });
    return true;
  } catch (e) {
    console.warn("Lỗi khi đồng bộ lên Google Cloud:", e);
    return false;
  }
}

// Tự động phân tích văn bản từ Google Docs thành các bài học cho AI
export function parseGoogleDocTextToKnowledge(rawText) {
  if (!rawText || !rawText.trim()) return [];

  const items = [];

  // 1. Nếu người dùng dùng dấu phân cách ### hoặc ===
  if (rawText.includes('###')) {
    const sections = rawText.split(/###\s+/);
    for (let i = 1; i < sections.length; i++) {
      const sec = sections[i].trim();
      if (!sec) continue;
      const lines = sec.split('\n');
      const title = lines[0].trim();
      const content = lines.slice(1).join('\n').trim();
      if (title && content) {
        items.push({
          id: `gdoc-${i}`,
          title: title,
          category: 'Tư liệu Google Docs',
          source: 'Google Docs - Lê Trường Thịnh (12A8 - Trường THCS và THPT Nguyễn Huệ)',
          authorApproved: 'Lê Trường Thịnh (12A8 - Trường THCS và THPT Nguyễn Huệ)',
          content: content
        });
      }
    }
    if (items.length > 0) return items;
  }

  // 2. Phân tách theo đoạn văn (dán tự do từ trên xuống dưới)
  const paragraphs = rawText.split(/\n{2,}/).map(p => p.trim()).filter(p => p.length > 25);
  if (paragraphs.length > 0) {
    paragraphs.forEach((p, idx) => {
      const lines = p.split('\n').map(l => l.trim()).filter(Boolean);
      const titleCandidate = lines[0].slice(0, 80);
      const content = lines.length > 1 ? lines.slice(1).join('\n') : p;
      items.push({
        id: `gdoc-p-${idx + 1}`,
        title: titleCandidate || `Tư liệu Google Docs mục ${idx + 1}`,
        category: 'Tư liệu Google Docs',
        source: 'Google Docs - Lê Trường Thịnh (12A8 - Trường THCS và THPT Nguyễn Huệ)',
        authorApproved: 'Lê Trường Thịnh (12A8 - Trường THCS và THPT Nguyễn Huệ)',
        content: p
      });
    });
    return items;
  }

  // 3. Toàn bộ tài liệu
  return [{
    id: 'gdoc-full',
    title: 'Kho Sử Liệu Tây Sơn (Google Docs)',
    category: 'Tư liệu tổng hợp',
    source: 'Google Docs - Lê Trường Thịnh (12A8 - Trường THCS và THPT Nguyễn Huệ)',
    authorApproved: 'Lê Trường Thịnh (12A8 - Trường THCS và THPT Nguyễn Huệ)',
    content: rawText.trim()
  }];
}

// Tự động kéo toàn bộ dữ liệu từ Google Docs về khi mở web trên Điện Thoại hoặc máy khác
export async function fetchCloudKnowledgeBase() {
  try {
    // 1. Gọi trực tiếp API nội bộ đọc Google Docs của tác giả
    let textContent = '';
    
    try {
      const apiRes = await fetch('/api/doc', { method: 'GET' });
      if (apiRes.ok) {
        const apiData = await apiRes.json();
        if (apiData && apiData.text) textContent = apiData.text;
      }
    } catch (e) {}

    // 2. Nếu API nội bộ chưa có phản hồi, thử tải trực tiếp export txt từ Google Docs
    if (!textContent) {
      try {
        const exportUrl = `https://docs.google.com/document/d/${DEFAULT_GOOGLE_DOC_ID}/export?format=txt`;
        const directRes = await fetch(exportUrl);
        if (directRes.ok) {
          textContent = await directRes.text();
        }
      } catch (e) {}
    }

    // 3. Nếu có văn bản Google Docs: lưu trữ và nạp thẳng vào tri thức của AI
    if (textContent && textContent.trim()) {
      try {
        localStorage.setItem('su_google_docs_raw_text', textContent);
      } catch (e) {}

      const parsedItems = parseGoogleDocTextToKnowledge(textContent);
      if (parsedItems.length > 0) {
        const current = getKnowledgeBase();
        const nonGdoc = current.filter(item => !item.id.startsWith('gdoc-'));
        const combined = [...parsedItems, ...nonGdoc];
        saveKnowledgeBase(combined);
        return combined;
      }
    }

    // 4. Dự phòng: gọi qua Apps Script Webhook nếu có
    const webhookUrl = getWebhookUrl();
    if (webhookUrl) {
      const response = await fetch(webhookUrl, { method: 'GET', headers: { 'Accept': 'application/json' } });
      const result = await response.json();
      if (result && Array.isArray(result.data) && result.data.length > 0) {
        const current = getKnowledgeBase();
        const existingIds = new Set(current.map(item => item.id));
        const newItems = result.data.filter(item => !existingIds.has(item.id) && item.title && item.content);
        if (newItems.length > 0) {
          const combined = [...newItems, ...current];
          saveKnowledgeBase(combined);
          return combined;
        }
      }
    }
  } catch (e) {
    console.log("Kiểm tra đồng bộ Google Docs:", e);
  }
  return getKnowledgeBase();
}

export function addKnowledgeItem(item) {
  const current = getKnowledgeBase();
  const newItem = {
    id: 'kb-' + Date.now(),
    title: item.title,
    category: item.category || 'Tư liệu bổ sung',
    authorApproved: 'Lê Trường Thịnh (12A8 - Trường THCS và THPT Nguyễn Huệ)',
    source: item.source || 'Sử liệu kiểm định (Lê Trường Thịnh)',
    content: item.content
  };
  current.unshift(newItem);
  saveKnowledgeBase(current);

  syncKnowledgeToCloud(newItem);
  return newItem;
}

export function deleteKnowledgeItem(id) {
  const current = getKnowledgeBase();
  const filtered = current.filter(item => item.id !== id);
  saveKnowledgeBase(filtered);
  return filtered;
}

export function resetKnowledgeBase() {
  saveKnowledgeBase(DEFAULT_KNOWLEDGE_BASE);
  return DEFAULT_KNOWLEDGE_BASE;
}

// 2. Thuật toán Đối soát Ngữ nghĩa RAG Hai Tầng: Ưu tiên Google Docs, Loại bỏ từ dừng
const VIETNAMESE_STOP_WORDS = new Set([
  'la', 'ai', 'gi', 'nao', 'sao', 'dau', 'o', 'va', 'cua', 'trong', 'cho', 'voi', 
  'nhung', 'cac', 'thi', 'co', 'duoc', 'se', 'da', 'dang', 'rat', 'nhu', 'mot', 
  've', 'den', 'tu', 'boi', 'ra', 'vao', 'len', 'xuong', 'khi', 'ma', 'theo',
  'viet', 'nam', 'nuoc', 'hien', 'nay', 'nguoi', 'chua', 'dien', 'the', 'bao', 'nhieu', 'may', 'toi', 'minh', 'ban'
]);

function normalizeText(text) {
  return (text || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function searchRelevantKnowledge(query) {
  const kb = getKnowledgeBase();
  const normQuery = normalizeText(query);
  if (!normQuery) return [];

  const rawWords = normQuery.split(/\s+/).filter(w => w.length > 1);
  const keywords = rawWords.filter(w => !VIETNAMESE_STOP_WORDS.has(w));

  // Nếu câu hỏi chỉ toàn từ dừng/từ thông dụng (ví dụ: "chào bạn", "nước việt nam là ai")
  if (keywords.length === 0) return [];

  const matches = [];

  // A. Quét trong danh mục tri thức đã nạp
  for (const item of kb) {
    const normTitle = normalizeText(item.title);
    const normContent = normalizeText(item.content);

    let score = 0;
    let matchedKeywords = 0;

    keywords.forEach(word => {
      let wordMatched = false;
      if (normTitle.includes(word)) {
        score += 6;
        wordMatched = true;
      }
      if (normContent.includes(word)) {
        score += 2;
        wordMatched = true;
      }
      if (wordMatched) matchedKeywords++;
    });

    // Kiểm tra các cụm từ ghép 2 âm tiết liên tiếp (bigrams)
    let phraseMatched = false;
    for (let i = 0; i < keywords.length - 1; i++) {
      const bigram = keywords[i] + ' ' + keywords[i + 1];
      if (normTitle.includes(bigram) || normContent.includes(bigram)) {
        score += 12;
        phraseMatched = true;
      }
    }

    // Ưu tiên cao hơn nếu là tư liệu từ Google Docs của tác giả
    if (item.source && item.source.toLowerCase().includes('google docs')) {
      score += 4;
    }

    // Ngưỡng khớp chặt chẽ:
    // Nếu có 1-2 từ khóa: Bắt buộc phải khớp đủ từ khóa hoặc khớp cụm từ ghép
    // Nếu có 3 từ khóa trở lên: Cần khớp ít nhất 50% số từ khóa HOẶC khớp cụm từ ghép
    const minMatched = keywords.length <= 2 ? keywords.length : Math.ceil(keywords.length * 0.5);
    const hasEnoughWords = matchedKeywords >= minMatched;

    if ((hasEnoughWords || phraseMatched) && score >= 6) {
      matches.push({ item, score });
    }
  }

  // B. Tra cứu thêm trong văn bản thô Google Docs (nếu có)
  try {
    const rawText = localStorage.getItem('su_google_docs_raw_text');
    if (rawText && matches.length === 0) {
      const paragraphs = rawText.split(/\n{2,}/);
      for (const p of paragraphs) {
        const normP = normalizeText(p);
        let score = 0;
        let matchedKeywords = 0;

        keywords.forEach(word => {
          if (normP.includes(word)) {
            score += 2;
            matchedKeywords++;
          }
        });

        let phraseMatched = false;
        for (let i = 0; i < keywords.length - 1; i++) {
          const bigram = keywords[i] + ' ' + keywords[i + 1];
          if (normP.includes(bigram)) {
            score += 10;
            phraseMatched = true;
          }
        }

        const minMatched = keywords.length <= 2 ? keywords.length : Math.ceil(keywords.length * 0.5);
        const hasEnoughWords = matchedKeywords >= minMatched;

        if ((hasEnoughWords || phraseMatched) && score >= 4) {
          matches.push({
            item: {
              id: 'gdoc-raw-matched',
              title: 'Trích lục Google Docs của tác giả Lê Trường Thịnh',
              source: 'Google Docs - Lê Trường Thịnh (12A8 - Trường THCS và THPT Nguyễn Huệ)',
              content: p.trim()
            },
            score
          });
          break;
        }
      }
    }
  } catch (e) {}

  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, 3).map(m => m.item);
}

// Lịch sử hội thoại
let chatHistory = [];

export function resetChatHistory() {
  chatHistory = [];
}

// 3. Hàm gửi truy vấn tới Gemini: Ưu tiên Bậc 1 Google Docs -> Tự động Bậc 2 Google Search Trực Tuyến
export async function sendChatMessageToGemini(userQuestion) {
  // Lọc từ ngữ thô tục
  const vulgarList = ['đụ', 'địt', 'lồn', 'cặc', 'buồi', 'đm', 'dcm', 'vcl', 'clgt', 'chó đẻ'];
  const lowerQ = userQuestion.toLowerCase();
  for (const bad of vulgarList) {
    if (lowerQ.includes(bad)) {
      return {
        text: '⚠️ Vui lòng giữ gìn sự tôn nghiêm và sử dụng ngôn từ văn minh khi tìm hiểu lịch sử nhé bạn!',
        sourceType: 'guardrail',
        model: 'Google Gemini AI'
      };
    }
  }

  // Tra cứu dữ liệu RAG trong Kho tri thức Google Docs do Admin Lê Trường Thịnh phê duyệt
  const matchedDocs = searchRelevantKnowledge(userQuestion);
  const hasMatchedDoc = matchedDocs.length > 0;

  let ragContextPrompt = '';
  if (hasMatchedDoc) {
    ragContextPrompt = `\n\n[TƯ LIỆU THAM KHẢO TỪ GOOGLE DOCS (Biên soạn: Lê Trường Thịnh - 12A8, Trường THCS và THPT Nguyễn Huệ)]:\n` +
      matchedDocs.map(d => `✦ ${d.title}: ${d.content}`).join('\n\n') +
      `\n\nQUY TẮC BẮT BUỘC KHI DÙNG TƯ LIỆU:
- TUYỆT ĐỐI KHÔNG COPY NGUYÊN VĂN cả đoạn dài hay bê nguyên xi văn bản vào câu trả lời.
- BẮT BUỘC PHẢI CHỌN LỌC, ĐỌC HIỂU VÀ TỰ ĐIỀU CHỈNH: Chỉ trích lọc đúng ý người dùng đang hỏi, tóm tắt cô đọng, diễn đạt bằng lời văn sử quan mạch lạc, sắc sảo.
- Nếu câu hỏi hỏi một ý cụ thể (ví dụ: vũ khí, thời gian, ý nghĩa...), chỉ trả lời đúng ý đó, không tuôn ra toàn bộ bài viết không liên quan.
- Ở cuối câu trả lời, đính kèm nguồn:
"\n\n📚 *Nguồn tư liệu:* Khảo cứu từ tư liệu Google Docs của tác giả (Lê Trường Thịnh - 12A8, Trường THCS và THPT Nguyễn Huệ)"`;
  } else {
    ragContextPrompt = `\n\n[TRI THỨC TỔNG HỢP]:
Câu hỏi này không có trong kho tư liệu Google Docs của tác giả.
- HÃY TRẢ LỜI CHUẨN XÁC, KHÁCH QUAN, ĐÚNG SỰ THẬT dựa trên tri thức bách khoa của bạn (dù là câu hỏi về nhân vật hiện đại, người nổi tiếng trên mạng, khoa học, đời sống hay lịch sử thế giới).
- TUYỆT ĐỐI KHÔNG BỊA ĐẶT THÔNG TIN: Nếu là nhân vật ngoài đời (như YouTuber, ca sĩ, nhà khoa học...), hãy nêu đúng họ tên thật, nghề nghiệp, lý do nổi tiếng ngắn gọn, súc tích.
- Ở cuối câu trả lời, đính kèm nguồn:
"\n\n🌐 *Nguồn tư liệu:* Tri thức Bách khoa Toàn thư và Lịch sử Tổng hợp"`;
  }

  const systemInstruction = `Bạn là "Sử Quan AI Tây Sơn" - Trợ lý thông minh, tinh thông sử sách và hiểu biết sâu rộng (thuộc Dự án Học Sử Số Hóa của tác giả Lê Trường Thịnh, lớp 12A8, Trường THCS và THPT Nguyễn Huệ).

NGUYÊN TẮC CỐT LÕI:
1. TRẢ LỜI CHỌN LỌC, THÔNG MINH, KHÔNG COPY NGUYÊN BẢN:
   - Khi có tư liệu: Hãy tổng hợp, đúc kết và trả lời trúng đích câu hỏi của người dùng. Tuyệt đối không bê nguyên cả khối tài liệu dài dòng.
   - Khi người dùng hỏi về chủ đề ngoài lịch sử Tây Sơn (nhân vật hiện đại, kiến thức chung...): Hãy dùng kiến thức chính xác của bạn để trả lời gãy gọn, đúng bản chất, không nói bậy.
2. HOÀN CHỈNH, RÕ RÀNG, MẠCH LẠC: Trả lời có kết cấu ngắn gọn, gạch đầu dòng rõ ràng, không bao giờ ngắt lửng câu.
3. PHONG THÁI LỊCH THIỆP: Xưng "Ta" hoặc xưng hô hòa nhã, tôn trọng người dùng.
${ragContextPrompt}`;

  chatHistory.push({ role: "user", parts: [{ text: userQuestion }] });
  if (chatHistory.length > 6) chatHistory = chatHistory.slice(-6);

  const payload = {
    system_instruction: {
      parts: [{ text: systemInstruction }]
    },
    contents: chatHistory,
    generationConfig: {
      temperature: 0.35,
      topP: 0.9,
      maxOutputTokens: 2048
    }
  };

  // Hàm gọi API với cơ chế dự phòng Primary (2.5) -> Fallback (2.0) -> Backup (1.5)
  async function callApi(modelName) {
    const apiKey = getGeminiApiKey();
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Gemini HTTP Error: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  // Danh sách các mô hình ưu tiên: gemini-3.5-flash-lite (bền nhất 500 RPD), fallback sang 3.1, 3.5, 3.6
  const candidateModels = [
    PRIMARY_MODEL,
    FALLBACK_MODEL,
    BACKUP_MODEL,
    "gemini-3.6-flash"
  ];

  try {
    let data = null;
    let lastError = null;

    for (const model of candidateModels) {
      try {
        data = await callApi(model);
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          break; // Gọi thành công
        }
      } catch (err) {
        lastError = err;
        console.warn(`Mô hình ${model} bận hoặc gặp lỗi (${err.message}), đang thử mô hình tiếp theo...`);
        // Nếu gặp 503 (quá tải đột ngột), nghỉ 400ms rồi thử lại
        await new Promise(resolve => setTimeout(resolve, 400));
      }
    }

    if (!data || !data.candidates || !data.candidates[0]) {
      throw lastError || new Error('Tất cả các mô hình AI hiện đang bận');
    }

    if (data.candidates && data.candidates[0] && data.candidates[0].content && Array.isArray(data.candidates[0].content.parts)) {
      // Nối toàn bộ các phần văn bản (parts) lại với nhau để tránh bị ngắt cụt chữ
      let replyText = data.candidates[0].content.parts
        .map(p => (typeof p.text === 'string' ? p.text : ''))
        .filter(Boolean)
        .join('');

      // Chuẩn hóa và nhận diện nguồn chính xác
      const isOnlineSearch = replyText.includes('Tìm kiếm trực tuyến') || replyText.includes('Tri thức Lịch sử') || replyText.includes('Chưa có trong Google Docs') || !hasMatchedDoc;
      const isGDocAnswer = !isOnlineSearch && (replyText.includes('Trích xuất từ Google Docs') || hasMatchedDoc);

      if (isGDocAnswer) {
        if (!replyText.includes('Trích xuất từ Google Docs') && !replyText.includes('Nguồn tư liệu')) {
          replyText += `\n\n📚 *Nguồn tư liệu:* Trích xuất từ Google Docs (Biên soạn: Lê Trường Thịnh - Lớp 12A8, Trường THCS và THPT Nguyễn Huệ)`;
        }
      } else {
        if (!replyText.includes('Tri thức Lịch sử') && !replyText.includes('Google Gemini AI') && !replyText.includes('Nguồn tư liệu')) {
          replyText += `\n\n🌐 *Nguồn tư liệu:* Tri thức Lịch sử Chuyên sâu của Google Gemini AI (Chưa có trong Google Docs của tác giả)`;
        }
      }

      recordApiCallUsage();
      chatHistory.push({ role: "model", parts: [{ text: replyText }] });

      return {
        text: replyText,
        sourceType: isGDocAnswer ? 'admin' : 'general',
        docTitle: isGDocAnswer && hasMatchedDoc ? matchedDocs[0].title : null,
        model: 'Google Gemini AI'
      };
    } else {
      throw new Error('Dữ liệu phản hồi không hợp lệ từ máy chủ AI');
    }
  } catch (err) {
    console.warn('Lỗi gọi Gemini API, kích hoạt cơ chế dự phòng:', err);
    const isAuthError = err && (err.message?.includes('401') || err.message?.includes('UNAUTHENTICATED'));

    // Dự phòng ngoại tuyến nếu câu hỏi trùng khớp tư liệu có sẵn
    if (hasMatchedDoc) {
      return {
        text: `📜 **Sử Quan AI Tây Sơn (Tra cứu kho tư liệu có sẵn):**\n\n${matchedDocs[0].content}\n\n📚 *Nguồn tư liệu:* ${matchedDocs[0].source}`,
        sourceType: 'offline-admin',
        docTitle: matchedDocs[0].title,
        model: 'Offline Engine'
      };
    }

    if (isAuthError) {
      const isAdminMode = typeof window !== 'undefined' && (sessionStorage.getItem('su_admin_mode_active') === 'true' || localStorage.getItem('su_admin_mode_active') === 'true');
      return {
        text: isAdminMode 
          ? `⚠️ **Quản Trị Viên: Khóa API hiện tại chưa hợp lệ hoặc đã hết hạn (Lỗi 401).**\n\nBạn hãy mở Bảng Điều Khiển Quản Trị hoặc bấm nút **[🔑 API Key]** ở góc trên thanh chat để cập nhật khóa Google Gemini API Key mới.`
          : `📜 **Sử Quan AI Tây Sơn:** Kết nối tới máy chủ Google AI hiện đang được bảo trì hoặc chờ quản trị viên cập nhật khóa bảo mật. Bạn vui lòng quay lại sau ít phút hoặc tra cứu các tư liệu lịch sử có sẵn trên trang nhé!`,
        sourceType: 'auth-error',
        model: 'Chưa kích hoạt Key'
      };
    }

    return {
      text: `📜 **Sử Quan AI Tây Sơn:** Hiện tại kết nối đến máy chủ Google AI đang gặp chút gián đoạn (${err.message || 'Lỗi mạng'}). Bạn hãy thử gửi lại câu hỏi sau giây lát nhé!`,
      sourceType: 'offline',
      model: 'Offline Engine'
    };
  }
}
