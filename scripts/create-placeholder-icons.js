#!/usr/bin/env node

/**
 * Creates placeholder PNG icons for PWA
 * This creates simple solid-color PNG files as placeholders
 * Replace these with proper icons using the generate-icons.html tool
 */

const fs = require('fs');
const path = require('path');

// Minimal 1x1 blue PNG in base64
const bluePNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create placeholder icons
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), bluePNG);
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), bluePNG);

console.log('✓ Created placeholder PNG icons');
console.log('⚠ These are 1x1 pixel placeholders');
console.log('→ Open scripts/generate-icons.html in a browser to create proper icons');
console.log('→ Or use an online tool to generate 192x192 and 512x512 PNG icons');
