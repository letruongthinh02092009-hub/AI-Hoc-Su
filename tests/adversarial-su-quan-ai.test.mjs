import {
  formatOfflineKnowledgeSummary,
  sendChatMessageToGemini,
  getKnowledgeBase,
  resetChatHistory
} from '../src/services/geminiService.js';

function assert(condition, message) {
  if (!condition) {
    throw new Error(`[ASSERTION FAILED]: ${message}`);
  }
}

async function runAdversarialTestSuite() {
  console.log('================================================================');
  console.log('  CHALLENGER R3 2: ADVERSARIAL STRESS TEST HARNESS (SU QUAN AI)  ');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 0;
  const failureReports = [];

  function recordTest(name, fn) {
    totalTests++;
    try {
      console.log(`\n--- [Test ${totalTests}] ${name} ---`);
      fn();
      console.log(`  ✓ PASS: ${name}`);
      passedTests++;
    } catch (err) {
      console.error(`  ✗ FAIL: ${name}`);
      console.error(`    Details: ${err.message}`);
      failureReports.push({ name, error: err.message });
    }
  }

  async function recordAsyncTest(name, fn) {
    totalTests++;
    try {
      console.log(`\n--- [Test ${totalTests}] ${name} ---`);
      await fn();
      console.log(`  ✓ PASS: ${name}`);
      passedTests++;
    } catch (err) {
      console.error(`  ✗ FAIL: ${name}`);
      console.error(`    Details: ${err.message}`);
      failureReports.push({ name, error: err.message });
    }
  }

  // ===========================================================================
  // SECTION 1: Multi-part Gemini Responses & Concatenation Logic
  // Parser logic under test (reproducing geminiService.js lines 610-614):
  //   data.candidates[0].content.parts
  //     .filter(p => !p.thought && typeof p.text === 'string')
  //     .map(p => p.text)
  //     .join('');
  // ===========================================================================
  console.log('\n================================================================');
  console.log('SECTION 1: Multi-part Gemini Response Concatenation Stress Tests');
  console.log('================================================================');

  function parseCandidateParts(parts) {
    return parts
      .filter(p => !p.thought && typeof p.text === 'string')
      .map(p => p.text)
      .join('');
  }

  recordTest('1.1 Standard multi-part response (3 distinct text segments)', () => {
    const parts = [
      { text: 'Hoàng đế Quang Trung xuất quân thần tốc từ Phú Xuân. ' },
      { text: 'Đêm 30 Tết khao quân tại Tam Điệp rồi tiến công chớp nhoáng. ' },
      { text: 'Mùng 5 Tết Kỷ Dậu 1789 khải hoàn tiến vào Thăng Long.' }
    ];
    const result = parseCandidateParts(parts);
    assert(
      result === 'Hoàng đế Quang Trung xuất quân thần tốc từ Phú Xuân. Đêm 30 Tết khao quân tại Tam Điệp rồi tiến công chớp nhoáng. Mùng 5 Tết Kỷ Dậu 1789 khải hoàn tiến vào Thăng Long.',
      'All 3 parts must concatenate exactly in sequence without losing characters.'
    );
  });

  recordTest('1.2 Multi-part with thought fragments interspersed (Gemini 2.0 Thinking mode)', () => {
    const parts = [
      { thought: true, text: 'Thinking: The user is asking about the battle strategy of Quang Trung.' },
      { text: 'Đoạn 1: Chiến thuật hành quân thần tốc của vua Quang Trung. ' },
      { thought: true, text: 'Thinking: Need to verify dates and logistics.' },
      { text: 'Đoạn 2: Vừa cáng vừa hành quân luân phiên ngày đêm.' },
      { thought: true, text: 'Thinking: Format concluding citation.' }
    ];
    const result = parseCandidateParts(parts);
    assert(!result.includes('Thinking:'), 'Result must NOT contain any thought texts');
    assert(result.includes('Đoạn 1: Chiến thuật') && result.includes('Đoạn 2: Vừa cáng'), 'All actual answer text parts must be preserved');
    assert(result === 'Đoạn 1: Chiến thuật hành quân thần tốc của vua Quang Trung. Đoạn 2: Vừa cáng vừa hành quân luân phiên ngày đêm.', 'Strict concatenation of non-thought parts');
  });

  recordTest('1.3 Multi-part containing empty strings, blank tokens, and whitespace', () => {
    const parts = [
      { text: '' },
      { text: 'Hào khí ' },
      { text: '' },
      { text: 'Tây Sơn ' },
      { text: 'bất diệt.' },
      { text: '' }
    ];
    const result = parseCandidateParts(parts);
    assert(result === 'Hào khí Tây Sơn bất diệt.', 'Empty string parts must not corrupt or truncate adjacent words');
  });

  recordTest('1.4 Multi-part containing malformed objects, non-string text, and missing fields', () => {
    const parts = [
      { text: 'Phần mở đầu. ' },
      { text: 12345 },              // number instead of string
      { text: null },               // null text
      { text: undefined },          // undefined text
      { thought: false },           // missing text field
      {},                           // empty object
      { text: 'Phần kết luận.' }    // valid string
    ];
    const result = parseCandidateParts(parts);
    assert(
      result === 'Phần mở đầu. Phần kết luận.',
      `Malformed parts must be cleanly ignored without throwing errors or inserting null/undefined string literals. Got: "${result}"`
    );
  });

  recordTest('1.5 Multi-part with 100 fine-grained chunked tokens (Simulating streaming chunk assembly)', () => {
    const rawTokens = [];
    const parts = [];
    for (let i = 0; i < 100; i++) {
      const token = `T${i} `;
      rawTokens.push(token);
      parts.push({ text: token });
      if (i % 10 === 0) {
        parts.push({ thought: true, text: `[checkpoint-${i}]` });
      }
    }
    const expected = rawTokens.join('');
    const result = parseCandidateParts(parts);
    assert(result === expected, '100 chunked parts must reconstruct full text with 100% fidelity without truncation');
    assert(!result.includes('checkpoint'), 'Checkpoints (thoughts) must be excluded');
  });

  recordTest('1.6 Multi-part with Unicode Vietnamese diacritics, historical quotes, and special symbols', () => {
    const parts = [
      { text: '«Đánh cho để dài tóc,\n' },
      { text: 'Đánh cho để đen răng,\n' },
      { text: 'Đánh cho nó chích luân bất phản,\n' },
      { text: 'Đánh cho nó phiến giáp bất hoàn,\n' },
      { text: 'Đánh cho sử tri nam quốc anh hùng chi hữu chủ!» 🇻🇳⚔️' }
    ];
    const result = parseCandidateParts(parts);
    assert(result.includes('chi hữu chủ!» 🇻🇳⚔️'), 'Full poem with Vietnamese diacritics, typography quotes and emojis must be intact');
    assert(result.split('\n').length === 5, 'Newline boundaries between parts must be preserved');
  });

  // ===========================================================================
  // SECTION 2: Offline Fallback Formatter formatOfflineKnowledgeSummary()
  // Stress-testing raw document truncation and summarization
  // ===========================================================================
  console.log('\n================================================================');
  console.log('SECTION 2: Offline Knowledge Formatter formatOfflineKnowledgeSummary()');
  console.log('================================================================');

  recordTest('2.1 Giant 10,000-character raw text block without headers (continuous text with sentences)', () => {
    // Generate a massive 10,000-character text block with standard sentence endings (.!?)
    let rawBlock = '';
    const sampleSentences = [
      'Hoàng đế Quang Trung là vị lãnh tụ quân sự bách chiến bách thắng trong lịch sử Việt Nam.',
      'Năm 1789 ngài đã chỉ huy đại quân thần tốc hành quân từ Phú Xuân ra Thăng Long đại phá 29 vạn quân Mãn Thanh.',
      'Chiến thắng Ngọc Hồi Đống Đa vang dội mãi ngàn thu như một mốc son chói lọi của dân tộc.',
      'Vương triều Tây Sơn đã thực hiện nhiều chính sách cải cách văn hóa giáo dục tiến bộ đặc biệt là đề cao chữ Nôm.',
      'Sự ra đi đột ngột của hoàng đế Quang Trung để lại niềm tiếc thương vô hạn cho toàn thể nhân dân.'
    ];

    while (rawBlock.length < 10000) {
      const s = sampleSentences[Math.floor(Math.random() * sampleSentences.length)];
      rawBlock += s + ' ';
    }
    rawBlock = rawBlock.slice(0, 10000).trim();

    assert(rawBlock.length >= 9990, 'Raw text must be approximately 10,000 characters');

    const matchedDoc = {
      id: 'test-giant-raw-doc',
      title: 'Tài liệu sử liệu Tây Sơn đồ sộ 10,000 ký tự',
      source: 'Google Docs - Lê Trường Thịnh (12A8 - Trường THCS và THPT Nguyễn Huệ)',
      content: rawBlock
    };

    const output = formatOfflineKnowledgeSummary(matchedDoc);

    console.log(`    Input length: ${rawBlock.length} characters`);
    console.log(`    Formatted output length: ${output.length} characters`);

    // Verify it is NOT dumping raw text
    assert(
      output.length < 2000,
      `Output must NOT dump raw 10,000-character text block! Output length was ${output.length} chars (should be < 2000)`
    );

    // Verify it contains standard header and footer
    assert(output.includes('📜 **Sử Quan AI Tây Sơn (Tóm lược cốt lõi sử liệu):**'), 'Must contain official offline header');
    assert(output.includes('📚 *Nguồn tư liệu:*'), 'Must contain source citation');

    // Verify it summarized into bullet points (since cleanContent > 500 chars)
    const bulletCount = (output.match(/•\s+/g) || []).length;
    console.log(`    Extracted bullet points: ${bulletCount}`);
    assert(
      bulletCount >= 2 && bulletCount <= 4,
      `Formatter must extract 2-4 core bullet points for giant text! Actual bullets: ${bulletCount}`
    );
  });

  recordTest('2.2 Giant 10,000-character text with 50 distinct paragraphs', () => {
    let multiPara = '';
    for (let i = 1; i <= 50; i++) {
      multiPara += `Đoạn thứ ${i}: Đây là nội dung chi tiết của phần thứ ${i} trong tài liệu nghiên cứu sử học Tây Sơn dài tập với nhiều dữ kiện phong phú và các phân tích chuyên sâu về chiến thuật.\n\n`;
    }

    assert(multiPara.length > 5000, 'Multi-paragraph text must be multi-thousand characters');

    const matchedDoc = {
      id: 'test-multi-para-doc',
      title: 'Tập khảo cứu 50 đoạn văn',
      source: 'Google Docs - Lê Trường Thịnh',
      content: multiPara
    };

    const output = formatOfflineKnowledgeSummary(matchedDoc);
    console.log(`    Output length: ${output.length} characters`);

    // Must NOT contain paragraph 40 or 50
    assert(!output.includes('Đoạn thứ 40:'), 'Must NOT dump downstream paragraphs (e.g. Paragraph 40)');
    assert(!output.includes('Đoạn thứ 50:'), 'Must NOT dump downstream paragraphs (e.g. Paragraph 50)');
    assert(output.length < 1500, `Multi-paragraph output must be concise (< 1500 chars, got: ${output.length})`);
  });

  recordTest('2.3 Extreme Edge Case: 10,000-character single sentence with NO punctuation', () => {
    // Adversarial: a run-on block with no periods, question marks, or exclamation marks
    let noPunctuationBlock = 'hoàng đế quang trung và nghĩa quân tây sơn bách chiến bách thắng ';
    while (noPunctuationBlock.length < 10000) {
      noPunctuationBlock += 'hành quân thần tốc tiến đánh quân xâm lược ';
    }
    noPunctuationBlock = noPunctuationBlock.slice(0, 10000);

    const matchedDoc = {
      id: 'test-run-on-doc',
      title: 'Văn bản không dấu chấm',
      source: 'Google Docs',
      content: noPunctuationBlock
    };

    const output = formatOfflineKnowledgeSummary(matchedDoc);
    console.log(`    Output length for no-punctuation block: ${output.length}`);
    
    // EMPIRICAL CHALLENGE: Verify whether it properly truncates or dumps raw text
    const isDumped = output.length > 5000;
    if (isDumped) {
      console.warn(`    ⚠️ BUG DETECTED: Formatter dumped raw ${output.length} characters because text had no standard sentence punctuation!`);
    }
    assert(!isDumped, `Formatter must NOT dump raw 10,000-character text even without sentence punctuation! Actual output length: ${output.length} chars`);
  });

  recordTest('2.6 Empirical Bug Reproduction: Vietnamese "đ"/"Đ" stripped by normalizeText() creating phantom keywords', () => {
    // Normalization logic under test (geminiService.js line 316-322):
    function normalizeText(text) {
      return (text || '').toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    const input = 'ở đâu';
    const normalized = normalizeText(input);
    console.log(`    Input: "${input}" -> Normalized: "${normalized}"`);

    // In correct Vietnamese normalization, 'đ' should become 'd', so 'ở đâu' becomes 'o dau'.
    // However, NFD does not decompose 'đ' (\u0111).
    // As a result, replace(/[^a-z0-9\s]/g, ' ') deletes 'đ', leaving 'o au'!
    assert(
      normalized === 'o dau',
      `"đ" must be normalized to "d" instead of being stripped out into "au"! Got: "${normalized}"`
    );
  });

  recordTest('2.4 Short document (< 400 chars, <= 2 paragraphs) should preserve exact content without over-truncation', () => {
    const shortText = 'Vua Quang Trung sinh năm 1753 tại Bình Định.\n\nNgài là anh hùng áo vải cờ đào của phong trào Tây Sơn.';
    const matchedDoc = {
      id: 'test-short-doc',
      title: 'Thân thế vua Quang Trung',
      source: 'Sử liệu ngắn gọn',
      content: shortText
    };

    const output = formatOfflineKnowledgeSummary(matchedDoc);
    assert(output.includes(shortText), 'Short document must be preserved intact without over-truncation');
    assert(output.length < 600, 'Output remains concise');
  });

  recordTest('2.5 Defensive null / undefined handling', () => {
    assert(formatOfflineKnowledgeSummary(null) === '', 'null doc must return empty string');
    assert(formatOfflineKnowledgeSummary({}) === '', 'empty doc must return empty string');
    assert(formatOfflineKnowledgeSummary({ content: '' }) === '', 'empty content must return empty string');
  });

  // ===========================================================================
  // SECTION 3: Live Queries (or Mocked API Responses)
  // Historical query vs. Edge-case General Knowledge queries
  // ===========================================================================
  console.log('\n================================================================');
  console.log('SECTION 3: Live AI Queries (Historical & Edge-Case General Knowledge)');
  console.log('================================================================');

  await recordAsyncTest('3.1 Complex Historical Query: "Phân tích toàn diện chiến thuật hành quân thần tốc Kỷ Dậu 1789"', async () => {
    resetChatHistory();
    const query = 'Hãy phân tích chi tiết chiến thuật hành quân thần tốc của vua Quang Trung dịp Tết Kỷ Dậu 1789';
    console.log(`    Sending query: "${query}"...`);
    const response = await sendChatMessageToGemini(query);

    console.log(`    Model: ${response.model}`);
    console.log(`    Source Type: ${response.sourceType}`);
    console.log(`    Response Text Preview (first 250 chars):\n    ${response.text.slice(0, 250).replace(/\n/g, '\n    ')}...`);
    console.log(`    Total Length: ${response.text.length} characters`);

    // Verify Paragraph Count: requirement says 2-4 paragraphs (or 1 intro + 3-4 bullets)
    const paragraphs = response.text.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
    console.log(`    Paragraph count: ${paragraphs.length}`);

    assert(
      paragraphs.length >= 2 && paragraphs.length <= 6,
      `Historical query response should be structured in 2-4 concise paragraphs/sections (actual: ${paragraphs.length})`
    );

    // Verify historical accuracy
    const textLower = response.text.toLowerCase();
    assert(
      textLower.includes('quang trung') || textLower.includes('nguyễn huệ'),
      'Response must mention Quang Trung or Nguyễn Huệ'
    );
    assert(
      textLower.includes('thần tốc') || textLower.includes('tam điệp') || textLower.includes('ngọc hồi') || textLower.includes('đống đa') || textLower.includes('phú xuân'),
      'Response must contain tactical keywords (thần tốc, Tam Điệp, Ngọc Hồi, Đống Đa, Phú Xuân)'
    );

    // Verify source citation
    assert(
      response.text.includes('Nguồn tư liệu') || response.text.includes('Google Docs'),
      'Response must include source citation'
    );

    // Verify no truncation
    assert(!response.text.endsWith('... ') && response.text.trim().length > 150, 'Response must be complete without abrupt truncation');
  });

  console.log('    ⏳ Waiting 6.5s cooldown for Gemini API rate-limit buffer...');
  await new Promise(r => setTimeout(r, 6500));

  await recordAsyncTest('3.2 Edge-case General Knowledge 1: "Nguyễn Huệ và Albert Einstein có gặp nhau không?"', async () => {
    resetChatHistory();
    const query = 'Nguyễn Huệ và Albert Einstein có gặp nhau không?';
    console.log(`    Sending query: "${query}"...`);
    const response = await sendChatMessageToGemini(query);

    console.log(`    Model: ${response.model}`);
    console.log(`    Response Text Preview:\n    ${response.text.slice(0, 300).replace(/\n/g, '\n    ')}...`);

    const textLower = response.text.toLowerCase();

    // Verify factual, objective rejection of fictional meeting
    assert(
      textLower.includes('không') && (textLower.includes('không gặp') || textLower.includes('hoàn toàn không') || textLower.includes('không thể') || textLower.includes('khác nhau')),
      'Must clearly state that Nguyễn Huệ and Albert Einstein did NOT meet / could not meet'
    );

    // Verify historical chronology reasoning
    assert(
      (textLower.includes('thế kỷ') || textLower.includes('năm') || textLower.includes('thời đại') || textLower.includes('thời kỳ')) &&
      (textLower.includes('1753') || textLower.includes('1792') || textLower.includes('xviii') || textLower.includes('18')) &&
      (textLower.includes('1879') || textLower.includes('1955') || textLower.includes('xix') || textLower.includes('xx') || textLower.includes('19') || textLower.includes('20')),
      'Must provide chronological factual evidence (birth/death years or centuries: 18th century vs 19th/20th century)'
    );

    // Verify Albert Einstein's accurate role
    assert(
      textLower.includes('vật lý') || textLower.includes('khoa học') || textLower.includes('thuyết tương đối') || textLower.includes('bác học'),
      'Must objectively describe Albert Einstein as physicist/scientist'
    );
  });

  console.log('    ⏳ Waiting 6.5s cooldown for Gemini API rate-limit buffer...');
  await new Promise(r => setTimeout(r, 6500));

  await recordAsyncTest('3.3 Edge-case General Knowledge 2: "Lâm Vlog quê ở đâu?"', async () => {
    resetChatHistory();
    const query = 'Lâm Vlog quê ở đâu?';
    console.log(`    Sending query: "${query}"...`);
    const response = await sendChatMessageToGemini(query);

    console.log(`    Model: ${response.model}`);
    console.log(`    Response Text Preview:\n    ${response.text.slice(0, 300).replace(/\n/g, '\n    ')}...`);

    const textLower = response.text.toLowerCase();

    // Verify factual location
    assert(
      textLower.includes('bình dương') || textLower.includes('thủ dầu một'),
      'Must accurately state Lâm Vlog origin/residence (Bình Dương / Thủ Dầu Một)'
    );

    // Verify YouTuber identity
    assert(
      textLower.includes('lê hoàng vũ lâm') || textLower.includes('lê hoàng vũ') || textLower.includes('youtube') || textLower.includes('sáng tạo nội dung') || textLower.includes('vlogger'),
      'Must objectively recognize Lâm Vlog as YouTube content creator'
    );

    // Verify no forced Tây Sơn connection
    assert(
      !textLower.includes('nghĩa quân tây sơn là đồng hương của lâm vlog'),
      'Must NOT make fabricated absurd links between Lâm Vlog and Tây Sơn soldiers'
    );
  });

  console.log('    ⏳ Waiting 6.5s cooldown for Gemini API rate-limit buffer...');
  await new Promise(r => setTimeout(r, 6500));

  await recordAsyncTest('3.4 Edge-case General Knowledge 3: "Albert Einstein sinh năm bao nhiêu và đạt giải Nobel năm nào?"', async () => {
    resetChatHistory();
    const query = 'Albert Einstein sinh năm bao nhiêu và đạt giải Nobel năm nào?';
    console.log(`    Sending query: "${query}"...`);
    const response = await sendChatMessageToGemini(query);

    console.log(`    Response Text Preview:\n    ${response.text.slice(0, 300).replace(/\n/g, '\n    ')}...`);

    const text = response.text;
    assert(text.includes('1879'), 'Must state birth year 1879');
    assert(text.includes('1921'), 'Must state Nobel Physics year 1921');
  });

  // ===========================================================================
  // SECTION 4: Offline Engine Fallback Simulation
  // ===========================================================================
  console.log('\n================================================================');
  console.log('SECTION 4: Offline Engine Fallback When API Fails');
  console.log('================================================================');

  recordTest('4.1 Offline Fallback for matched historical query when API key is invalidated', () => {
    // When API fails or throws, if matched doc exists, sendChatMessageToGemini falls back to formatOfflineKnowledgeSummary
    const kb = getKnowledgeBase();
    assert(kb.length > 0, 'Knowledge base must contain items');

    const quangTrungDoc = kb.find(k => k.title.includes('Thần tốc') || k.title.includes('Quang Trung'));
    assert(quangTrungDoc, 'Must find Quang Trung historical doc in KB');

    const offlineSummary = formatOfflineKnowledgeSummary(quangTrungDoc);
    assert(offlineSummary.includes('📜 **Sử Quan AI Tây Sơn (Tóm lược cốt lõi sử liệu):**'), 'Offline output includes header');
    assert(offlineSummary.includes(quangTrungDoc.title), 'Offline output mentions doc title');
    assert(offlineSummary.includes('📚 *Nguồn tư liệu:*'), 'Offline output includes source citation');
    console.log(`    Offline summary length: ${offlineSummary.length} chars (Concise and formatted)`);
  });

  // ===========================================================================
  // FINAL REPORT
  // ===========================================================================
  console.log('\n================================================================');
  console.log('                ADVERSARIAL TEST SUITE SUMMARY                  ');
  console.log('================================================================');
  console.log(`Total Tests Run   : ${totalTests}`);
  console.log(`Tests Passed      : ${passedTests} / ${totalTests} (${((passedTests / totalTests) * 100).toFixed(1)}%)`);
  console.log(`Tests Failed      : ${failureReports.length}`);

  if (failureReports.length > 0) {
    console.log('\nFailures Detected:');
    failureReports.forEach(f => console.log(`  - ${f.name}: ${f.error}`));
    console.log('================================================================\n');
    process.exit(1);
  } else {
    console.log('\nALL ADVERSARIAL STRESS TESTS PASSED EMPIRICALLY! (100%)');
    console.log('================================================================\n');
  }
}

runAdversarialTestSuite().catch(err => {
  console.error('Fatal Test Harness Error:', err);
  process.exit(1);
});
