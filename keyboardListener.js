// courtesy of https://github.com/TooTallNate/keypress/issues/28#issue-643283219
const readline = require('readline');

readline.emitKeypressEvents(process.stdin);

function registerCallbackOnKey(key, cb) {
  process.stdin.on('keypress', (ch, input) => {
    console.log('received', ch, input);
    if (input && input.ctrl && input.name === 'c') {
      process.stdin.pause();
    }
    if (input && input.name === key) {
      cb(ch, input);
    }
  });
}

process.stdin.setRawMode(true);


module.exports = registerCallbackOnKey;