const { format } = require('date-fns');
const { execSync } = require('child_process');
const appendSpreadSheet = require('./google');
const screenshot = require('screenshot-desktop');
const sharp = require('sharp');

const topNumPos = { left: 1620, top: 310, width: 200, height: 100 };
const bottomNumPos = { left: 1622, top: 705, width: 200, height: 100 };
const topTextPos = { left: 1789, top: 228, width: 70, height: 23 };
const bottomTextPos = { left: 1797, top: 615, width: 60, height: 21 };
const itemPos = { left: 552, top: 294, width: 240, height: 50 };

async function bootstrap() {
  const img = await screenshot({ format: 'png' });

  // before resizing, 1.85 was being OCR-ed as 185
  await sharp(img).extract(itemPos).toFile('./screenshots/item.png');
  await sharp(img).extract(topNumPos).resize(800).toFile('./screenshots/topNum.png');
  await sharp(img).extract(bottomNumPos).resize(800).toFile('./screenshots/bottomNum.png');
  await sharp(img).extract(topTextPos).toFile('./screenshots/topText.png');
  await sharp(img).extract(bottomTextPos).toFile('./screenshots/bottomText.png');

  const item = execSync('tesseract screenshots\\item.png stdout', { encoding: 'utf8' }).trim().replaceAll('\r\n', ' ');
  const topText = execSync('tesseract screenshots\\topText.png stdout', { encoding: 'utf8' }).trim();
  const bottomText = execSync('tesseract screenshots\\bottomText.png stdout', { encoding: 'utf8' }).trim();
  const topNum = +execSync('tesseract screenshots\\topNum.png stdout', { encoding: 'utf8' }).trim().replaceAll(',', '') || 0;
  const bottomNum = +execSync('tesseract screenshots\\bottomNum.png stdout', { encoding: 'utf8' }).trim().replaceAll(',', '') || 0;
  let buyPrice, sellPrice;
  if (topText === 'SELL' || bottomText === 'BUY') {
    sellPrice = topNum;
    buyPrice = bottomNum;
  } else {
    sellPrice = bottomNum;
    buyPrice = topNum;
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

