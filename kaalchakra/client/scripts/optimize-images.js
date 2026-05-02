// client/scripts/optimize-images.js (আগের মতো কাজ করবে)
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '../public/images/zodiac');
const outputDir = path.join(__dirname, '../public/images/zodiac');

// Make sure directory exists
if (!fs.existsSync(inputDir)) {
  console.log('Creating directory:', inputDir);
  fs.mkdirSync(inputDir, { recursive: true });
}

// Process images
fs.readdirSync(inputDir).forEach(file => {
  if (file.match(/\.(png|jpg|jpeg)$/i)) {
    const inputPath = path.join(inputDir, file);
    const fileName = path.parse(file).name;
    
    // Generate WebP version only
    sharp(inputPath)
      .webp({ quality: 75 })
      .toFile(path.join(outputDir, `${fileName}.webp`))
      .then(() => console.log(`✅ Optimized: ${fileName}.webp`))
      .catch(err => console.error(`❌ Error: ${fileName}`, err));
  }
});