import * as pt from 'path';
import * as fs from 'fs-extra';

function getMinterAbi() {
  return require('@0xcert/web3-dxm/build/minter')['Minter']['abi'];
}

function readEnvFile() {
  return fs.readFileSync(pt.join('src', 'config', 'env.ts'), 'utf8');
}

function replaceAbi(src, abi) {
  const prefix = 'export const minterAbi = JSON.parse(\'';
  const prefixParts = src.split(prefix);

  const suffix = '\');';
  const suffixParts = prefixParts.slice(1).join(prefix).split(suffix);

  return `${prefixParts[0]}${prefix}${JSON.stringify(abi)}${suffix}${suffixParts.slice(1).join(suffix)}`;
}

function updateEnvFile() {
  const abi = getMinterAbi();
  const src = readEnvFile();
  fs.writeFileSync(pt.join('src', 'config', 'env.ts'), replaceAbi(src, abi), 'utf8');
}

updateEnvFile();
