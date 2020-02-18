#!/bin/sh

# Ethereum
echo '-> Building Etehreum conventions ...'
mkdir -p tmp/ethereum
cp ../../packages/0xcert-ethereum-erc20-contracts/build/token-mock.json tmp/ethereum/
cp ../../packages/0xcert-ethereum-xcert-contracts/build/xcert-mock.json tmp/ethereum/

# Wanchain
echo '-> Building Wanchain conventions ...'
mkdir -p tmp/wanchain/
cd ../../packages/0xcert-ethereum-erc20-contracts
rushx build:wanchain
cp ./build/wanchain/token-mock.json ../../common/scripts/tmp/wanchain/
rm -Rf ./build/wanchain
cd ../0xcert-ethereum-xcert-contracts
rushx build:wanchain
cp ./build/wanchain/xcert-mock.json ../../common/scripts/tmp/wanchain/
rm -Rf ./build/wanchain
cd ../../common/scripts

# Conventions
echo '-> Building asset conventions ...'
node -e "
const { promises } = require('fs')
const { schema86, schema87, schema88, schemaErc721, xcertSchema } = require('../../packages/0xcert-conventions');
(async () => {
  await promises.writeFile(
    './tmp/86-base-asset.json',
    JSON.stringify(schema86)
  )
  await promises.writeFile(
    './tmp/87-asset-evidence.json',
    JSON.stringify(schema87)
  )
  await promises.writeFile(
    './tmp/88-crypto-collectible.json',
    JSON.stringify(schema88)
  )
  await promises.writeFile(
    './tmp/erc721.json',
    JSON.stringify(schemaErc721)
  )
  await promises.writeFile(
    './tmp/xcert-schema.json',
    JSON.stringify(xcertSchema)
  )
})();
"

# Deploy to Github

echo ' Deploying to Github ...'
cd tmp
echo 'conventions.0xcert.org' > CNAME
git init
git add -A
git commit -m "Deploy conventions"
git push -f git@github.com:0xcert/conventions.git master:master
cd -

# Cleenup
echo ' Cleaning up ...'
rm -Rf tmp

echo '-> Build complete.'
