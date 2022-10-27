const screenshot = require('screenshot-desktop');
const ocr = require('./ocr');
const registerCallbackOnKey = require('./keyboardListener');

async function bootstrap() {
  const worker = await ocr.createWorker();

  const run = async () => {
    const img = await screenshot({ format: 'png' });
    const { data: { text } } = await worker.recognize(img);
    console.log(text);
  };

  // await run();
  registerCallbackOnKey('f10', run);
  // await worker.terminate();
}

bootstrap();

