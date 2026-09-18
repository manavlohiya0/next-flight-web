import puppeteer from "puppeteer-core";
import fs from "fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const TARGET_URL = process.argv[2] || process.env.TARGET_URL || "http://localhost:3000";

const VIEWPORTS = [
  { name: "Mobile (iPhone)", width: 375, height: 812 },
  { name: "Tablet (iPad)", width: 768, height: 1024 },
  { name: "Laptop (User Screen)", width: 1366, height: 633 },
  { name: "Desktop (FHD)", width: 1920, height: 1080 },
];

async function runAudit() {
  console.log(`\n======================================================`);
  console.log(`🔍 Starting UI Anomaly Audit on: ${TARGET_URL}`);
  console.log(`======================================================\n`);

  if (!fs.existsSync(CHROME_PATH)) {
    console.error(`❌ Chrome binary not found at: ${CHROME_PATH}`);
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  let totalAnomalies = 0;
  const auditResults = [];

  for (const vp of VIEWPORTS) {
    console.log(`📐 Auditing Viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });

    try {
      await page.goto(TARGET_URL, { waitUntil: "domcontentloaded", timeout: 20000 });
      await new Promise((r) => setTimeout(r, 1000));
    } catch (err) {
      console.error(`   ⚠️ Failed to load page: ${err.message}`);
      await page.close();
      continue;
    }

    // Scroll to bottom to trigger any lazy-loaded elements and scroll listeners
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 400;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            window.scrollTo(0, 0);
            resolve();
          }
        }, 80);
      });
    });

    await new Promise((r) => setTimeout(r, 600));

    // Audit DOM for anomalies
    const anomalies = await page.evaluate((vpWidth) => {
      const issues = [];

      // Check document root overflow
      const docScrollWidth = document.documentElement.scrollWidth;
      const bodyScrollWidth = document.body.scrollWidth;
      if (docScrollWidth > vpWidth + 1 || bodyScrollWidth > vpWidth + 1) {
        issues.push({
          type: "ROOT_OVERFLOW",
          issue: `Root document has horizontal scrollbar (scrollWidth: ${Math.max(docScrollWidth, bodyScrollWidth)}px vs viewport: ${vpWidth}px)`,
          tag: "HTML/BODY",
        });
      }

      // Check all elements for viewport overflow and container spilling
      const elements = document.querySelectorAll("*");
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);

        // Ignore hidden, fixed elements with intentional styling (e.g. modals/drawers)
        if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return;

        // Helper to check if an element is contained within an intentional horizontal scroll container
        let isInsideScrollable = false;
        let parent = el.parentElement;
        while (parent && parent !== document.body && parent !== document.documentElement) {
          const parentStyle = window.getComputedStyle(parent);
          if (parentStyle.overflowX === "auto" || parentStyle.overflowX === "scroll") {
            isInsideScrollable = true;
            break;
          }
          parent = parent.parentElement;
        }

        // 1. Element spilling off-screen to the right
        if (rect.right > vpWidth + 1 && style.position !== "fixed" && !isInsideScrollable) {
          issues.push({
            type: "OFFSCREEN_SPILL",
            issue: `Element spills past right viewport edge (right: ${Math.round(rect.right)}px > ${vpWidth}px)`,
            tag: el.tagName.toLowerCase(),
            id: el.id || undefined,
            className: el.className ? String(el.className).slice(0, 80) : undefined,
            textSnippet: (el.textContent || "").trim().slice(0, 50),
          });
        }

        // 2. Element internal overflow without scroll
        if (
          el.scrollWidth > el.clientWidth + 2 &&
          style.overflowX !== "auto" &&
          style.overflowX !== "scroll" &&
          style.overflowX !== "hidden" &&
          style.overflowX !== "clip" &&
          el.children.length > 0 &&
          rect.width > 20
        ) {
          issues.push({
            type: "CONTAINER_BURST",
            issue: `Container content bursts bounds (scrollWidth: ${el.scrollWidth}px > clientWidth: ${el.clientWidth}px)`,
            tag: el.tagName.toLowerCase(),
            id: el.id || undefined,
            className: el.className ? String(el.className).slice(0, 80) : undefined,
            textSnippet: (el.textContent || "").trim().slice(0, 50),
          });
        }
      });

      return issues;
    }, vp.width);

    auditResults.push({ viewport: vp, anomalies });
    totalAnomalies += anomalies.length;

    if (anomalies.length === 0) {
      console.log(`   ✅ 0 Anomalies detected! Clean layout.`);
    } else {
      console.log(`   ❌ ${anomalies.length} Anomaly/Anomalies detected:`);
      anomalies.forEach((a, i) => {
        console.log(`      ${i + 1}. [${a.type}] <${a.tag}> ${a.issue} (${a.textSnippet ? `"${a.textSnippet}"` : ""})`);
      });
    }

    await page.close();
  }

  await browser.close();

  console.log(`\n======================================================`);
  console.log(`🏁 Audit Summary: Total Anomalies across all viewports: ${totalAnomalies}`);
  console.log(`======================================================\n`);

  if (totalAnomalies > 0) {
    process.exit(2);
  } else {
    console.log("🎉 ALL VIEWPORTS PASSED WITH ZERO ANOMALIES!");
    process.exit(0);
  }
}

runAudit().catch((err) => {
  console.error("Audit runner crashed:", err);
  process.exit(1);
});
