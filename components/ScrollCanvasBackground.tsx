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
      const w = window.innerWidth;
      const h = Math.max(
        window.innerHeight,
        document.documentElement.clientHeight || 0,
        (typeof screen !== "undefined" ? screen.height : 0) || 0
      );
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.resetTransform?.();
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

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width / dpr || window.innerWidth;
      const height = canvas.height / dpr || window.innerHeight;

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

        // Shimmering Aurora Borealis Waves (centralized, symmetrical ribbons across mobile & desktop)
        if (nightFactor > 0.5) {
          const auroraIntensity = Math.min((nightFactor - 0.5) / 0.5, 1);
          const auroraAlpha = auroraIntensity * 0.44;

          ctx.save();
          ctx.globalCompositeOperation = "screen";

          for (let layer = 0; layer < 2; layer++) {
            const isEmerald = layer === 0;
            const baseY = height * (0.20 + layer * 0.08);

            const topPoints: { x: number; y: number }[] = [];
            const botPoints: { x: number; y: number }[] = [];
            const midPoints: { x: number; y: number }[] = [];

            // Adaptive step size based on viewport width (smooth curve on mobile and desktop)
            const step = Math.max(8, Math.round(width / 44));

            for (let x = 0; x <= width; x += step) {
              const normX = x / width; // 0.0 at left, 0.5 at center, 1.0 at right

              // Symmetrical center envelope: peaks at center (normX = 0.5), tapers softly to 0 at edges
              const envelope = Math.pow(Math.sin(normX * Math.PI), 0.82);

              // Wave angles centered around the horizontal center (normX - 0.5)
              const waveAngle1 = (normX - 0.5) * Math.PI * 2.8 + auroraTick * (1 + layer * 0.3) + layer * 1.6;
              const waveAngle2 = (normX - 0.5) * Math.PI * 1.6 - auroraTick * 0.65;

              // Graceful undulating displacement centered in the viewport
              const wave = (Math.sin(waveAngle1) * 26 + Math.cos(waveAngle2) * 14) * envelope;
              const centerY = baseY + wave;

              // Ribbon thickness that organically blossoms in the center and pinches to zero at edges
              const thickness = (height * 0.08 + Math.sin((normX - 0.5) * Math.PI * 3 + auroraTick) * 10) * envelope;

              const yTop = centerY - thickness * 0.5;
              const yBot = centerY + thickness * 0.65;

              topPoints.push({ x, y: yTop });
              botPoints.push({ x, y: yBot });
              midPoints.push({ x, y: centerY });
            }

            // Ensure last point hits width precisely
            if (topPoints[topPoints.length - 1].x < width) {
              topPoints.push({ x: width, y: baseY });
              botPoints.push({ x: width, y: baseY });
              midPoints.push({ x: width, y: baseY });
            }

            // 1. Draw glowing ethereal veil
            const grad = ctx.createLinearGradient(0, baseY - height * 0.1, 0, baseY + height * 0.14);
            if (isEmerald) {
              grad.addColorStop(0, "rgba(52, 211, 153, 0)");
              grad.addColorStop(0.35, `rgba(52, 211, 153, ${(auroraAlpha * 0.85).toFixed(2)})`);
              grad.addColorStop(0.7, `rgba(16, 185, 129, ${(auroraAlpha * 0.5).toFixed(2)})`);
              grad.addColorStop(1, "rgba(16, 185, 129, 0)");
            } else {
              grad.addColorStop(0, "rgba(139, 92, 246, 0)");
              grad.addColorStop(0.4, `rgba(139, 92, 246, ${(auroraAlpha * 0.75).toFixed(2)})`);
              grad.addColorStop(0.75, `rgba(99, 102, 241, ${(auroraAlpha * 0.4).toFixed(2)})`);
              grad.addColorStop(1, "rgba(99, 102, 241, 0)");
            }

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(topPoints[0].x, topPoints[0].y);
            for (let i = 1; i < topPoints.length; i++) {
              ctx.lineTo(topPoints[i].x, topPoints[i].y);
            }
            for (let i = botPoints.length - 1; i >= 0; i--) {
              ctx.lineTo(botPoints[i].x, botPoints[i].y);
            }
            ctx.closePath();
            ctx.fill();

            // 2. Delicate luminous filament stroke through the center
            ctx.beginPath();
            ctx.moveTo(midPoints[0].x, midPoints[0].y);
            for (let i = 1; i < midPoints.length; i++) {
              ctx.lineTo(midPoints[i].x, midPoints[i].y);
            }
            ctx.strokeStyle = isEmerald
              ? `rgba(110, 231, 183, ${(auroraAlpha * 0.9).toFixed(2)})`
              : `rgba(196, 181, 253, ${(auroraAlpha * 0.8).toFixed(2)})`;
            ctx.lineWidth = 1.6;
            ctx.stroke();
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
      className="bg-canvas-fixed"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        minHeight: "100dvh",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
