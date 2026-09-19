import puppeteer from "puppeteer-core";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const TARGET_URL = process.argv[2] || "http://localhost:3000";
const ARTIFACT_DIR = "C:/Users/amitl/.gemini/antigravity-ide/brain/55d14b59-6fd3-4544-81a5-6d69df4a41d6";

async function runMobileAudit() {
  console.log("📱 Launching Chrome in mobile simulation (375x812)...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 375,
    height: 812,
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });

  await page.goto(TARGET_URL, { waitUntil: "domcontentloaded", timeout: 20000 });
  await new Promise((r) => setTimeout(r, 2000));

  // 1. Switch to Aurora Mode
  console.log("🌌 Switching to Aurora mode on mobile...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const auroraBtn = buttons.find((b) => b.textContent && b.textContent.includes("Aurora"));
    if (auroraBtn) auroraBtn.click();
  });

  // Wait for hyperlapse to complete (8 seconds)
  await new Promise((r) => setTimeout(r, 8200));

  // 2. Capture Mobile Aurora Hero (to inspect centered aurora lines)
  console.log("📸 Capturing mobile_aurora_hero.png...");
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "mobile_aurora_hero.png"),
  });

  // 3. Scroll to the very bottom of the page in Dark Mode
  console.log("📜 Scrolling to bottom of mobile page...");
  await page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
  });
  await new Promise((r) => setTimeout(r, 1200));

  console.log("📸 Capturing mobile_dark_bottom.png...");
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "mobile_dark_bottom.png"),
  });

  // 4. Verify html/body background in dark mode
  const darkBgCheck = await page.evaluate(() => {
    const htmlBg = window.getComputedStyle(document.documentElement).backgroundColor;
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    const footer = document.querySelector(".site-footer");
    const footerBg = footer ? window.getComputedStyle(footer).backgroundColor : null;
    const canvas = document.querySelector("canvas");
    const canvasRect = canvas ? canvas.getBoundingClientRect() : null;
    return { htmlBg, bodyBg, footerBg, canvasRect, scrollY: window.scrollY, innerHeight: window.innerHeight };
  });
  console.log("Dark mode background metrics:", JSON.stringify(darkBgCheck, null, 2));

  // 5. Switch to Day Mode and test bottom
  console.log("☀️ Switching back to Day mode on mobile...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const dayBtn = buttons.find((b) => b.textContent && b.textContent.includes("Day"));
    if (dayBtn) dayBtn.click();
  });
  await new Promise((r) => setTimeout(r, 8200));

  console.log("📸 Capturing mobile_day_bottom.png...");
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "mobile_day_bottom.png"),
  });

  await browser.close();
  console.log("✅ Mobile audit screenshots captured successfully!");
}

runMobileAudit().catch((err) => {
  console.error("❌ Mobile audit failed:", err);
  process.exit(1);
});
