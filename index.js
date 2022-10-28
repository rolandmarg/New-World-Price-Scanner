const { format } = require('date-fns');
const { execSync } = require('child_process');
const appendSpreadSheet = require('./google');
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

  const item = execSync('tesseract screenshots\\item.png stdout', { encoding: 'utf8' }).trim();
  const sellPrice = +execSync('tesseract screenshots\\sell.png stdout', { encoding: 'utf8' }).trim();
  const buyPrice = +execSync('tesseract screenshots\\buy.png stdout', { encoding: 'utf8' }).trim();
  const date = format(new Date(), 'MM/dd/yy HH:MM:SS');
  console.log(date, '|', item, '| buy', buyPrice, '| sell', sellPrice);
  const row = [date, item, buyPrice, sellPrice];
  if (!item || !buyPrice || !sellPrice) {
    throw new Error('oiii');
  }

  await appendSpreadSheet([row]);
}

bootstrap();

