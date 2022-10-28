const { execSync } = require('child_process');
const screenshot = require('screenshot-desktop');
const sharp = require('sharp');

const sellPos = { left: 1622, top: 300, width: 200, height: 100 };
const buyPos = { left: 1620, top: 705, width: 200, height: 100 };
const itemPos = { left: 552, top: 304, width: 240, height: 32 };

async function bootstrap() {
  const img = await screenshot({ format: 'png' });

  await sharp(img).extract(itemPos).toFile('./screenshots/item.png');
  await sharp(img).extract(sellPos).toFile('./screenshots/sell.png');
  await sharp(img).extract(buyPos).toFile('./screenshots/buy.png');

  console.log('item', execSync('tesseract screenshots\\item.png stdout', { encoding: 'utf8' }));
  console.log('sell', execSync('tesseract screenshots\\sell.png stdout', { encoding: 'utf8' }));
  console.log('buy', execSync('tesseract screenshots\\buy.png stdout', { encoding: 'utf8' }));
}

bootstrap();

