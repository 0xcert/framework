#!/bin/sh

# Ethereum
mkdir -p ../.tmp/conventions/ethereum
cp ../packages/0xcert-ethereum-erc20-contracts/build/token-mock.json ../.tmp/conventions/ethereum/
cp ../packages/0xcert-ethereum-xcert-contracts/build/xcert-mock.json ../.tmp/conventions/ethereum/

# Wanchain
mkdir -p ../.tmp/conventions/wanchain/
cd ../packages/0xcert-ethereum-erc20-contracts
rushx build:wanchain
cp ./build/wanchain/token-mock.json ../../.tmp/conventions/wanchain/
rm -Rf ./build/wanchain
cd ../0xcert-ethereum-xcert-contracts
rushx build:wanchain
cp ./build/wanchain/xcert-mock.json ../../.tmp/conventions/wanchain/
rm -Rf ./build/wanchain
cd ..

# Conventions
node -e '
const { promises } = require("fs")
const { schema86, schema87, schema88, schemaErc721, xcertSchema } = require("../packages/0xcert-conventions");
(async () => {
  await promises.writeFile(
    "../.tmp/conventions/86-base-asset.json",
    JSON.stringify(schema86)
  )
  await promises.writeFile(
    "../.tmp/conventions/87-asset-evidence.json",
    JSON.stringify(schema87)
  )
  await promises.writeFile(
    "../.tmp/conventions/88-crypto-collectible.json",
    JSON.stringify(schema88)
  )
  await promises.writeFile(
    "../.tmp/conventions/erc721.json",
    JSON.stringify(schemaErc721)
  )
  await promises.writeFile(
    "../.tmp/conventions/xcert-schema.json",
    JSON.stringify(xcertSchema)
  )
})();
'

# Cleenup
rm -Rf ../.tmp
