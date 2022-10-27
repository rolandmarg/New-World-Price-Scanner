const tesseract = require('tesseract.js');

async function createWorker() {
  const worker = tesseract.createWorker({ logger: m => console.log(m) });
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');

  return worker;
}

module.exports = { createWorker };
