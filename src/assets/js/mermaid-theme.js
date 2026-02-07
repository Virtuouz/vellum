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
    const height = Math.max(Math.min(naturalHeight, 600), 200);
    container.style.height = height + "px";

    // Remove mermaid's inline sizing so svg-pan-zoom has full control
    svg.removeAttribute("style");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");

    svg.classList.add("pan-zoom-enabled");

    window.svgPanZoom(svg, {
      zoomEnabled: true,
      controlIconsEnabled: true,
      fit: true,
      center: true,
      minZoom: 0.5,
      maxZoom: 10,
    });
  });
}

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
