// Dịch vụ Tích hợp Gemini 2.5 Flash & Hệ thống Quản trị Tri thức RAG
import { DEFAULT_KNOWLEDGE_BASE } from '../data/defaultKnowledgeBase';

const GEMINI_API_KEY = "AQ.Ab8RN6KVY_X5n_CaZMGXEZ6OSngx6W5kUEE1iw6yPczaMywIEQ";
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent";
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

// 2. Thuật toán Đối soát Ngữ nghĩa RAG (Semantic Retrieval) ưu tiên Google Docs
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
      if (normTitle.includes(word)) score += 4;
      if (normContent.includes(word)) score += 2;
    });

    // Ưu tiên cao hơn nếu là tư liệu từ Google Docs của tác giả
    if (item.source && item.source.toLowerCase().includes('google docs')) {
      score += 3;
    }

    if (score > 2) {
      matches.push({ item, score });
    }
  }

  // Tra cứu thêm trong raw text nếu chưa tìm thấy
  try {
    const rawText = localStorage.getItem('su_google_docs_raw_text');
    if (rawText && matches.length === 0) {
      const paragraphs = rawText.split(/\n{2,}/);
      for (const p of paragraphs) {
        const normP = p.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        let score = 0;
        const queryWords = normQuery.split(/\s+/).filter(w => w.length > 1);
        queryWords.forEach(word => {
          if (normP.includes(word)) score += 2;
        });
        if (score > 2) {
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

// 3. Hàm gửi truy vấn tới Gemini có bảo vệ và RAG ưu tiên Google Docs
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
    ragContextPrompt = `\n\n[DỮ LIỆU ĐẶC BIỆT TỪ GOOGLE DOCS DO TÁC GIẢ (Lê Trường Thịnh - 12A8 THPT Nguyễn Huệ) CUNG CẤP]:\n` +
      matchedDocs.map(d => `✦ Tiêu đề: ${d.title}\n✦ Nguồn: ${d.source}\n✦ Nội dung: ${d.content}`).join('\n\n') +
      `\n\nQUY TẮC BẮT BUỘC: Bạn PHẢI trả lời hoàn toàn dựa trên tư liệu trong Google Docs trên. Trình bày khoa học, chính xác, súc tích. Ở cuối câu trả lời, hãy đính kèm đúng cú pháp:\n"\n\n📚 *Nguồn tư liệu:* Trích xuất từ Google Docs (Biên soạn: Lê Trường Thịnh - Lớp 12A8 THPT Nguyễn Huệ)"`;
  } else {
    ragContextPrompt = `\n\n[LƯU Ý QUAN TRỌNG VỀ NGUỒN TƯ LIỆU]: Thông tin cho câu hỏi này HIỆN CHƯA CÓ trong tài liệu Google Docs của tác giả Lê Trường Thịnh.\nBạn hãy sử dụng tri thức Lịch sử chuẩn xác của bạn (Đại Nam Thực Lục, SGK Lịch Sử) để giải đáp khoa học, khách quan cho học sinh.\n\nQUY TẮC BẮT BUỘC ĐỂ TRÁNH NHẦM LẪN: Ở cuối câu trả lời, bạn BẮT BUỘC đính kèm đúng cú pháp nguồn sau để người đọc phân biệt rõ:\n"\n\n🌐 *Nguồn tư liệu:* Tri thức Lịch sử chung do Google Gemini AI đối chiếu (Chưa có trong Google Docs của tác giả)"`;
  }

  const systemInstruction = `Bạn là "Sử Quan AI Tây Sơn" - Trợ lý Lịch sử thông minh, tâm lý và am tường sử sách của nền tảng Học Sử Số Hóa (Dự án số hóa di sản Lịch sử của tác giả Lê Trường Thịnh, lớp 12A8, Trường THPT Nguyễn Huệ).

TÍNH CÁCH & PHONG THÁI GIAO TIẾP:
1. THÂN THIỆN & CỞI MỞ:
   - Khi người dùng chào hỏi hoặc tự giới thiệu (ví dụ: "chào bạn", "mình là Khang", "hi"): Hãy chào lại niềm nở, gọi đúng tên người dùng (ví dụ: "Chào bạn Khang! Rất vui được đồng hành cùng bạn...").
   - Nhớ tên người dùng trong suốt cuộc hội thoại để xưng hô thân mật như một người bạn học.
2. TRẢ LỜI ĐÚNG TRỌNG TÂM, GÃY GỌN & KHOA HỌC:
   - Đi thẳng vào bản chất câu hỏi ngay câu đầu tiên.
   - Giải thích ngắn gọn trong 2 - 3 đoạn hoặc dùng gạch đầu dòng rõ ràng, sinh động. Đọc trong 15 giây là nắm trọn bài học.
3. KẾT NỐI TƯƠNG TÁC:
   - Khéo léo gợi mở người dùng trải nghiệm các tính năng trên web (Sa bàn chiến trận Rạch Gầm - Xoài Mút, Bảo tàng số 3D, Đấu trường đố vui 30 câu).
4. CHÍNH XÁC SỬ LIỆU 100%: Dựa theo tài liệu Google Docs do tác giả Lê Trường Thịnh cung cấp, Đại Nam Thực Lục, Hoàng Lê Nhất Thống Chí. Tuyệt đối không bịa đặt.${ragContextPrompt}`;

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
      let replyText = data.candidates[0].content.parts[0].text;

      // Đảm bảo luôn có dòng nguồn rõ ràng ở cuối câu trả lời để không bị nhầm lẫn
      if (hasMatchedDoc) {
        if (!replyText.includes('Google Docs') && !replyText.includes('Nguồn tư liệu')) {
          replyText += `\n\n📚 *Nguồn tư liệu:* Trích xuất từ Google Docs (Biên soạn: Lê Trường Thịnh - Lớp 12A8 THPT Nguyễn Huệ)`;
        }
      } else {
        if (!replyText.includes('Google Gemini AI') && !replyText.includes('Nguồn tư liệu')) {
          replyText += `\n\n🌐 *Nguồn tư liệu:* Tri thức Lịch sử chung do Google Gemini AI đối chiếu (Chưa có trong Google Docs của tác giả)`;
        }
      }

      chatHistory.push({ role: "model", parts: [{ text: replyText }] });

      return {
        text: replyText,
        sourceType: hasMatchedDoc ? 'admin' : 'general',
        docTitle: hasMatchedDoc ? matchedDocs[0].title : null,
        model: 'Google Gemini AI'
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
