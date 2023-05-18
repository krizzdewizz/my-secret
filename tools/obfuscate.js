const glob = require('glob');
const fs = require('fs');
const { join } = require('path');
const jsObfuscator = require('javascript-obfuscator');

const obfuscate = js => {
  return jsObfuscator.obfuscate(js, {
    numbersToExpressions: true,
    stringArrayShuffle: true,
    splitStrings: true,
    splitStringsChunkLength: 2,
    stringArrayThreshold: 1
  }).getObfuscatedCode();
};

(() => {
  const all = glob.sync(join(__dirname, '..', 'dist', `/**/*.js`));

  all.forEach(file => {
    console.log(`obfuscating ${file}`);
    const js = String(fs.readFileSync(file));
    fs.writeFileSync(file, obfuscate(js));
  });
})();