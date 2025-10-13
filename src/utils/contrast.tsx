import React from "react";
import { HsvaColor } from "../types";
import chroma from "chroma-js";

const CONTRAST_CONFIG = {
  TARGET_RATIO: 4.5,                   // WCAG AA standard
  PATH_STEP_COUNT: 20,                 // Number of points along saturation range
  BINARY_SEARCH_TOLERANCE: 0.05,       // Acceptable deviation from target contrast
  BINARY_SEARCH_ITERATIONS: 20,        // Max iterations for binary search
  JUMP_THRESHOLD: 50,                  // Y-axis threshold for path discontinuity
  SMOOTHING_MAX_CHANGE: 5,             // Max Y-axis change during smoothing
  DOT_SPACING: 6,                      // Grid spacing for non-compliant dots
  DOT_SIZE: 2,                         // Dot size in pixels
} as const;

export const hsvaToChromaColor = (hsva: HsvaColor): chroma.Color => {
  const { h, s, v, a } = hsva;
  return chroma.hsv(h, s / 100, v / 100).alpha(a);
};

export const blendColors = (fg: chroma.Color, bg: chroma.Color): chroma.Color => {
  const alpha = fg.alpha();
  const fgRgb = fg.rgb();
  const bgRgb = bg.rgb();
  const blendedRgb = fgRgb.map((channel, i) => {
    return channel * alpha + bgRgb[i] * (1 - alpha);
  });
  return chroma(blendedRgb);
};

export const getContrastCompliance = (ratio: number): { level: string; pass: boolean } => {
  if (ratio >= 7) return { level: "AAA (Highest)", pass: true };
  if (ratio >= 4.5) return { level: "AA (Good)", pass: true };
  // if (ratio >= 3) return { level: 'AA (Large Text)', pass: true }
  return { level: "Fail", pass: false };
};

export const calculateComplianceLinePath = (
  hsva: HsvaColor,
  backgroundHsva?: HsvaColor
): {
  path: string | null;
  data: Array<{ x: number; y: number }> | null;
} => {
  if (!backgroundHsva) return { path: null, data: null };

  const backgroundChroma = hsvaToChromaColor(backgroundHsva);
  const targetContrastRatio = CONTRAST_CONFIG.TARGET_RATIO;

  const points: string[] = [];
  const dataPoints: Array<{ x: number; y: number }> = [];
  const stepCount = CONTRAST_CONFIG.PATH_STEP_COUNT;

  for (let step = 0; step <= stepCount; step++) {
    const saturation = (step / stepCount) * 100;
    const xPercent = saturation;

    // Binary search to find the V value for this saturation level
    let minV = 0;
    let maxV = 100;
    let foundV = null;

    // Test both extremes to understand the contrast behavior
    const testMaxV = { h: hsva.h, s: saturation, v: 100, a: hsva.a };
    const maxVChroma = hsvaToChromaColor(testMaxV);
    const maxVBlended =
      hsva.a < 1 ? chroma.mix(backgroundChroma, maxVChroma, hsva.a, "rgb") : maxVChroma;
    const maxContrast = chroma.contrast(maxVBlended, backgroundChroma);

    const testMinV = { h: hsva.h, s: saturation, v: 0, a: hsva.a };
    const minVChroma = hsvaToChromaColor(testMinV);
    const minVBlended =
      hsva.a < 1 ? chroma.mix(backgroundChroma, minVChroma, hsva.a, "rgb") : minVChroma;
    const minContrast = chroma.contrast(minVBlended, backgroundChroma);

    // Determine if we should look for brighter or darker colors
    const brighterIsBetter = maxContrast > minContrast;

    // Check if target contrast is achievable at all
    const bestContrast = Math.max(maxContrast, minContrast);
    if (bestContrast < targetContrastRatio) {
      foundV = null;
    } else {
      // Binary search for the exact threshold
      for (let i = 0; i < CONTRAST_CONFIG.BINARY_SEARCH_ITERATIONS; i++) {
        const testV = (minV + maxV) / 2;
        const testColor = { h: hsva.h, s: saturation, v: testV, a: hsva.a };
        const testChroma = hsvaToChromaColor(testColor);

        // Blend the colors if there's alpha transparency
        const blendedTest =
          hsva.a < 1 ? chroma.mix(backgroundChroma, testChroma, hsva.a, "rgb") : testChroma;

        const contrast = chroma.contrast(blendedTest, backgroundChroma);

        if (Math.abs(contrast - targetContrastRatio) < CONTRAST_CONFIG.BINARY_SEARCH_TOLERANCE) {
          foundV = testV;
          break;
        }

        // Adjust search direction based on whether brighter or darker is better
        if (brighterIsBetter) {
          if (contrast < targetContrastRatio) {
            minV = testV; // Need brighter
          } else {
            maxV = testV; // Too bright
          }
        } else {
          if (contrast < targetContrastRatio) {
            maxV = testV; // Need darker
          } else {
            minV = testV; // Too dark
          }
        }

        // If we've narrowed down enough, use the current value
        if (Math.abs(maxV - minV) < 0.5) {
          foundV = brighterIsBetter ? maxV : minV;
          break;
        }
      }
    }

    if (foundV !== null) {
      const yPercent = 100 - foundV;
      points.push(`${xPercent},${yPercent}`);
      dataPoints.push({ x: xPercent, y: yPercent });
    }
  }

  if (points.length < 2) {
    return { path: null, data: null };
  }

  // Fill in missing points with interpolation to avoid dramatic jumps
  const interpolatedPoints: string[] = [];
  const pointsData = points.map((p) => {
    const [x, y] = p.split(",").map(Number);
    return { x, y };
  });

  for (let i = 0; i < pointsData.length - 1; i++) {
    const current = pointsData[i];
    const next = pointsData[i + 1];

    interpolatedPoints.push(`${current.x},${current.y}`);

    // If there's a big jump (>threshold units), don't interpolate - likely crossing from bright to dark threshold
    const yDiff = Math.abs(next.y - current.y);
    if (yDiff > CONTRAST_CONFIG.JUMP_THRESHOLD) {
      interpolatedPoints.push(`${current.x + 0.1},${current.y}`);
      interpolatedPoints.push(`M ${next.x},${next.y}`);
    }
  }

  // Add the last point
  const lastPoint = pointsData[pointsData.length - 1];
  interpolatedPoints.push(`${lastPoint.x},${lastPoint.y}`);

  // Apply smoothing to reduce minor wonky behavior
  const smoothedPoints = interpolatedPoints.map((point, index) => {
    if (point.startsWith("M ") || index === 0 || index === interpolatedPoints.length - 1)
      return point;

    const [x, y] = point.split(",").map(Number);
    const prevPoint = interpolatedPoints[index - 1];
    const nextPoint = interpolatedPoints[index + 1];

    if (prevPoint.startsWith("M ") || nextPoint.startsWith("M ")) return point;

    const prevY = Number(prevPoint.split(",")[1]);
    const nextY = Number(nextPoint.split(",")[1]);

    // Simple smoothing: average with neighbors, but limit the change
    const avgY = (prevY + y + nextY) / 3;
    const smoothedY =
      Math.abs(avgY - y) > CONTRAST_CONFIG.SMOOTHING_MAX_CHANGE
        ? y + Math.sign(avgY - y) * CONTRAST_CONFIG.SMOOTHING_MAX_CHANGE
        : avgY;

    return `${x},${smoothedY}`;
  });

  // Create a smooth SVG path, handling multiple path segments
  let path = "";
  let isFirstPoint = true;

  for (const point of smoothedPoints) {
    if (point.startsWith("M ")) {
      path += ` ${point}`;
      isFirstPoint = false;
    } else {
      if (isFirstPoint) {
        path = `M ${point}`;
        isFirstPoint = false;
      } else {
        path += ` L ${point}`;
      }
    }
  }

  return { path, data: dataPoints };
};

export const generateNonCompliantDots = (
  hsva: HsvaColor,
  backgroundHsva?: HsvaColor
): JSX.Element[] | null => {
  if (!backgroundHsva) return null;

  const backgroundChroma = hsvaToChromaColor(backgroundHsva);

  const dots: JSX.Element[] = [];
  const dotSpacing = CONTRAST_CONFIG.DOT_SPACING;
  const dotSize = CONTRAST_CONFIG.DOT_SIZE;

  // Simple and direct: test every dot position
  for (let x = dotSpacing / 2; x < 100; x += dotSpacing) {
    for (let y = dotSpacing / 2; y < 100; y += dotSpacing) {
      const saturation = x;
      const brightness = 100 - y; // Inverted: y=0 is bright, y=100 is dark

      // Test if this position is non-compliant
      const testColor = { h: hsva.h, s: saturation, v: brightness, a: hsva.a };
      const testChroma = hsvaToChromaColor(testColor);

      // Blend colors if there's alpha transparency
      const blendedTest =
        hsva.a < 1 ? chroma.mix(backgroundChroma, testChroma, hsva.a, "rgb") : testChroma;

      const contrast = chroma.contrast(blendedTest, backgroundChroma);

      // Only show dots where contrast is insufficient
      if (contrast < CONTRAST_CONFIG.TARGET_RATIO) {
        dots.push(
          <div
            key={`${x}-${y}`}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: `${dotSize}px`,
              height: `${dotSize}px`,
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              transform: `translate(-${dotSize / 2}px, -${dotSize / 2}px)`,
              pointerEvents: "none",
            }}
          />
        );
      }
    }
  }

  return dots.length > 0 ? dots : null;
};
