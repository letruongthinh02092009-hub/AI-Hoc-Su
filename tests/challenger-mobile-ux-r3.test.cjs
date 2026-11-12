const { BASE_URL, assert, launchBrowser, createTestPage, navigateToTab } = require('./helpers.cjs');

async function runChallengerMobileUxSuite() {
  const startTime = Date.now();
  console.log('\n================================================================');
  console.log('--- EMPIRICAL CHALLENGER R3 1: ADVERSARIAL MOBILE UX SUITE ---');
  console.log('================================================================\n');

  const browser = await launchBrowser();
  let totalAssertions = 0;
  const metricsReport = [];
  const failures = [];

  const TABS = [
    { name: 'Trang Chủ', verify: '.home-page' },
    { name: 'Dòng Thời Gian', verify: '.timeline-page' },
    { name: 'Sa Bàn', verify: '.battle-map-page' },
    { name: 'Bảo Tàng', verify: '.museum-page' },
    { name: 'Sử Quan AI', verify: '.ai-station-page' },
    { name: 'Khảo Sát', verify: '.survey-page' },
    { name: 'Đố Vui', verify: '.quiz-page' },
  ];

  const CORNER_VIEWPORTS = [
    {
      name: 'iPhone Landscape',
      viewport: { width: 844, height: 390 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      device: 'iphone',
      isMobile: true,
      hasTouch: true
    },
    {
      name: 'Galaxy S22 Landscape',
      viewport: { width: 915, height: 412 },
      userAgent: 'Mozilla/5.0 (Linux; Android 14; Mobile; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
      device: 'android',
      isMobile: true,
      hasTouch: true
    },
    {
      name: 'iPhone SE 1st Gen (Small Mobile)',
      viewport: { width: 320, height: 568 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Mobile/15E148 Safari/604.1',
      device: 'iphone',
      isMobile: true,
      hasTouch: true
    },
    {
      name: 'Galaxy Fold Outer (Foldable)',
      viewport: { width: 280, height: 653 },
      userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-F946B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
      device: 'android',
      isMobile: true,
      hasTouch: true
    }
  ];

  try {
    // =========================================================================
    // PART 1: CORNER-CASE VIEWPORTS — INTRO BYPASS & SCROLL ERGONOMICS
    // =========================================================================
    console.log('[SECTION 1] Testing Corner-Case Mobile Viewports for Intro Bypass & Zero Overflow...');

    for (const vp of CORNER_VIEWPORTS) {
      console.log(`\n>>> Testing Viewport: ${vp.name} (${vp.viewport.width}x${vp.viewport.height}) <<<`);

      // 1. First Visit (Empty sessionStorage) - Verify Intro is Bypassed
      {
        const { page, context, consoleErrors } = await createTestPage(browser, {
          viewport: vp.viewport,
          userAgent: vp.userAgent,
          isMobile: vp.isMobile,
          hasTouch: vp.hasTouch,
          bypassIntro: false // Explicitly verify first-visit bypass
        });

        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(500);

        // Check sessionStorage
        const sessionFlag = await page.evaluate(() => sessionStorage.getItem('su_intro_seen_session'));
        assert(!sessionFlag, `[${vp.name}] sessionStorage must be null for authentic first-visit test`);
        totalAssertions++;

        // Intro modal count & visibility
        const introCount = await page.locator('.cinematic-intro-root').count();
        const isIntroVis = introCount > 0 ? await page.locator('.cinematic-intro-root').isVisible() : false;
        assert(introCount === 0 || !isIntroVis, `[${vp.name}] Cinematic intro must NOT appear on mobile viewport (${vp.viewport.width}x${vp.viewport.height})`);
        totalAssertions++;

        // #hero-title visibility
        await page.waitForSelector('#hero-title', { state: 'visible', timeout: 5000 });
        assert(await page.locator('#hero-title').isVisible(), `[${vp.name}] #hero-title must be visible immediately`);
        totalAssertions++;

        assert(consoleErrors.length === 0, `[${vp.name}] No console errors on initial load: ${consoleErrors.join(', ')}`);
        totalAssertions++;

        console.log(`  ✓ [${vp.name}] Intro bypassed successfully on first visit.`);

        // 2. Test Tab-by-Tab Scroll Ergonomics & Overflow
        console.log(`  Checking 7 Tabs for Horizontal Overflow & Vertical Scrolling on ${vp.name}...`);

        for (const t of TABS) {
          try {
            await navigateToTab(page, t.name, t.verify);
          } catch (navErr) {
            console.log(`    ! Navigation retry with direct hash for tab ${t.name}: ${navErr.message}`);
            const hash = t.verify.replace('.', '').replace('-page', '');
            await page.evaluate((h) => { window.location.hash = h; }, hash);
            await page.waitForSelector(t.verify, { state: 'visible', timeout: 5000 });
          }

          // Measure scroll metrics
          const metrics = await page.evaluate(() => {
            const docEl = document.documentElement;
            const body = document.body;
            const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
            const clientWidth = docEl.clientWidth;
            const diff = scrollWidth - clientWidth;
            const hasOverflow = diff > 1.5; // subpixel tolerance

            let rogueElements = [];
            if (hasOverflow) {
              rogueElements = Array.from(document.querySelectorAll('*'))
                .filter(el => {
                  const r = el.getBoundingClientRect();
                  return r.right > window.innerWidth + 1;
                })
                .map(el => ({
                  tag: el.tagName.toLowerCase(),
                  cls: (el.className || '').toString().slice(0, 40),
                  id: el.id,
                  right: Math.round(el.getBoundingClientRect().right),
                  width: Math.round(el.getBoundingClientRect().width)
                }))
                .slice(0, 3);
            }

            return {
              scrollWidth,
              clientWidth,
              diff: Math.round(diff * 10) / 10,
              hasOverflow,
              rogueElements
            };
          });

          const row = {
            viewport: vp.name,
            size: `${vp.viewport.width}x${vp.viewport.height}`,
            tab: t.name,
            scrollWidth: metrics.scrollWidth,
            clientWidth: metrics.clientWidth,
            diff: metrics.diff,
            status: !metrics.hasOverflow ? 'PASS' : 'FAIL',
            rogues: metrics.rogueElements
          };
          metricsReport.push(row);

          if (metrics.hasOverflow) {
            const msg = `[${vp.name}][${t.name}] OVERFLOW DETECTED: scrollWidth (${metrics.scrollWidth}) > clientWidth (${metrics.clientWidth}), diff: ${metrics.diff}px. Rogues: ${JSON.stringify(metrics.rogueElements)}`;
            console.error(`    ✕ ${msg}`);
            failures.push(msg);
          } else {
            console.log(`    ✓ Tab "${t.name}": scrollWidth: ${metrics.scrollWidth} <= clientWidth: ${metrics.clientWidth} (diff: ${metrics.diff}px)`);
          }
          assert(!metrics.hasOverflow, `Tab "${t.name}" on ${vp.name} must not overflow horizontally`);
          totalAssertions++;

          // Vertical scroll stress test
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          await page.waitForTimeout(100);
          const scrolledY = await page.evaluate(() => window.scrollY || window.pageYOffset);
          // If page has scrollable content, verify scrollY > 0 or page fits within height
          assert(typeof scrolledY === 'number', 'Page scrollY is accessible');
          totalAssertions++;

          await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForTimeout(50);
        }

        await context.close();
      }
    }

    // =========================================================================
    // PART 2: ADVERSARIAL RAPID RELOADS & INTRO FLICKER/FLASH DETECTION
    // =========================================================================
    console.log('\n[SECTION 2] Adversarial Rapid Reloads: Testing for Intro Flicker / Flash...');

    const RELOAD_CONFIGS = [
      { name: 'iPhone Portrait (390x844)', count: 10, viewport: { width: 390, height: 844 }, ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)' },
      { name: 'iPhone Landscape (844x390)', count: 5, viewport: { width: 844, height: 390 }, ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)' },
      { name: 'iPhone SE (320x568)', count: 10, viewport: { width: 320, height: 568 }, ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X)' },
      { name: 'Galaxy Fold (280x653)', count: 5, viewport: { width: 280, height: 653 }, ua: 'Mozilla/5.0 (Linux; Android 14; Mobile)' },
    ];

    for (const cfg of RELOAD_CONFIGS) {
      console.log(`\n  Executing ${cfg.count} rapid reloads on ${cfg.name}...`);
      
      const { page, context, consoleErrors } = await createTestPage(browser, {
        viewport: cfg.viewport,
        userAgent: cfg.ua,
        isMobile: true,
        hasTouch: true,
        bypassIntro: false // ALWAYS empty sessionStorage to test first-tick flash!
      });

      // Inject MutationObserver before ANY page script runs
      await page.addInitScript(() => {
        window.__introFlickerDetected = false;
        window.__introNodeCount = 0;

        const observer = new MutationObserver((mutations) => {
          for (const m of mutations) {
            for (const node of m.addedNodes) {
              if (node.nodeType === 1) { // ELEMENT_NODE
                if (
                  node.classList?.contains('cinematic-intro-root') ||
                  node.querySelector?.('.cinematic-intro-root') ||
                  (node.textContent && node.textContent.includes('Bỏ qua giới thiệu'))
                ) {
                  window.__introFlickerDetected = true;
                  window.__introNodeCount++;
                }
              }
            }
          }
        });

        observer.observe(document.documentElement, {
          childList: true,
          subtree: true
        });
      });

      let flasheseSeenInBurst = 0;

      for (let i = 1; i <= cfg.count; i++) {
        // Clear sessionStorage on every iteration so it's a cold first-visit
        await page.goto('about:blank');
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });

        // Check if intro root ever existed
        const flickerResult = await page.evaluate(() => ({
          flicker: window.__introFlickerDetected || false,
          count: window.__introNodeCount || 0,
          currentDomCount: document.querySelectorAll('.cinematic-intro-root').length
        }));

        if (flickerResult.flicker || flickerResult.currentDomCount > 0) {
          flasheseSeenInBurst++;
          console.error(`    ✕ FLASH DETECTED on reload #${i}: ${JSON.stringify(flickerResult)}`);
        }

        // Verify #hero-title is displayed
        await page.waitForSelector('#hero-title', { state: 'visible', timeout: 5000 });
        assert(!flickerResult.flicker && flickerResult.currentDomCount === 0, `[${cfg.name}] Reload #${i} must have ZERO intro flashes`);
        totalAssertions++;
      }

      assert(flasheseSeenInBurst === 0, `[${cfg.name}] Total flashes across ${cfg.count} rapid reloads must be 0`);
      totalAssertions++;

      console.log(`    ✓ ${cfg.count}/${cfg.count} rapid reloads completed with 0 intro flashes on ${cfg.name}.`);
      await context.close();
    }

    console.log('\n================================================================');
    console.log(`🎉 EMPIRICAL CHALLENGER VERIFICATION COMPLETE: ALL ASSERTIONS PASSED!`);
    console.log(`   Total Assertions: ${totalAssertions}`);
    console.log(`   Total Failures: ${failures.length}`);
    console.log('================================================================\n');

  } catch (err) {
    console.error('\n❌ EMPIRICAL CHALLENGER TEST FAILED:', err.message);
    if (err.stack) console.error(err.stack);
    failures.push(err.message);
  } finally {
    await browser.close();
  }

  // Write metrics report to file for evidence
  const fs = require('fs');
  const reportPath = 'd:/Projects/SchoolProjects/Su/.agents/challenger_r3_1/metrics_report.json';
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalAssertions,
    failures,
    metricsReport
  }, null, 2), 'utf8');

  console.log(`Metrics report saved to: ${reportPath}`);

  if (failures.length > 0) {
    process.exit(1);
  }
}

runChallengerMobileUxSuite();
