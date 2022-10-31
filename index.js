const { format } = require('date-fns');
const { execSync } = require('child_process');
const appendSpreadSheet = require('./google');
const screenshot = require('screenshot-desktop');
const sharp = require('sharp');

const num1Pos = { left: 1620, top: 310, width: 200, height: 100 };
const num2Pos = { left: 1622, top: 705, width: 200, height: 100 };
const text1Pos = { left: 1789, top: 228, width: 70, height: 23 };
const text2Pos = { left: 1797, top: 615, width: 60, height: 21 };
const itemPos = { left: 552, top: 294, width: 240, height: 50 };

async function bootstrap() {
  const img = await screenshot({ format: 'png' });

  // before resizing, 1.85 was being OCR-ed as 185
  await sharp(img).extract(itemPos).resize(800).toFile('./screenshots/item.png');
  await sharp(img).extract(num1Pos).resize(800).toFile('./screenshots/num1.png');
  await sharp(img).extract(num2Pos).resize(800).toFile('./screenshots/num2.png');
  await sharp(img).extract(text1Pos).resize(800).toFile('./screenshots/text1.png');
  await sharp(img).extract(text2Pos).resize(800).toFile('./screenshots/text2.png');

  const item = execSync('tesseract screenshots\\item.png stdout', { encoding: 'utf8' }).trim().replaceAll('\r\n', ' ');
  const text1 = execSync('tesseract screenshots\\text1.png stdout', { encoding: 'utf8' }).trim();
  const text2 = execSync('tesseract screenshots\\text2.png stdout', { encoding: 'utf8' }).trim();
  const num1 = +execSync('tesseract screenshots\\num1.png stdout', { encoding: 'utf8' }).trim() || 0;
  const num2 = +execSync('tesseract screenshots\\num2.png stdout', { encoding: 'utf8' }).trim() || 0;
  let buyPrice, sellPrice;
  if (text1 === 'SELL' || text2 === 'BUY') {
    sellPrice = num1;
    buyPrice = num2;
  } else {
    sellPrice = num2;
    buyPrice = num1;
  }

  const date = format(new Date(), 'MM/dd/yyyy HH:MM:SS');
  console.log(date, '|', item, '| buy', buyPrice, '| sell', sellPrice);
  const row = [date, item, buyPrice, sellPrice];
  if (!item) {
    throw new Error('oiii');
  }

  await appendSpreadSheet([row]);
}

bootstrap();

