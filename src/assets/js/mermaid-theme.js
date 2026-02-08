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

// --- Overlay helpers ---

const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
const SCROLL_MSG = isMac
  ? "Use \u2318 + scroll to zoom"
  : "Use Ctrl + scroll to zoom";
const TOUCH_MSG = "Use two fingers to move the diagram";
const OVERLAY_TIMEOUT = 1000;

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

// --- Custom SvgPanZoom class ---

class SvgPanZoom {
  constructor(svg, { minZoom = 0.5, maxZoom = 10, controlIconsEnabled = true } = {}) {
    this._svg = svg;
    this._container = svg.closest("pre.mermaid");
    this._minZoom = minZoom;
    this._maxZoom = maxZoom;
    this._abortController = new AbortController();

    // Read viewBox for diagram dimensions
    const vb = svg.getAttribute("viewBox");
    const parts = vb.split(/[\s,]+/).map(Number);
    this._vbX = parts[0];
    this._vbY = parts[1];
    this._vbWidth = parts[2];
    this._vbHeight = parts[3];

    // Wrap SVG children in a <g> for transforms
    this._wrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this._wrapper.setAttribute("data-pan-zoom-wrapper", "");
    const children = Array.from(svg.childNodes);
    for (const child of children) {
      const tag = child.nodeName && child.nodeName.toLowerCase();
      if (tag === "defs" || tag === "style") continue;
      this._wrapper.appendChild(child);
    }
    svg.appendChild(this._wrapper);

    // Initial transform state
    this._scale = 1;
    this._tx = 0;
    this._ty = 0;
    this._fitAndCenter();

    if (controlIconsEnabled) {
      this._createControls();
    }

    this._setupGestures();
  }

  _fitAndCenter() {
    const svgRect = this._svg.getBoundingClientRect();
    const containerW = svgRect.width || this._container.clientWidth;
    const containerH = svgRect.height || this._container.clientHeight;

    // Set viewBox to match pixel space so our wrapper transform has full control
    // (prevents the SVG's native viewBox mapping from double-scaling)
    this._svg.setAttribute("viewBox", `0 0 ${containerW} ${containerH}`);

    // Scale to fit the diagram within the container
    const scaleX = containerW / this._vbWidth;
    const scaleY = containerH / this._vbHeight;
    this._scale = Math.min(scaleX, scaleY);

    // Center the diagram
    this._tx = (containerW - this._vbWidth * this._scale) / 2 - this._vbX * this._scale;
    this._ty = (containerH - this._vbHeight * this._scale) / 2 - this._vbY * this._scale;

    this._applyTransform();
  }

  _applyTransform() {
    const s = this._scale;
    this._wrapper.setAttribute(
      "transform",
      `matrix(${s},0,0,${s},${this._tx},${this._ty})`
    );
  }

  _clampZoom(scale) {
    return Math.min(this._maxZoom, Math.max(this._minZoom, scale));
  }

  panBy({ x, y }) {
    this._tx += x;
    this._ty += y;
    this._applyTransform();
  }

  zoomBy(factor) {
    // Zoom at the SVG center
    const svgRect = this._svg.getBoundingClientRect();
    const cx = svgRect.width / 2;
    const cy = svgRect.height / 2;
    this.zoomAtPoint(factor, { x: cx, y: cy });
  }

  zoomAtPoint(factor, { x, y }) {
    const oldScale = this._scale;
    const newScale = this._clampZoom(oldScale * factor);
    if (newScale === oldScale) return;

    const ratio = newScale / oldScale;
    this._tx = x * (1 - ratio) + this._tx * ratio;
    this._ty = y * (1 - ratio) + this._ty * ratio;
    this._scale = newScale;
    this._applyTransform();
  }

  fit() {
    this._fitAndCenter();
  }

  _createControls() {
    const controls = document.createElement("div");
    controls.className = "svg-pan-zoom-control";
    this._controlsEl = controls;

    const btnIn = document.createElement("button");
    btnIn.textContent = "+";
    btnIn.title = "Zoom in";
    btnIn.addEventListener("click", () => this.zoomBy(1.2));

    const btnOut = document.createElement("button");
    btnOut.textContent = "\u2212";
    btnOut.title = "Zoom out";
    btnOut.addEventListener("click", () => this.zoomBy(0.8));

    const btnFit = document.createElement("button");
    btnFit.textContent = "\u21BA";
    btnFit.title = "Fit to view";
    btnFit.addEventListener("click", () => this.fit());

    controls.appendChild(btnIn);
    controls.appendChild(btnOut);
    controls.appendChild(btnFit);
    this._container.appendChild(controls);
  }

  _setupGestures() {
    const sig = { signal: this._abortController.signal };
    const container = this._container;

    // Desktop: Ctrl/Cmd + scroll to zoom at cursor
    container.addEventListener(
      "wheel",
      (e) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const factor = e.deltaY > 0 ? 0.9 : 1.1;
          const rect = this._svg.getBoundingClientRect();
          this.zoomAtPoint(factor, {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
          hideOverlay(container);
        } else {
          showOverlay(container, "scroll");
        }
      },
      { ...sig, passive: false }
    );

    // Desktop: mouse drag to pan
    let dragging = false;
    let lastMouse = null;

    container.addEventListener(
      "mousedown",
      (e) => {
        if (e.button !== 0) return;
        dragging = true;
        lastMouse = { x: e.clientX, y: e.clientY };
        container.style.cursor = "grabbing";
        e.preventDefault();
      },
      sig
    );

    window.addEventListener(
      "mousemove",
      (e) => {
        if (!dragging || !lastMouse) return;
        this.panBy({
          x: e.clientX - lastMouse.x,
          y: e.clientY - lastMouse.y,
        });
        lastMouse = { x: e.clientX, y: e.clientY };
      },
      sig
    );

    window.addEventListener(
      "mouseup",
      () => {
        if (dragging) {
          dragging = false;
          lastMouse = null;
          container.style.cursor = "grab";
        }
      },
      sig
    );

    container.style.cursor = "grab";

    // Mobile touch: two-finger pinch + pan; single finger shows overlay
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
            const rect = this._svg.getBoundingClientRect();
            this.zoomAtPoint(factor, {
              x: center.x - rect.left,
              y: center.y - rect.top,
            });
          }
          pinchDistance = currentDistance;

          if (lastTouchCenter !== null) {
            this.panBy({
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

  destroy() {
    this._abortController.abort();

    // Remove controls
    if (this._controlsEl && this._controlsEl.parentNode) {
      this._controlsEl.remove();
    }

    // Restore original viewBox
    this._svg.setAttribute(
      "viewBox",
      `${this._vbX} ${this._vbY} ${this._vbWidth} ${this._vbHeight}`
    );

    // Unwrap the <g> — move children back to SVG root
    while (this._wrapper.firstChild) {
      this._svg.appendChild(this._wrapper.firstChild);
    }
    this._wrapper.remove();
  }
}

// --- Pan-zoom initialization ---

const panZoomInstances = new Map();

function initPanZoom() {
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

    // Remove mermaid's inline sizing so our pan-zoom has full control
    svg.removeAttribute("style");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");

    svg.classList.add("pan-zoom-enabled");

    // Destroy previous instance if re-rendering (e.g. theme switch)
    if (panZoomInstances.has(container)) {
      panZoomInstances.get(container).destroy();
    }

    const instance = new SvgPanZoom(svg, {
      minZoom: 0.5,
      maxZoom: 10,
      controlIconsEnabled: true,
    });
    panZoomInstances.set(container, instance);
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
