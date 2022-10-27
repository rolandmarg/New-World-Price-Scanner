const screenshot = require('screenshot-desktop');
const ocr = require('./ocr');

async function bootstrap() {
  const worker = await ocr.createWorker();

  const img = await screenshot({ format: 'png' });
  const { data: { text } } = await worker.recognize(img);
  console.log(text);
}

bootstrap();

