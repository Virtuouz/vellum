import mermaid from "https://unpkg.com/mermaid@11.6.0/dist/mermaid.esm.min.mjs";

function getThemeVariables() {
  const style = getComputedStyle(document.documentElement);
  const v = (name) => style.getPropertyValue(name).trim();

  const accentPrimary = v("--accent-primary");
  const textPrimary = v("--text-primary");
  const borderPrimary = v("--border-primary");
  const backgroundSurface = v("--background-surface");
  const backgroundHover = v("--background-interactive-hover");
  const backgroundBody = v("--background-body");
  const textMuted = v("--text-muted");

  return {
    primaryColor: accentPrimary,
    primaryTextColor: textPrimary,
    primaryBorderColor: borderPrimary,
    secondaryColor: backgroundSurface,
    tertiaryColor: backgroundHover,
    background: backgroundBody,
    mainBkg: backgroundSurface,
    textColor: textPrimary,
    lineColor: textMuted,
    nodeBorder: borderPrimary,
    clusterBkg: backgroundBody,
    clusterBorder: borderPrimary,
    actorBkg: backgroundSurface,
    actorBorder: borderPrimary,
    actorTextColor: textPrimary,
    actorLineColor: textMuted,
    signalColor: textPrimary,
    signalTextColor: textPrimary,
    noteBkgColor: backgroundSurface,
    noteBorderColor: borderPrimary,
    noteTextColor: textPrimary,
    activationBkgColor: backgroundHover,
    activationBorderColor: borderPrimary,
    labelBoxBkgColor: backgroundSurface,
    labelBoxBorderColor: borderPrimary,
    labelTextColor: textPrimary,
  };
}

function preserveSources() {
  document.querySelectorAll("pre.mermaid").forEach((el) => {
    if (!el.getAttribute("data-mermaid-source")) {
      el.setAttribute("data-mermaid-source", el.textContent);
    }
  });
}

function restoreSources() {
  document.querySelectorAll("pre.mermaid").forEach((el) => {
    const source = el.getAttribute("data-mermaid-source");
    if (source) {
      el.textContent = source;
      el.removeAttribute("data-processed");
    }
  });
}

// --- Gesture handling ---

const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
const SCROLL_MSG = isMac
  ? "Use \u2318 + scroll to zoom"
  : "Use Ctrl + scroll to zoom";
const TOUCH_MSG = "Use two fingers to move the diagram";
const OVERLAY_TIMEOUT = 1000;
const gestureControllers = new Map();

function showOverlay(container, type) {
  let overlay = container.querySelector(".mermaid-gesture-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "mermaid-gesture-overlay";
    container.appendChild(overlay);
  }
  overlay.textContent = type === "scroll" ? SCROLL_MSG : TOUCH_MSG;
  overlay.classList.add("active");

  clearTimeout(container._gestureTimer);
  container._gestureTimer = setTimeout(() => {
    overlay.classList.remove("active");
  }, OVERLAY_TIMEOUT);
}

function hideOverlay(container) {
  const overlay = container.querySelector(".mermaid-gesture-overlay");
  if (overlay) overlay.classList.remove("active");
  clearTimeout(container._gestureTimer);
}

function getTouchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

function getTouchCenter(touches) {
  return {
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  };
}

function setupGestureHandling(container, instance) {
  if (gestureControllers.has(container)) {
    gestureControllers.get(container).abort();
  }
  const controller = new AbortController();
  gestureControllers.set(container, controller);
  const sig = { signal: controller.signal };

  // Gate svg-pan-zoom's built-in panning by input type.
  // Capture phase fires on the container BEFORE svg-pan-zoom's handler on the
  // SVG child, so we can toggle panEnabled before it checks the flag.
  // Mouse → enable (desktop click-drag panning works normally)
  // Touch → disable (prevents single-finger panning; we handle two-finger manually)
  container.addEventListener(
    "pointerdown",
    (e) => {
      if (e.pointerType === "touch") {
        instance.disablePan();
      } else {
        instance.enablePan();
      }
    },
    { capture: true, ...sig }
  );

  // Desktop: Ctrl/Cmd + scroll to zoom
  container.addEventListener(
    "wheel",
    (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const factor = e.deltaY > 0 ? 0.9 : 1.1;
        instance.zoomBy(factor);
        hideOverlay(container);
      } else {
        showOverlay(container, "scroll");
      }
    },
    { ...sig, passive: false }
  );

  // Touch: two-finger pan and pinch-to-zoom (handled manually via panBy/zoomBy)
  let pinchDistance = null;
  let lastTouchCenter = null;

  container.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length >= 2) {
        pinchDistance = getTouchDistance(e.touches);
        lastTouchCenter = getTouchCenter(e.touches);
        hideOverlay(container);
      } else {
        pinchDistance = null;
        lastTouchCenter = null;
      }
    },
    { ...sig, passive: true }
  );

  container.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length >= 2) {
        e.preventDefault();
        hideOverlay(container);

        const currentDistance = getTouchDistance(e.touches);
        const center = getTouchCenter(e.touches);

        if (pinchDistance !== null) {
          const factor = currentDistance / pinchDistance;
          instance.zoomBy(factor);
        }
        pinchDistance = currentDistance;

        if (lastTouchCenter !== null) {
          instance.panBy({
            x: center.x - lastTouchCenter.x,
            y: center.y - lastTouchCenter.y,
          });
        }
        lastTouchCenter = center;
      } else {
        showOverlay(container, "touch");
        pinchDistance = null;
        lastTouchCenter = null;
      }
    },
    { ...sig, passive: false }
  );

  container.addEventListener(
    "touchend",
    (e) => {
      if (e.touches.length < 2) {
        pinchDistance = null;
        lastTouchCenter = null;
      }
      hideOverlay(container);
    },
    { ...sig, passive: true }
  );
}

// --- Pan-zoom initialization ---

function initPanZoom() {
  if (typeof window.svgPanZoom !== "function") return;

  document.querySelectorAll("pre.mermaid svg").forEach((svg) => {
    if (svg.classList.contains("pan-zoom-enabled")) return;

    const container = svg.closest("pre.mermaid");
    const viewBox = svg.getAttribute("viewBox");
    if (!viewBox) return;

    const parts = viewBox.split(/[\s,]+/).map(Number);
    const vbWidth = parts[2];
    const vbHeight = parts[3];

    // Calculate container height from aspect ratio, capped to reasonable bounds
    const containerWidth = container.clientWidth;
    const naturalHeight = (containerWidth / vbWidth) * vbHeight;
    const height = Math.max(Math.min(naturalHeight, 800), 500);
    container.style.height = height + "px";

    // Remove mermaid's inline sizing so svg-pan-zoom has full control
    svg.removeAttribute("style");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");

    svg.classList.add("pan-zoom-enabled");

    const instance = window.svgPanZoom(svg, {
      zoomEnabled: true,
      controlIconsEnabled: true,
      fit: true,
      center: true,
      minZoom: 0.5,
      maxZoom: 10,
      mouseWheelZoomEnabled: false,
    });

    setupGestureHandling(container, instance);
  });
}

// --- Rendering ---

async function renderMermaid() {
  const themeVariables = getThemeVariables();

  mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    themeVariables,
  });

  await mermaid.run();
  initPanZoom();
}

document.addEventListener("DOMContentLoaded", async () => {
  preserveSources();
  await renderMermaid();

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        restoreSources();
        renderMermaid();
        break;
      }
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
});
