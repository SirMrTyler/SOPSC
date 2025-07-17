const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const variant = process.env.APP_VARIANT;
if (!variant) {
  console.error('APP_VARIANT environment variable not set');
  process.exit(1);
}

let source;
if (variant === 'development') {
  source = path.join(__dirname, '..', 'config', 'google-services.dev.json');
} else if (variant === 'production') {
  source = path.join(__dirname, '..', 'config', 'google-services.prod.json');
} else {
  console.error(`Unknown APP_VARIANT: ${variant}`);
  process.exit(1);
}

if (!fs.existsSync(source)) {
  console.error(`Missing google-services file for variant '${variant}': ${source}`);
  process.exit(1);
}

const dest = path.join(__dirname, '..', 'android', 'app', 'google-services.json');
fs.copyFileSync(source, dest);
console.log(`Copied ${source} to ${dest}`);

execSync('npx expo prebuild --clean --platform android', { stdio: 'inherit' });