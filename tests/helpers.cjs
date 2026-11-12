const { chromium } = require('playwright');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

async function launchBrowser() {
  return await chromium.launch({
    channel: 'chrome',
    headless: true,
  });
}

async function setupGeminiMock(page, customHandler) {
  await page.route('https://generativelanguage.googleapis.com/**', async route => {
    if (typeof customHandler === 'function') {
      const handled = await customHandler(route);
      if (handled) return;
    }

    const request = route.request();
    let postData = {};
    try {
      postData = request.postDataJSON() || {};
    } catch (e) {
      try {
        postData = JSON.parse(request.postData() || '{}');
      } catch (err) {}
    }

    // Extract user question from contents history
    let userQuestion = '';
    if (postData.contents && Array.isArray(postData.contents)) {
      const userMsgs = postData.contents.filter(c => c.role === 'user');
      const lastUserMsg = userMsgs[userMsgs.length - 1];
      if (lastUserMsg && Array.isArray(lastUserMsg.parts) && lastUserMsg.parts[0]) {
        userQuestion = (lastUserMsg.parts[0].text || '').trim();
      }
    }

    const sysInstructionText = (postData.system_instruction?.parts?.[0]?.text || '').toLowerCase();
    const lowerQ = userQuestion.toLowerCase();

    // Determine query category: Historical vs. General / Contemporary
    const isLamVlog = lowerQ.includes('lâm vlog') || lowerQ.includes('lam vlog');
    const isEinstein = lowerQ.includes('albert einstein') || lowerQ.includes('einstein');
    const isContemporary = isLamVlog || isEinstein || lowerQ.includes('youtuber') || sysInstructionText.includes('[tri thức tổng hợp]');

    let parts = [];

    if (isLamVlog) {
      // General/contemporary factual encyclopedia answer with 2 parts for multi-part testing
      parts = [
        {
          text: 'Lâm Vlog (tên thật là Lê Hoàng Vũ Lâm, sinh năm 1990 tại Bình Dương) là một nhà sáng tạo nội dung YouTube nổi tiếng tại Việt Nam với các video trải nghiệm thực tế, sinh tồn và ẩm thực dân dã, thu hút hàng triệu lượt theo dõi.\n\n'
        },
        {
          text: '🌐 *Nguồn tư liệu:* Tri thức Bách khoa Toàn thư và Lịch sử Tổng hợp'
        }
      ];
    } else if (isEinstein) {
      // General/contemporary factual encyclopedia answer with 2 parts
      parts = [
        {
          text: 'Albert Einstein (1879 – 1955) là nhà vật lý lý thuyết vĩ đại người Đức gốc Do Thái, người phát triển Thuyết Tương đối tổng quát và hẹp, mở ra kỷ nguyên mới cho vật lý hiện đại và được trao giải Nobel Vật lý năm 1921.\n\n'
        },
        {
          text: '🌐 *Nguồn tư liệu:* Tri thức Bách khoa Toàn thư và Lịch sử Tổng hợp'
        }
      ];
    } else if (isContemporary && !lowerQ.includes('quang trung') && !lowerQ.includes('tây sơn') && !lowerQ.includes('nguyễn huệ')) {
      // General world query fallback
      parts = [
        {
          text: 'Đây là câu trả lời chuẩn xác và khách quan dựa trên tri thức bách khoa toàn thư thế giới, phản ánh đúng dữ kiện thực tế về chủ đề bạn đang tìm hiểu.\n\n'
        },
        {
          text: '🌐 *Nguồn tư liệu:* Tri thức Bách khoa Toàn thư và Lịch sử Tổng hợp'
        }
      ];
    } else {
      // Historical query (Quang Trung, Tây Sơn, Nguyễn Huệ, hành quân, etc.)
      // Multi-part synthesis in 2-3 paragraphs with source doc
      parts = [
        {
          text: 'Vua Quang Trung (Nguyễn Huệ) là vị anh hùng kiệt xuất của nghĩa quân Tây Sơn. Trong chiến dịch xuân Kỷ Dậu 1789, ngài đã thực hiện cuộc hành quân thần tốc vô tiền khoáng hậu từ Phú Xuân ra Thăng Long chỉ trong vòng chưa đầy 10 ngày.\n\n'
        },
        {
          text: 'Bằng chiến thuật chia tốp luân phiên vừa cáng vừa hành quân và đánh úp chớp nhoáng, quân Tây Sơn bất ngờ công phá đại đồn Ngọc Hồi và Đống Đa, quét sạch 29 vạn quân Mãn Thanh, hoàn toàn giải phóng kinh thành.\n\n'
        },
        {
          text: '📚 *Nguồn tư liệu:* Khảo cứu từ tư liệu Google Docs của tác giả (Lê Trường Thịnh - 12A8, Trường THCS và THPT Nguyễn Huệ)'
        }
      ];
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        candidates: [
          {
            content: {
              parts
            }
          }
        ]
      })
    });
  });
}

async function createTestPage(browser, options = {}) {
  const device = options.device || (options.isMobile ? 'iphone' : 'desktop');
  
  let isMobile = false;
  let hasTouch = false;
  let defaultViewport = { width: 1920, height: 1080 };
  let defaultUserAgent = undefined;

  if (device === 'iphone') {
    isMobile = true;
    hasTouch = true;
    defaultViewport = { width: 390, height: 844 };
    defaultUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
  } else if (device === 'android') {
    isMobile = true;
    hasTouch = true;
    defaultViewport = { width: 412, height: 915 };
    defaultUserAgent = 'Mozilla/5.0 (Linux; Android 14; Mobile; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36';
  } else {
    // desktop
    isMobile = options.isMobile || false;
    hasTouch = options.hasTouch || false;
    defaultViewport = { width: 1920, height: 1080 };
    defaultUserAgent = undefined;
  }

  const viewport = options.viewport || defaultViewport;
  const userAgent = options.userAgent !== undefined ? options.userAgent : defaultUserAgent;
  if (options.isMobile !== undefined) isMobile = options.isMobile;
  if (options.hasTouch !== undefined) hasTouch = options.hasTouch;

  const context = await browser.newContext({
    viewport,
    isMobile,
    hasTouch,
    userAgent
  });

  const page = await context.newPage();
  const consoleErrors = [];

  page.on('response', resp => {
    if (resp.status() >= 400) {
      console.log(`[HTTP ${resp.status()}] ${resp.url()}`);
    }
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore benign external network tile or external 404 errors if any slip through
      if (!text.includes('khms') && !text.includes('google.com/vt') && !text.includes('Failed to load resource')) {
        consoleErrors.push(`[Console Error] ${text}`);
      }
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(`[Page Error] ${err.message}`);
  });

  // Dynamic Gemini API Route Mock
  await setupGeminiMock(page, options.geminiMockHandler);

  // Intercept Google Sheets Webhook to return successful sync
  await page.route('https://script.google.com/**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, count: 4, message: 'OK' })
    });
  });

  if (options.bypassIntro !== false) {
    await page.addInitScript(() => {
      try {
        sessionStorage.setItem('su_intro_seen_session', 'v1');
      } catch (e) {}
    });
  }

  return { page, context, consoleErrors };
}

async function navigateToTab(page, tabName, verifySelector, timeout = 7000) {
  // Normalize tabName aliases if needed: "Khảo sát" -> "Đánh Giá"
  const targetName = tabName.toLowerCase().includes('khảo sát') ? 'Đánh Giá' : tabName;

  const desktopNavBtn = page.locator(`button.nav-link:has-text("${targetName}")`);
  const mobileToggle = page.locator('button.mobile-nav-toggle');

  const isOverlayOpen = await page.locator('#mobile-nav-overlay').isVisible().catch(() => false);
  if (isOverlayOpen) {
    const mobileLink = page.locator(`.mobile-nav-link:has-text("${targetName}")`);
    await mobileLink.waitFor({ state: 'visible', timeout: 5000 });
    await mobileLink.click();
    await page.waitForSelector('#mobile-nav-overlay', { state: 'hidden', timeout: 5000 }).catch(() => {});
  } else if (await desktopNavBtn.isVisible()) {
    await desktopNavBtn.click();
  } else if (await mobileToggle.isVisible()) {
    await mobileToggle.click();
    await page.waitForSelector('#mobile-nav-overlay', { state: 'visible', timeout: 5000 });
    const mobileLink = page.locator(`.mobile-nav-link:has-text("${targetName}")`);
    await mobileLink.waitFor({ state: 'visible', timeout: 5000 });
    await mobileLink.click();
    await page.waitForSelector('#mobile-nav-overlay', { state: 'hidden', timeout: 5000 }).catch(() => {});
  } else {
    // Fallback try direct click
    await desktopNavBtn.click({ force: true });
  }

  if (verifySelector) {
    await page.waitForSelector(verifySelector, { state: 'visible', timeout });
  }
  await page.waitForTimeout(400); // Allow spring transitions to settle
}

module.exports = {
  BASE_URL,
  assert,
  launchBrowser,
  createTestPage,
  navigateToTab,
  setupGeminiMock,
};
