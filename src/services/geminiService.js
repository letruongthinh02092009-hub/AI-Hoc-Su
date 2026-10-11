// Dịch vụ Tích hợp Gemini 2.5 Flash & Hệ thống Quản trị Tri thức RAG
import { DEFAULT_KNOWLEDGE_BASE } from '../data/defaultKnowledgeBase';

const GEMINI_API_KEY = "AQ.Ab8RN6KVY_X5n_CaZMGXEZ6OSngx6W5kUEE1iw6yPczaMywIEQ";
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent";
const KB_STORAGE_KEY = "khkt_su_knowledge_base_v2";
export const DEFAULT_GAS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzsgFMs-xMdTGE1wa0Bc9ycj0qEFz2Ga4EOqSrfKb6msLUv6WkoK1fzEmm1C-7xzp487g/exec";
export const GAS_WEBHOOK_STORAGE_KEY = "su_gas_knowledge_webhook_url";

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

// Đồng bộ sử liệu mới lên Google Apps Script Webhook (lưu vĩnh viễn trên Google Sheets)
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

    // Google Apps Script Web App chấp nhận text/plain để tránh lỗi CORS Preflight
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

// Tự động kéo dữ liệu từ Google Sheets về khi mở web trên Điện Thoại hoặc máy khác
export async function fetchCloudKnowledgeBase() {
  const url = getWebhookUrl();
  if (!url) return getKnowledgeBase();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
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
  } catch (e) {
    // Có thể URL chưa bật "Anyone" hoặc lỗi mạng tạm thời
    console.log("Chưa thể kéo từ Google Cloud:", e);
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
    source: item.source || 'Sử liệu KHKT kiểm định',
    content: item.content
  };
  current.unshift(newItem);
  saveKnowledgeBase(current);

  // Tự động đẩy lên Google Cloud qua Webhook
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

// 2. Thuật toán Đối soát Ngữ nghĩa RAG (Semantic Retrieval)
function searchRelevantKnowledge(query) {
  const kb = getKnowledgeBase();
  const normQuery = query.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ');

  const matches = [];

  for (const item of kb) {
    const normTitle = item.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const normContent = item.content.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    let score = 0;
    const queryWords = normQuery.split(/\s+/).filter(w => w.length > 1);

    queryWords.forEach(word => {
      if (normTitle.includes(word)) score += 3;
      if (normContent.includes(word)) score += 1;
    });

    if (score > 2) {
      matches.push({ item, score });
    }
  }

  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, 2).map(m => m.item);
}

// Lịch sử hội thoại
let chatHistory = [];

export function resetChatHistory() {
  chatHistory = [];
}

// 3. Hàm gửi truy vấn tới Gemini 2.5 Flash có bảo vệ và RAG
export async function sendChatMessageToGemini(userQuestion) {
  // Lọc từ ngữ thô tục
  const vulgarList = ['đụ', 'địt', 'lồn', 'cặc', 'buồi', 'đm', 'dcm', 'vcl', 'clgt', 'chó đẻ'];
  const lowerQ = userQuestion.toLowerCase();
  for (const bad of vulgarList) {
    if (lowerQ.includes(bad)) {
      return {
        text: '⚠️ Vui lòng giữ gìn sự tôn nghiêm và sử dụng ngôn từ văn minh khi tìm hiểu lịch sử nhé bạn!',
        sourceType: 'guardrail',
        model: 'Gemini 3.5 Flash Lite'
      };
    }
  }

  // Tra cứu dữ liệu RAG trong Kho tri thức do Admin phê duyệt
  const matchedDocs = searchRelevantKnowledge(userQuestion);
  const hasMatchedDoc = matchedDocs.length > 0;

  let ragContextPrompt = '';
  if (hasMatchedDoc) {
    ragContextPrompt = `\n\n[DỮ LIỆU ĐẶC BIỆT ĐƯỢC ƯU TIÊN DO ADMIN (Lê Trường Thịnh - 12A8 THPT Nguyễn Huệ) PHÊ DUYỆT]:\n` +
      matchedDocs.map(d => `✦ Tiêu đề: ${d.title}\n✦ Nguồn: ${d.source}\n✦ Nội dung: ${d.content}`).join('\n\n') +
      `\n\nQUY TẮC BẮT BUỘC: Bạn PHẢI ưu tiên 100% thông tin trong dữ liệu trên để trả lời. Ở cuối câu trả lời, hãy đính kèm đúng cú pháp: "\n\n📚 *Nguồn tư liệu:* ${matchedDocs[0].source} (Được phê duyệt bởi Admin Lê Trường Thịnh)"`;
  } else {
    ragContextPrompt = `\n\nLƯU Ý: Không có dữ liệu chuyên biệt trong kho lưu trữ cho câu hỏi này. Bạn hãy sử dụng tri thức lịch sử chuẩn xác nhất của bạn và đính kèm ở cuối câu trả lời: "\n\n🌐 *Nguồn tư liệu:* Tri thức tổng quát (Được xác thực bởi Gemini 3.5 Flash Lite)"`;
  }

  const systemInstruction = `Bạn là "Sử Quan AI Tây Sơn" - Trợ lý Lịch sử thông minh, tâm lý và am tường sử sách của nền tảng Học Sử Số Hóa (Đề tài KHKT của tác giả Lê Trường Thịnh, lớp 12A8, Trường THPT Nguyễn Huệ).

TÍNH CÁCH & PHONG THÁI GIAO TIẾP:
1. THÂN THIỆN & CỞI MỞ:
   - Khi người dùng chào hỏi hoặc tự giới thiệu (ví dụ: "chào bạn", "mình là Khang", "hi"): Hãy chào lại niềm nở, gọi đúng tên người dùng (ví dụ: "Chào bạn Khang! Rất vui được đồng hành cùng bạn...").
   - Nhớ tên người dùng trong suốt cuộc hội thoại để xưng hô thân mật như một người bạn học.
2. TRẢ LỜI ĐÚNG TRỌNG TÂM, GÃY GỌN & KHOA HỌC:
   - Đi thẳng vào bản chất câu hỏi ngay câu đầu tiên.
   - Giải thích ngắn gọn trong 2 - 3 đoạn hoặc dùng gạch đầu dòng rõ ràng, sinh động. Đọc trong 15 giây là nắm trọn bài học.
3. KẾT NỐI TƯƠNG TÁC:
   - Khéo léo gợi mở người dùng trải nghiệm các tính năng trên web (Sa bàn chiến trận Leaflet, Bảo tàng số 3D, Đấu trường đố vui 30 câu).
4. CHÍNH XÁC SỬ LIỆU 100%: Dựa theo Đại Nam Thực Lục, Hoàng Lê Nhất Thống Chí. Không bịa đặt.${ragContextPrompt}`;

  try {
    chatHistory.push({ role: "user", parts: [{ text: userQuestion }] });
    if (chatHistory.length > 6) chatHistory = chatHistory.slice(-6);

    const payload = {
      system_instruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: chatHistory,
      generationConfig: {
        temperature: 0.3,
        topP: 0.85,
        maxOutputTokens: 650
      }
    };

    const response = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Gemini HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      const replyText = data.candidates[0].content.parts[0].text;
      chatHistory.push({ role: "model", parts: [{ text: replyText }] });

      return {
        text: replyText,
        sourceType: hasMatchedDoc ? 'admin' : 'general',
        docTitle: hasMatchedDoc ? matchedDocs[0].title : null,
        model: 'Gemini 3.5 Flash Lite'
      };
    } else {
      throw new Error('Dữ liệu phản hồi không hợp lệ');
    }
  } catch (err) {
    console.warn('Lỗi gọi Gemini API, chuyển sang cơ chế dự phòng cục bộ:', err);
    // Dự phòng offline từ kho tri thức
    if (hasMatchedDoc) {
      return {
        text: `📜 **Sử Quan AI Tây Sơn (Chế độ Ngoại tuyến):**\n\n${matchedDocs[0].content}\n\n📚 *Nguồn tư liệu:* ${matchedDocs[0].source} (Admin Lê Trường Thịnh phê duyệt - Ngoại tuyến)`,
        sourceType: 'offline-admin',
        docTitle: matchedDocs[0].title,
        model: 'Offline Engine'
      };
    }
    return {
      text: `📜 **Sử Quan AI Tây Sơn:** Hiện tại kết nối mạng đang gián đoạn, nhưng bạn có thể khám phá trực tiếp các mốc son trong Dòng thời gian hoặc chiêm ngưỡng Bảo tàng hiện vật ở thanh menu bên trên nhé!`,
      sourceType: 'offline',
      model: 'Offline Engine'
    };
  }
}
