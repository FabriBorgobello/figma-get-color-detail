async function getColorDetails() {
  await figma.loadFontAsync({ family: "MTT Milano", style: "Medium" });
  const selection: SceneNode = figma.currentPage.selection[0];

  if (!selection || selection.type !== "FRAME") {
    figma.notify("Please select a frame with color components.");
    return;
  }

  figma.notify("Updating color details, please wait...");
  for (const colorContainer of selection.children) {
    if (colorContainer.type === "INSTANCE") {
      let color: RGB = { r: 0, g: 0, b: 0 };

      // Get color from instance
      const rectangle = colorContainer.children.find(
        (child) => child.type === "RECTANGLE"
      ) as RectangleNode;
      const fills = rectangle.fills;
      if (fills && Array.isArray(fills) && fills.length > 0) {
        color = fills[0].color;
      }

      for (const element of colorContainer.children) {
        // RGB
        if (element.type === "TEXT" && element.name === "RGB") {
          const rgb = rgbToString(color);
          element.characters = rgb;
        }
        // HSL
        if (element.type === "TEXT" && element.name === "HSL") {
          const hsl = rgbToHsl(color);
          element.characters = hsl;
        }
        // HEX
        if (element.type === "TEXT" && element.name === "HEX") {
          const hex = rgbToHex(color);
          element.characters = hex;
        }

        // Contrast
        if (element.type === "FRAME" && element.name === "Contrasts") {
          const [blue, black, white] = getContrasts(color);
          for (const contrastElement of element.children) {
            if (
              contrastElement.type === "TEXT" &&
              contrastElement.name === "Blue"
            ) {
              contrastElement.characters = blue;
              contrastElement.visible = Number(blue) > 4.5;
            }
            if (
              contrastElement.type === "TEXT" &&
              contrastElement.name === "Black"
            ) {
              contrastElement.characters = black;
              contrastElement.visible = Number(black) > 4.5;
            }
            if (
              contrastElement.type === "TEXT" &&
              contrastElement.name === "White"
            ) {
              contrastElement.characters = white;
              contrastElement.visible = Number(white) > 4.5;
            }
          }
        }
      }
    }
  }

  figma.notify("Color details updated.");
  figma.closePlugin();
}

figma.on("run", getColorDetails);

// COLOR TRANSFORMERS

function rgbToHex(color: RGB): string {
  const { r, g, b } = color;
  const hexR = Math.round(r * 255).toString(16);
  const hexG = Math.round(g * 255).toString(16);
  const hexB = Math.round(b * 255).toString(16);

  const paddedHexR = hexR.length === 1 ? "0" + hexR : hexR;
  const paddedHexG = hexG.length === 1 ? "0" + hexG : hexG;
  const paddedHexB = hexB.length === 1 ? "0" + hexB : hexB;

  return `#${paddedHexR}${paddedHexG}${paddedHexB}`;
}

function rgbToHsl(color: RGB): string {
  const { r, g, b } = color;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s,
    l;

  l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  const hslH = Math.round(h * 360);
  const hslS = Math.round(s * 100);
  const hslL = Math.round(l * 100);
  return `${hslH}, ${hslS}%, ${hslL}%`;
}

function rgbToString(color: RGB): string {
  const { r, g, b } = color;
  const rgbR = Math.round(r * 255);
  const rgbG = Math.round(g * 255);
  const rgbB = Math.round(b * 255);
  return `${rgbR}, ${rgbG}, ${rgbB}`;
}

// CONTRAST

const blue = { r: 0, g: 25 / 255, b: 120 / 255 };
const black = { r: 38 / 255, g: 38 / 255, b: 38 / 255 };
const white = { r: 255 / 255, g: 255 / 255, b: 255 / 255 };

function getContrast(color: RGB, referenceColor: RGB) {
  const colorLuminance = getLuminance(color);
  const referenceLuminance = getLuminance(referenceColor);
  const contrastRatio =
    (Math.max(colorLuminance, referenceLuminance) + 0.05) /
    (Math.min(colorLuminance, referenceLuminance) + 0.05);
  return contrastRatio.toFixed(2);
}

function getLuminance(color: RGB): number {
  const { r, g, b } = color;
  const sRGB = [r, g, b].map((c) => {
    c = c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    return c;
  });
  const luminance = 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  return luminance;
}

function getContrasts(color: RGB) {
  const blueContrast = getContrast(color, blue);
  const blackContrast = getContrast(color, black);
  const whiteContrast = getContrast(color, white);
  return [
    blueContrast.toString(),
    blackContrast.toString(),
    whiteContrast.toString(),
  ];
}
