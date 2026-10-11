import { DEFAULT_KNOWLEDGE_BASE } from '../data/defaultKnowledgeBase.js';

const GEMINI_API_KEY = "AQ.Ab8RN6KVY_X5n_CaZMGXEZ6OSngx6W5kUEE1iw6yPczaMywIEQ";
const PRIMARY_MODEL = "gemini-2.5-flash";
const FALLBACK_MODEL = "gemini-3.5-flash-lite";
const KB_STORAGE_KEY = "khkt_su_knowledge_base_v2";
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
      authorApproved: item.authorApproved || 'Lê Trường Thịnh (12A8 THPT Nguyễn Huệ)'
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
          source: 'Google Docs - Lê Trường Thịnh (12A8 THPT Nguyễn Huệ)',
          authorApproved: 'Lê Trường Thịnh (12A8 THPT Nguyễn Huệ)',
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
        source: 'Google Docs - Lê Trường Thịnh (12A8 THPT Nguyễn Huệ)',
        authorApproved: 'Lê Trường Thịnh (12A8 THPT Nguyễn Huệ)',
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
    source: 'Google Docs - Lê Trường Thịnh (12A8 THPT Nguyễn Huệ)',
    authorApproved: 'Lê Trường Thịnh (12A8 THPT Nguyễn Huệ)',
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
    authorApproved: 'Lê Trường Thịnh (12A8 THPT Nguyễn Huệ)',
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
              source: 'Google Docs - Lê Trường Thịnh (12A8 THPT Nguyễn Huệ)',
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
    ragContextPrompt = `\n\n[KỊCH BẢN ƯU TIÊN BẬC 1: TƯ LIỆU CHÍNH THỐNG TỪ GOOGLE DOCS DO TÁC GIẢ (Lê Trường Thịnh - 12A8 THPT Nguyễn Huệ) BIÊN SOẠN]:\n` +
      matchedDocs.map(d => `✦ Tiêu đề: ${d.title}\n✦ Nguồn: ${d.source}\n✦ Nội dung: ${d.content}`).join('\n\n') +
      `\n\nQUY TẮC BẮT BUỘC:
- NẾU câu hỏi của người dùng có dữ liệu giải đáp trong nội dung Google Docs trên: Bạn BẮT BUỘC ưu tiên trả lời theo thông tin từ Google Docs này.
Ở cuối câu trả lời, hãy đính kèm đúng cú pháp nguồn:
"\n\n📚 *Nguồn tư liệu:* Trích xuất từ Google Docs (Biên soạn: Lê Trường Thịnh - Lớp 12A8 THPT Nguyễn Huệ)"
- NẾU câu hỏi của người dùng hỏi về khía cạnh KHÔNG CÓ trong Google Docs trên: Bạn HÃY TỰ ĐỘNG TÌM KIẾM TRỰC TUYẾN TRÊN MẠNG (Google Search) và sử dụng tri thức mở của Google Gemini AI để giải đáp chuẩn xác nhất cho người dùng.
Ở cuối câu trả lời, hãy đính kèm đúng cú pháp nguồn:
"\n\n🌐 *Nguồn tư liệu:* Tìm kiếm trực tuyến & Tri thức Google Gemini AI (Chưa có trong Google Docs của tác giả)"`;
  } else {
    ragContextPrompt = `\n\n[KỊCH BẢN BẬC 2: TỰ ĐỘNG TÌM KIẾM TRỰC TUYẾN TRÊN MẠNG (GOOGLE SEARCH)]:\nThông tin cho câu hỏi này HIỆN CHƯA CÓ trong file Google Docs của tác giả Lê Trường Thịnh.\nTheo kịch bản của tác giả: Bạn HÃY TỰ ĐỘNG LÊN MẠNG TÌM KIẾM (Google Search) và vận dụng tri thức mở rộng của Google Gemini AI để tìm kiếm thông tin mới nhất và giải đáp đầy đủ, chính xác, khách quan cho người dùng (ví dụ: về các sự kiện lịch sử khác, nhân vật thời nay, chủ tịch nước, văn hóa xã hội...).\n\nQUY TẮC BẮT BUỘC ĐỂ TRÁNH NHẦM LẪN: Ở cuối câu trả lời, bạn BẮT BUỘC đính kèm đúng cú pháp nguồn sau để người đọc phân biệt rõ ràng:\n"\n\n🌐 *Nguồn tư liệu:* Tìm kiếm trực tuyến & Tri thức Google Gemini AI (Chưa có trong Google Docs của tác giả)"`;
  }

  const systemInstruction = `Bạn là "Sử Quan AI Tây Sơn" - Trợ lý thông minh, am tường sử sách và tin cậy của nền tảng Học Sử Số Hóa (Dự án của tác giả Lê Trường Thịnh, lớp 12A8, Trường THPT Nguyễn Huệ).

PHONG THÁI GIAO TIẾP:
1. THÂN THIỆN & CỞI MỞ: Khi người dùng chào hỏi hoặc tự giới thiệu, hãy niềm nở chào lại và gọi đúng tên người dùng.
2. TRẢ LỜI ĐÚNG TRỌNG TÂM, GÃY GỌN & KHOA HỌC: Đi thẳng vào bản chất câu hỏi ngay câu đầu tiên. Giải thích sinh động, khoa học trong 2 - 3 đoạn hoặc gạch đầu dòng rõ ràng.
3. KỊCH BẢN 2 TẦNG NGUỒN TRI THỨC:${ragContextPrompt}`;

  chatHistory.push({ role: "user", parts: [{ text: userQuestion }] });
  if (chatHistory.length > 6) chatHistory = chatHistory.slice(-6);

  const payload = {
    system_instruction: {
      parts: [{ text: systemInstruction }]
    },
    contents: chatHistory,
    tools: [{ googleSearch: {} }],
    generationConfig: {
      temperature: 0.3,
      topP: 0.85,
      maxOutputTokens: 850
    }
  };

  // Hàm gọi API với cơ chế dự phòng Primary -> Fallback Model
  async function callApi(modelName) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
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

  try {
    let data;
    try {
      data = await callApi(PRIMARY_MODEL);
    } catch (primaryErr) {
      console.warn(`Lỗi gọi mô hình chính (${PRIMARY_MODEL}), chuyển sang dự phòng (${FALLBACK_MODEL}):`, primaryErr);
      data = await callApi(FALLBACK_MODEL);
    }

    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      let replyText = data.candidates[0].content.parts[0].text;

      // Chuẩn hóa và nhận diện nguồn chính xác
      const isOnlineSearch = replyText.includes('Tìm kiếm trực tuyến') || replyText.includes('Chưa có trong Google Docs') || !hasMatchedDoc;
      const isGDocAnswer = !isOnlineSearch && (replyText.includes('Trích xuất từ Google Docs') || hasMatchedDoc);

      if (isGDocAnswer) {
        if (!replyText.includes('Trích xuất từ Google Docs') && !replyText.includes('Nguồn tư liệu')) {
          replyText += `\n\n📚 *Nguồn tư liệu:* Trích xuất từ Google Docs (Biên soạn: Lê Trường Thịnh - Lớp 12A8 THPT Nguyễn Huệ)`;
        }
      } else {
        if (!replyText.includes('Tìm kiếm trực tuyến') && !replyText.includes('Google Gemini AI') && !replyText.includes('Nguồn tư liệu')) {
          replyText += `\n\n🌐 *Nguồn tư liệu:* Tìm kiếm trực tuyến & Tri thức Google Gemini AI (Chưa có trong Google Docs của tác giả)`;
        }
      }

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
    console.warn('Lỗi gọi Gemini API, kích hoạt cơ chế dự phòng ngoại tuyến:', err);
    // Dự phòng ngoại tuyến nếu có tư liệu Google Docs
    if (hasMatchedDoc) {
      return {
        text: `📜 **Sử Quan AI Tây Sơn (Chế độ Ngoại tuyến):**\n\n${matchedDocs[0].content}\n\n📚 *Nguồn tư liệu:* ${matchedDocs[0].source} (Admin Lê Trường Thịnh phê duyệt - Ngoại tuyến)`,
        sourceType: 'offline-admin',
        docTitle: matchedDocs[0].title,
        model: 'Offline Engine'
      };
    }
    return {
      text: `📜 **Sử Quan AI Tây Sơn:** Hiện tại kết nối đến mạng tìm kiếm AI đang gặp chút gián đoạn. Bạn hãy thử gửi lại câu hỏi sau giây lát hoặc khám phá các tư liệu đã nạp sẵn trên website nhé!`,
      sourceType: 'offline',
      model: 'Offline Engine'
    };
  }
}
