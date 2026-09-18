import puppeteer from "puppeteer-core";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const TARGET_URL = process.argv[2] || process.env.TARGET_URL || "http://localhost:3000";
const ARTIFACT_DIR = "C:/Users/amitl/.gemini/antigravity-ide/brain/55d14b59-6fd3-4544-81a5-6d69df4a41d6";

async function runVisualCapture() {
  console.log("\n======================================================");
  console.log("📸 Starting Automated Visual Capture & Hyperlapse Audit");
  console.log("Target URL: " + TARGET_URL);
  console.log("Artifact Directory: " + ARTIFACT_DIR);
  console.log("======================================================\n");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  await page.goto(TARGET_URL, { waitUntil: "domcontentloaded", timeout: 20000 });
  await new Promise((r) => setTimeout(r, 2000));

  // 1. Daylight Hero Screenshot (Viewport capture)
  console.log("📸 Capturing Daylight Mode Hero...");
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "daylight_mode_hero.png"),
  });

  // 2. Click 'Aurora' button to start hyperlapse
  console.log("🌌 Clicking 'Aurora' to start 7.5s cinematic hyperlapse...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const auroraBtn = buttons.find((b) => b.textContent && b.textContent.includes("Aurora"));
    if (auroraBtn) {
      auroraBtn.click();
    }
  });

  // 3. Capture at 3.5s (midpoint of hyperlapse transition: dusk / sunset mountain blend)
  console.log("⏳ Waiting 3.5s for hyperlapse midpoint (sunset/dusk blend)...");
  await new Promise((r) => setTimeout(r, 3500));
  console.log("📸 Capturing Hyperlapse Transition Midpoint...");
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "hyperlapse_transition_midpoint.png"),
  });

  // 4. Wait another 4.5s for transition to fully complete into Aurora night mode
  console.log("⏳ Waiting 4.5s for hyperlapse to fully settle into Aurora mode...");
  await new Promise((r) => setTimeout(r, 4500));
  console.log("📸 Capturing Full Aurora Night Mode Hero...");
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "aurora_night_hero.png"),
  });

  // 5. Scroll to Architecture / File Tree in Aurora mode
  console.log("📸 Capturing Architecture File Tree in Aurora mode...");
  await page.evaluate(() => {
    const el = document.getElementById("features");
    if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "aurora_architecture_filetree.png"),
  });

  // 6. Bento Showcase in Aurora mode
  console.log("📸 Capturing Bento Showcase in Aurora mode...");
  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll("h3"));
    const bentoHeading = headings.find((h) => h.textContent && h.textContent.includes("Biometric"));
    if (bentoHeading) bentoHeading.scrollIntoView({ behavior: "instant", block: "center" });
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "aurora_bento_showcase.png"),
  });

  // 7. Pricing Card in Aurora mode
  console.log("📸 Capturing Pricing Card in Aurora mode...");
  await page.evaluate(() => {
    const el = document.getElementById("pricing");
    if (el) el.scrollIntoView({ behavior: "instant", block: "center" });
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "aurora_pricing_dark_obsidian.png"),
  });

  // 8. FAQ Accordion in Aurora mode
  console.log("📸 Capturing FAQ Accordion in Aurora mode...");
  await page.evaluate(() => {
    const faqCards = Array.from(document.querySelectorAll(".paper-card"));
    if (faqCards.length > 0) {
      faqCards[faqCards.length - 1].scrollIntoView({ behavior: "instant", block: "center" });
    }
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "aurora_faq_accordions.png"),
  });

  // 9. Scroll back to top and click 'Day' button to test reverse hyperlapse
  console.log("☀️ Scrolling to top and clicking 'Day' for reverse hyperlapse...");
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 600));
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const dayBtn = buttons.find((b) => b.textContent && b.textContent.includes("Day"));
    if (dayBtn) {
      dayBtn.click();
    }
  });

  // Wait 8s for reverse transition
  console.log("⏳ Waiting 8s for reverse hyperlapse to complete...");
  await new Promise((r) => setTimeout(r, 8000));
  console.log("📸 Capturing Returned Daylight Mode Hero...");
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "returned_daylight_hero.png"),
  });

  await browser.close();
  console.log("\n🎉 Visual Capture Complete! All screenshots saved in artifact directory.\n");
}

runVisualCapture().catch((err) => {
  console.error("Visual capture crashed:", err);
  process.exit(1);
});
