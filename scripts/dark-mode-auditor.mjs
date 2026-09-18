import puppeteer from "puppeteer-core";
import fs from "fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const TARGET_URL = process.argv[2] || process.env.TARGET_URL || "http://localhost:3000";

async function runDarkModeAudit() {
  console.log("\n======================================================");
  console.log("🌑 Starting Dark Mode Contrast & Element Audit on: " + TARGET_URL);
  console.log("======================================================\n");

  if (!fs.existsSync(CHROME_PATH)) {
    console.error("❌ Chrome binary not found at: " + CHROME_PATH);
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  try {
    await page.goto(TARGET_URL, { waitUntil: "networkidle2", timeout: 20000 });
  } catch (err) {
    console.error("Failed to load page: " + err.message);
    await browser.close();
    process.exit(1);
  }

  // Click Aurora button or set data-theme="dark"
  console.log("🌌 Activating Aurora mode...");
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  });

  // Wait 1.5s for transitions to settle
  await new Promise((r) => setTimeout(r, 1500));

  // Run DOM contrast audit
  const results = await page.evaluate(() => {
    const issues = [];

    function parseRgb(colorStr) {
      if (!colorStr) return null;
      const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (!match) return null;
      return {
        r: parseInt(match[1], 10),
        g: parseInt(match[2], 10),
        b: parseInt(match[3], 10),
        a: match[4] !== undefined ? parseFloat(match[4]) : 1,
      };
    }

    function getLuminance(rgb) {
      if (!rgb) return 0;
      return (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    }

    function getEffectiveBg(el) {
      let cur = el;
      while (cur && cur !== document.documentElement) {
        const bgStr = window.getComputedStyle(cur).backgroundColor;
        const rgb = parseRgb(bgStr);
        if (rgb && rgb.a > 0.3) {
          return rgb;
        }
        cur = cur.parentElement;
      }
      return { r: 9, g: 12, b: 10, a: 1 }; // Default dark canvas
    }

    const allEls = document.querySelectorAll("*");
    allEls.forEach((el) => {
      const style = window.getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return;

      // Check direct text nodes
      let hasDirectText = false;
      for (const node of el.childNodes) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
          hasDirectText = true;
          break;
        }
      }

      if (!hasDirectText) return;

      const textColor = parseRgb(style.color);
      const bgColor = getEffectiveBg(el);

      if (textColor && bgColor) {
        const textLum = getLuminance(textColor);
        const bgLum = getLuminance(bgColor);

        // White-on-white condition: both text and background luminance are high (> 0.7)
        if (textLum > 0.7 && bgLum > 0.7) {
          issues.push({
            type: "WHITE_ON_WHITE",
            tag: el.tagName.toLowerCase(),
            textSnippet: el.textContent.trim().slice(0, 40),
            textColor: style.color,
            bgColor: `rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`,
            textLum: textLum.toFixed(2),
            bgLum: bgLum.toFixed(2),
          });
        }
      }
    });

    return issues;
  });

  console.log(`\n🔍 Dark Mode Audit Results: ${results.length} contrast issues found.`);
  if (results.length > 0) {
    results.forEach((iss, i) => {
      console.log(`   ❌ Issue #${i + 1}: [${iss.type}] <${iss.tag}> "${iss.textSnippet}"`);
      console.log(`      Text: ${iss.textColor} (lum ${iss.textLum}) | Bg: ${iss.bgColor} (lum ${iss.bgLum})`);
    });
  } else {
    console.log("   ✅ ZERO white-on-white text detected! All elements have crisp dark contrast.");
  }

  await browser.close();

  if (results.length > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runDarkModeAudit().catch((err) => {
  console.error("Audit failed:", err);
  process.exit(1);
});
