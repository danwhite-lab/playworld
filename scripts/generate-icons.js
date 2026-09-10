import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function generate() {
  const svgPath = path.join(rootDir, 'icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  // 192x192 PNG
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(rootDir, 'icon-192.png'));
  console.log('Generated icon-192.png');

  // 512x512 PNG
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(rootDir, 'icon-512.png'));
  console.log('Generated icon-512.png');

  // 180x180 Apple Touch Icon PNG
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(rootDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // Favicon 32x32 PNG
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(rootDir, 'favicon.png'));
  console.log('Generated favicon.png');

  // Maskable 512x512 with 15% safe margin
  const innerSize = Math.round(512 * 0.75); // 384px inside 512px
  const innerBuffer = await sharp(svgBuffer)
    .resize(innerSize, innerSize)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 56, g: 189, b: 248, alpha: 1 } // #38bdf8
    }
  })
    .composite([{ input: innerBuffer, gravity: 'center' }])
    .png()
    .toFile(path.join(rootDir, 'icon-maskable-512.png'));
  console.log('Generated icon-maskable-512.png');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
