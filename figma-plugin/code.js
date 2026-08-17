// SpecLens Figma Importer
// Takes the structured prototype JSON exported from SpecLens
// (app_name, tagline, primary_action, pages[], primary_flow[])
// and builds real Figma frames/text/auto-layout nodes from it.

figma.showUI(__html__, { width: 380, height: 560 });

const COLORS = {
  ink: { r: 0x12 / 255, g: 0x14 / 255, b: 0x1c / 255 },
  paper: { r: 0xfa / 255, g: 0xf9 / 255, b: 0xf6 / 255 },
  white: { r: 1, g: 1, b: 1 },
  focus: { r: 0x2f / 255, g: 0x4c / 255, b: 0xff / 255 },
  focusSoft: { r: 0xee / 255, g: 0xf1 / 255, b: 1 },
  graphite: { r: 0x5b / 255, g: 0x5f / 255, b: 0x6b / 255 },
  graphiteLight: { r: 0x9a / 255, g: 0x9d / 255, b: 0xa5 / 255 },
  line: { r: 0xe6 / 255, g: 0xe4 / 255, b: 0xdd / 255 },
}

async function loadFonts() {
  await Promise.all([
    figma.loadFontAsync({ family: "Inter", style: "Regular" }),
    figma.loadFontAsync({ family: "Inter", style: "Medium" }),
    figma.loadFontAsync({ family: "Inter", style: "Bold" }),
  ]);
}

function makeText(characters, { size = 12, weight = "Regular", color = COLORS.ink, spacing = 0 } = {}) {
  const node = figma.createText();
  node.fontName = { family: "Inter", style: weight };
  node.fontSize = size;
  node.characters = characters;
  node.fills = [{ type: "SOLID", color }];
  if (spacing) node.letterSpacing = { value: spacing, unit: "PERCENT" };
  return node;
}

function makeAutoLayoutFrame({
  name,
  direction = "VERTICAL",
  spacing = 12,
  padding = 20,
  fill = COLORS.white,
  cornerRadius = 12,
  stroke = null,
  sizing = "HUG",
}) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.layoutMode = direction;
  frame.itemSpacing = spacing;
  frame.paddingTop = padding;
  frame.paddingBottom = padding;
  frame.paddingLeft = padding;
  frame.paddingRight = padding;
  frame.primaryAxisSizingMode = sizing === "HUG" ? "AUTO" : "FIXED";
  frame.counterAxisSizingMode = sizing === "HUG" ? "AUTO" : "FIXED";
  frame.cornerRadius = cornerRadius;
  frame.fills = fill ? [{ type: "SOLID", color: fill }] : [];
  if (stroke) {
    frame.strokes = [{ type: "SOLID", color: stroke }];
    frame.strokeWeight = 1;
  }
  return frame;
}

function buildComponentCard(component) {
  const card = makeAutoLayoutFrame({
    name: component.name || "Component",
    direction: "VERTICAL",
    spacing: 4,
    padding: 14,
    fill: COLORS.paper,
    cornerRadius: 8,
  });
  card.counterAxisSizingMode = "FIXED";
  card.layoutAlign = "STRETCH";

  const title = makeText(component.name || "Untitled component", {
    size: 13,
    weight: "Bold",
    color: COLORS.ink,
  });
  const purpose = makeText(component.purpose || "", {
    size: 11.5,
    weight: "Regular",
    color: COLORS.graphite,
  });
  purpose.textAutoResize = "HEIGHT";

  card.appendChild(title);
  if (component.purpose) card.appendChild(purpose);

  return card;
}

function buildPageFrame(page, index, frameWidth) {
  const frame = makeAutoLayoutFrame({
    name: `${index + 1}. ${page.name || "Page"}`,
    direction: "VERTICAL",
    spacing: 16,
    padding: 28,
    fill: COLORS.white,
    cornerRadius: 16,
    stroke: COLORS.line,
    sizing: "FIXED",
  });
  frame.resize(frameWidth, frame.height || 100);
  frame.counterAxisSizingMode = "FIXED";
  frame.primaryAxisSizingMode = "AUTO";

  // Eyebrow
  const eyebrow = makeText(`PAGE ${index + 1}`, {
    size: 10,
    weight: "Bold",
    color: COLORS.focus,
    spacing: 8,
  });

  const title = makeText(page.name || "Untitled page", {
    size: 22,
    weight: "Bold",
    color: COLORS.ink,
  });

  frame.appendChild(eyebrow);
  frame.appendChild(title);

  if (page.purpose) {
    const purpose = makeText(page.purpose, {
      size: 13,
      weight: "Regular",
      color: COLORS.graphite,
    });
    purpose.resize(frameWidth - 56, purpose.height);
    purpose.textAutoResize = "HEIGHT";
    frame.appendChild(purpose);
  }

  const components = Array.isArray(page.components) ? page.components : [];
  for (const component of components) {
    const card = buildComponentCard(component);
    card.resize(frameWidth - 56, card.height || 60);
    frame.appendChild(card);
  }

  if (components.length === 0) {
    frame.appendChild(
      makeText("No components specified for this page.", {
        size: 12,
        color: COLORS.graphiteLight,
      })
    );
  }

  return frame;
}

function buildCoverFrame(data, frameWidth) {
  const frame = makeAutoLayoutFrame({
    name: `${data.app_name || "SpecLens Prototype"} — Overview`,
    direction: "VERTICAL",
    spacing: 18,
    padding: 32,
    fill: COLORS.ink,
    cornerRadius: 16,
    sizing: "FIXED",
  });
  frame.resize(frameWidth, frame.height || 100);
  frame.counterAxisSizingMode = "FIXED";
  frame.primaryAxisSizingMode = "AUTO";

  const eyebrow = makeText("SPECLENS PROTOTYPE", {
    size: 10,
    weight: "Bold",
    color: COLORS.focus,
    spacing: 8,
  });

  const title = makeText(data.app_name || "Untitled Product", {
    size: 32,
    weight: "Bold",
    color: { r: 1, g: 1, b: 1 },
  });

  frame.appendChild(eyebrow);
  frame.appendChild(title);

  if (data.tagline) {
    const tagline = makeText(data.tagline, {
      size: 15,
      weight: "Regular",
      color: { r: 0.85, g: 0.86, b: 0.9 },
    });
    tagline.resize(frameWidth - 64, tagline.height);
    tagline.textAutoResize = "HEIGHT";
    frame.appendChild(tagline);
  }

  if (data.primary_action) {
    const action = makeAutoLayoutFrame({
      name: "Primary action",
      direction: "HORIZONTAL",
      spacing: 8,
      padding: 12,
      fill: COLORS.focus,
      cornerRadius: 8,
    });
    action.appendChild(
      makeText(data.primary_action, { size: 13, weight: "Bold", color: { r: 1, g: 1, b: 1 } })
    );
    frame.appendChild(action);
  }

  const flow = Array.isArray(data.primary_flow) ? data.primary_flow : [];
  if (flow.length > 0) {
    const flowLabel = makeText("PRIMARY FLOW", {
      size: 10,
      weight: "Bold",
      color: COLORS.graphiteLight,
      spacing: 6,
    });
    frame.appendChild(flowLabel);

    flow.forEach((step, i) => {
      const row = makeAutoLayoutFrame({
        name: `Step ${i + 1}`,
        direction: "HORIZONTAL",
        spacing: 10,
        padding: 0,
        fill: null,
        cornerRadius: 0,
      });
      row.appendChild(
        makeText(String(i + 1).padStart(2, "0"), {
          size: 12,
          weight: "Bold",
          color: COLORS.focus,
        })
      );
      const stepText = makeText(step, { size: 13, color: { r: 0.9, g: 0.9, b: 0.93 } });
      stepText.resize(frameWidth - 100, stepText.height);
      stepText.textAutoResize = "HEIGHT";
      row.appendChild(stepText);
      frame.appendChild(row);
    });
  }

  return frame;
}

figma.ui.onmessage = async (message) => {
  if (message.type !== "generate") return;

  try {
    await loadFonts();

    const data = message.data;
    const frameWidth = message.frameWidth || 1440;
    const gap = 80;

    const page = figma.currentPage;
    const nodesToSelect = [];

    const cover = buildCoverFrame(data, frameWidth);
    page.appendChild(cover);
    cover.x = 0;
    cover.y = 0;
    nodesToSelect.push(cover);

    let cursorX = frameWidth + gap;

    const pages = Array.isArray(data.pages) ? data.pages : [];
    pages.forEach((pageSpec, index) => {
      const pageFrame = buildPageFrame(pageSpec, index, frameWidth);
      page.appendChild(pageFrame);
      pageFrame.x = cursorX;
      pageFrame.y = 0;
      cursorX += frameWidth + gap;
      nodesToSelect.push(pageFrame);
    });

    figma.currentPage.selection = nodesToSelect;
    figma.viewport.scrollAndZoomIntoView(nodesToSelect);

    figma.ui.postMessage({ type: "success", pageCount: pages.length + 1 });
  } catch (error) {
    figma.ui.postMessage({
      type: "error",
      message: error && error.message ? error.message : String(error),
    });
  }
};
