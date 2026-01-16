/**
 * PWA Icon Generation Script
 * Generates icons from logo.svg for PWA manifest
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputSvg = path.join(__dirname, '../public/logo.svg');
const outputDir = path.join(__dirname, '../public/icons');

// Icon configurations
const icons = [
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-512x512.png', size: 512 },
  { name: 'icon-maskable-512x512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180 },
];

// Background color for icons (dark theme)
const backgroundColor = '#0a0a0a';

// Create an SVG wrapper with background and centered logo
function createIconSvg(logoSvg, size, maskable = false) {
  // For maskable icons, we need to leave safe zone (10% padding on each side = 20% total)
  // So the actual content should be 80% of the icon size, centered
  const padding = maskable ? Math.round(size * 0.1) : Math.round(size * 0.15);
  const logoSize = size - (padding * 2);

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${backgroundColor}"/>
      <g transform="translate(${padding}, ${padding})">
        <svg width="${logoSize}" height="${logoSize}" viewBox="0 0 88 87">
          ${logoSvg}
        </svg>
      </g>
    </svg>
  `;
}

async function generateIcons() {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Read the original SVG
  const originalSvg = fs.readFileSync(inputSvg, 'utf-8');

  // Extract the inner content of the SVG (everything inside the <svg> tag)
  const svgContent = originalSvg
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '');

  console.log('Generating PWA icons...\n');

  for (const icon of icons) {
    const iconSvg = createIconSvg(svgContent, icon.size, icon.maskable);
    const outputPath = path.join(outputDir, icon.name);

    await sharp(Buffer.from(iconSvg))
      .png()
      .toFile(outputPath);

    console.log(`Generated: ${icon.name} (${icon.size}x${icon.size})`);
  }

  console.log('\nPWA icons generated successfully!');
  console.log(`Output directory: ${outputDir}`);
}

generateIcons().catch(console.error);
