import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const svgPath = path.resolve("public/og.svg");
const pngPath = path.resolve("public/og.png");

const svgBuffer = fs.readFileSync(svgPath);

await sharp(svgBuffer, { density: 200 })
  .resize(1200, 630)
  .png({ quality: 90 })
  .toFile(pngPath);

const stats = fs.statSync(pngPath);
console.log(`✓ Generated og.png (${(stats.size / 1024).toFixed(1)} KB)`);
