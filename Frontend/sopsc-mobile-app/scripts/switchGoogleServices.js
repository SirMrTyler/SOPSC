const fs = require('fs');
const path = require('path');

const variant = process.env.APP_VARIANT;
console.log(`\n⚙️  Switching Google Services config for APP_VARIANT: '${variant}'`);

if (!variant) {
  console.error('❌ APP_VARIANT environment variable is not set.');
  process.exit(1);
}

let source;
const dest = path.join(__dirname, '..', 'android', 'app', 'google-services.json');

if (variant === 'development') {
  source = path.join(__dirname, '..', 'config', 'google-services.dev.json');
} else if (variant === 'production') {
  source = path.join(__dirname, '..', 'config', 'google-services.prod.json');
} else {
  console.error(`❌ Unknown APP_VARIANT: '${variant}'`);
  process.exit(1);
}

if (!fs.existsSync(source)) {
  console.error(`❌ Google services file not found for '${variant}':\n→ Expected at: ${source}`);
  process.exit(1);
}

try {
  fs.copyFileSync(source, dest);
  console.log(`✅ Successfully copied:\n→ ${source}\n→ to ${dest}`);
} catch (error) {
  console.error(`❌ Failed to copy file from ${source} to ${dest}`);
  console.error(error);
  process.exit(1);
}
