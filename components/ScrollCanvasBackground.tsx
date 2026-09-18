"use client";

import { useEffect, useRef } from "react";
import { ThemeMode } from "./ThemeToggle";

const FRAME_PATHS = [
  "/mountains/frame_01.jpg", // 0: Dawn / morning mist
  "/mountains/frame_02.jpg", // 1: Day alpine ridge
  "/mountains/frame_03.jpg", // 2: High summit sunlit
  "/mountains/frame_04.jpg", // 3: Sunset / twilight purple
  "/mountains/frame_05.jpg", // 4: Deep starry night Milky Way
  "/mountains/frame_06.jpg", // 5: Midnight Aurora Borealis
];

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  phase: number;
}

export interface ScrollCanvasBackgroundProps {
  themeMode?: ThemeMode;
  onTransitionChange?: (isTransitioning: boolean) => void;
}

// Cubic ease-in-out curve for cinematic hyperlapse deceleration & acceleration
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function ScrollCanvasBackground({
  themeMode = "day",
  onTransitionChange,
}: ScrollCanvasBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Keep refs for animation state across renders
  const stateRef = useRef({
    currentProgress: themeMode === "aurora" ? 1 : 0,
    startProgress: themeMode === "aurora" ? 1 : 0,
    targetProgress: themeMode === "aurora" ? 1 : 0,
    transitionStartTime: 0,
    isTransitioning: false,
    themeMode,
  });

  // 7.5 second cinematic transition duration
  const TRANSITION_DURATION = 7500;

  // React to themeMode changes and start hyperlapse transition
  useEffect(() => {
    const s = stateRef.current;
    if (s.themeMode !== themeMode) {
      s.themeMode = themeMode;
      s.startProgress = s.currentProgress;
      s.targetProgress = themeMode === "aurora" ? 1 : 0;
      s.transitionStartTime = performance.now();
      s.isTransitioning = true;
      onTransitionChange?.(true);
    }
  }, [themeMode, onTransitionChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    FRAME_PATHS.forEach((path, idx) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        loadedCount++;
      };
      images[idx] = img;
    });

    // Initialize 240 procedural stars for twilight and night skies
    const stars: Star[] = [];
    for (let i = 0; i < 240; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random() * 0.58, // Upper 58% of atmosphere
        radius: Math.random() * 1.5 + 0.35,
        baseAlpha: Math.random() * 0.75 + 0.25,
        twinkleSpeed: Math.random() * 2.2 + 0.8,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let auroraTick = 0;
    let scrollParallax = 0;

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      // Subtle scroll parallax
      scrollParallax = Math.min(Math.max(scrollY / maxScroll, 0), 1);
    };

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    // Smooth 60fps render loop
    const render = (time: number) => {
      auroraTick += 0.014;
      const s = stateRef.current;

      // Handle 7.5-second cinematic hyperlapse transition
      if (s.isTransitioning) {
        const elapsed = time - s.transitionStartTime;
        const rawT = Math.min(Math.max(elapsed / TRANSITION_DURATION, 0), 1);
        const easedT = easeInOutCubic(rawT);

        s.currentProgress = s.startProgress + (s.targetProgress - s.startProgress) * easedT;

        if (rawT >= 1) {
          s.currentProgress = s.targetProgress;
          s.isTransitioning = false;
          onTransitionChange?.(false);
        }
      }

      // Synchronize [data-theme="dark"] at transition midpoint (~0.46)
      const isDark = s.currentProgress >= 0.46;
      const currentDarkAttr = document.documentElement.getAttribute("data-theme");
      if (isDark && currentDarkAttr !== "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
      } else if (!isDark && currentDarkAttr === "dark") {
        document.documentElement.removeAttribute("data-theme");
      }

      const width = window.innerWidth;
      const height = window.innerHeight;

      // nightFactor interpolates 0.0 (day) to 1.0 (aurora)
      const nightFactor = s.currentProgress;

      // Effective frame progress across the 6 frames (0 to 5)
      // Slight gentle scroll nuance when not actively transitioning
      const scrollNuance = (scrollParallax - 0.5) * 0.04;
      const effectiveProgress = Math.min(Math.max(s.currentProgress + scrollNuance, 0), 1);

      // Base wash: lerp between warm parchment #FAF9F5 (250, 249, 245) and dark obsidian #090C0A (9, 12, 10)
      const baseR = Math.round(250 * (1 - nightFactor) + 9 * nightFactor);
      const baseG = Math.round(249 * (1 - nightFactor) + 12 * nightFactor);
      const baseB = Math.round(245 * (1 - nightFactor) + 10 * nightFactor);
      ctx.fillStyle = `rgb(${baseR}, ${baseG}, ${baseB})`;
      ctx.fillRect(0, 0, width, height);

      if (loadedCount >= 1) {
        const numFrames = FRAME_PATHS.length;
        const scaled = effectiveProgress * (numFrames - 1);
        const baseIndex = Math.min(Math.floor(scaled), numFrames - 2);
        const blend = scaled - baseIndex;

        const imgA = images[baseIndex];
        const imgB = images[baseIndex + 1];

        const drawFrame = (img: HTMLImageElement, alpha: number, scaleFactor: number) => {
          if (!img || !img.complete || img.naturalWidth === 0) return;

          const imgAspect = img.naturalWidth / img.naturalHeight;
          const canvasAspect = width / height;

          let renderW = width;
          let renderH = height;

          if (canvasAspect > imgAspect) {
            renderW = width * scaleFactor;
            renderH = (width / imgAspect) * scaleFactor;
          } else {
            renderH = height * scaleFactor;
            renderW = (height * imgAspect) * scaleFactor;
          }

          const offsetX = (width - renderW) / 2;
          const offsetY = (height - renderH) / 2 + (scrollParallax * 20 - 10);

          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
          ctx.restore();
        };

        // 3D camera hyperlapse push (subtle flight zoom)
        const hyperlapseScale = 1.02 + Math.sin(effectiveProgress * Math.PI) * 0.04;
        const scaleA = hyperlapseScale;
        const scaleB = hyperlapseScale + 0.01;

        // Opacity balances visibility of the mountains behind content
        const targetOpacity = 0.44 * (1 - nightFactor) + 0.52 * nightFactor;

        if (imgA && imgA.complete) {
          drawFrame(imgA, targetOpacity * (1 - blend), scaleA);
        }
        if (imgB && imgB.complete) {
          drawFrame(imgB, targetOpacity * blend, scaleB);
        }

        // Procedural Starfield (fades in as twilight deepens into night)
        if (nightFactor > 0.3) {
          const starAlphaFactor = (nightFactor - 0.3) / 0.7;
          ctx.save();
          stars.forEach((star) => {
            const twinkle = Math.sin(time * 0.0025 * star.twinkleSpeed + star.phase);
            const alpha = Math.max(0, star.baseAlpha + twinkle * 0.35) * starAlphaFactor * 0.8;
            if (alpha > 0.02) {
              ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
              ctx.beginPath();
              ctx.arc(star.x * width, star.y * height, star.radius, 0, Math.PI * 2);
              ctx.fill();
            }
          });
          ctx.restore();
        }

        // Shimmering Aurora Borealis Waves (sweeps in from 0.55 onward)
        if (nightFactor > 0.5) {
          const auroraIntensity = Math.min((nightFactor - 0.5) / 0.5, 1);
          const auroraAlpha = auroraIntensity * 0.36;

          ctx.save();
          ctx.globalCompositeOperation = "screen";

          for (let layer = 0; layer < 2; layer++) {
            const grad = ctx.createLinearGradient(0, height * 0.04, 0, height * 0.58);
            if (layer === 0) {
              grad.addColorStop(0, "rgba(52, 211, 153, 0)");
              grad.addColorStop(0.38, `rgba(52, 211, 153, ${auroraAlpha.toFixed(2)})`);
              grad.addColorStop(0.72, `rgba(16, 185, 129, ${(auroraAlpha * 0.75).toFixed(2)})`);
              grad.addColorStop(1, "rgba(16, 185, 129, 0)");
            } else {
              grad.addColorStop(0, "rgba(139, 92, 246, 0)");
              grad.addColorStop(0.42, `rgba(139, 92, 246, ${(auroraAlpha * 0.65).toFixed(2)})`);
              grad.addColorStop(0.8, `rgba(99, 102, 241, ${(auroraAlpha * 0.45).toFixed(2)})`);
              grad.addColorStop(1, "rgba(99, 102, 241, 0)");
            }

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(0, height * 0.28);

            for (let x = 0; x <= width; x += 35) {
              const freq = 0.0022 + layer * 0.001;
              const y =
                height * 0.2 +
                Math.sin(x * freq + auroraTick + layer * 1.5) * 50 +
                Math.cos(x * 0.0016 - auroraTick * 0.75) * 32;
              ctx.lineTo(x, y);
            }

            ctx.lineTo(width, height * 0.62);
            ctx.lineTo(0, height * 0.62);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();
        }

        // Editorial Vignette & Legibility Overlay
        // Interpolates dynamically between day and night values
        const vigR = Math.round(250 * (1 - nightFactor) + 9 * nightFactor);
        const vigG = Math.round(249 * (1 - nightFactor) + 12 * nightFactor);
        const vigB = Math.round(245 * (1 - nightFactor) + 10 * nightFactor);

        const aTop = (0.80 * (1 - nightFactor) + 0.82 * nightFactor).toFixed(2);
        const aMid1 = (0.70 * (1 - nightFactor) + 0.74 * nightFactor).toFixed(2);
        const aMid2 = (0.74 * (1 - nightFactor) + 0.76 * nightFactor).toFixed(2);
        const aBot = (0.88 * (1 - nightFactor) + 0.92 * nightFactor).toFixed(2);

        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, `rgba(${vigR}, ${vigG}, ${vigB}, ${aTop})`);
        grad.addColorStop(0.32, `rgba(${vigR}, ${vigG}, ${vigB}, ${aMid1})`);
        grad.addColorStop(0.68, `rgba(${vigR}, ${vigG}, ${vigB}, ${aMid2})`);
        grad.addColorStop(1, `rgba(${vigR}, ${vigG}, ${vigB}, ${aBot})`);

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
