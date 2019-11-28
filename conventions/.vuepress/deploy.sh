cp ../../packages/0xcert-ethereum-erc20-contracts/build/token-mock.json ./public/ethereum/
cp ../../packages/0xcert-ethereum-xcert-contracts/build/xcert-mock.json ./public/ethereum/
cd ../../packages/0xcert-ethereum-erc20-contracts
npx specron compile --evmVersion byzantium --build ./build/wanchain
cd ../0xcert-ethereum-xcert-contracts
npx specron compile --evmVersion byzantium --build ./build/wanchain
cd ../../conventions/.vuepress
cp ../../packages/0xcert-ethereum-erc20-contracts/build/wanchain/token-mock.json ./public/wanchain/
cp ../../packages/0xcert-ethereum-xcert-contracts/build/wanchain/xcert-mock.json ./public/wanchain/
set -e
npm run build
cd dist
echo 'conventions.0xcert.org' > CNAME
git init
git add -A
git commit -m "Deploy conventions"
git push -f git@github.com:0xcert/conventions master
cd -
echo ''
echo '--------------------------------------------------------------'
echo '  Deployment complete. Visit: https://conventions.0xcert.org  '
echo '--------------------------------------------------------------'