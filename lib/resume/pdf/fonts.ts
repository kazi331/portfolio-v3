import path from "node:path";
import { Font } from "@react-pdf/renderer";

export const PDF_FONT = "Carlito"; // metric-compatible with Calibri

let registered = false;

export function registerFonts() {
  if (registered) return;
  const dir = path.join(process.cwd(), "public", "fonts");
  Font.register({
    family: PDF_FONT,
    fonts: [
      { src: path.join(dir, "Carlito-Regular.ttf"), fontWeight: 400, fontStyle: "normal" },
      { src: path.join(dir, "Carlito-Bold.ttf"), fontWeight: 700, fontStyle: "normal" },
      { src: path.join(dir, "Carlito-Italic.ttf"), fontWeight: 400, fontStyle: "italic" },
      { src: path.join(dir, "Carlito-BoldItalic.ttf"), fontWeight: 700, fontStyle: "italic" },
    ],
  });
  // Never split words with hyphens — keeps URLs and tech names intact.
  Font.registerHyphenationCallback((word) => [word]);
  registered = true;
}
