#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const logMessages = [];
const contracts = {};

const NETWORK = process.env['NETWORK'] || 'ethereum';
const WEB3_URL = process.env['WEB3_URL'] || 'http://localhost:8545';
const GATEWAY_DEPLOYER_ACCOUNT = process.env['GATEWAY_DEPLOYER_ACCOUNT'];
const PROXY_DEPLOYER_ACCOUNT = process.env['PROXY_DEPLOYER_ACCOUNT'];

if (!GATEWAY_DEPLOYER_ACCOUNT) {
  throw new Error('NO GATEWAY_DEPLOYER_ACCOUNT ENV SET.')
}

if (!PROXY_DEPLOYER_ACCOUNT) {
  throw new Error('NO PROXY_DEPLOYER_ACCOUNT ENV SET.')
}

log('*** ENV ***');
log(`NETWORK: ${NETWORK}`);
log(`GATEWAY_DEPLOYER_ACCOUNT: ${GATEWAY_DEPLOYER_ACCOUNT}`);
log(`PROXY_DEPLOYER_ACCOUNT: ${PROXY_DEPLOYER_ACCOUNT}`);
log(`WEB3_URL: ${WEB3_URL}`);

if (NETWORK === 'wanchain') {
  log('*** Building wanchain contracts ***');
  execSync('cd ../../packages/0xcert-ethereum-gateway-contracts && rushx build:wanchain');
  execSync('cd ../../packages/0xcert-ethereum-proxy-contracts && rushx build:wanchain');
  log('*** Build complete ***');

  contracts['actionsGatewayContract'] = require('../../packages/0xcert-ethereum-gateway-contracts/build/wanchain/actions-gateway.json');
  contracts['tokenDeployGatewayContract'] = require('../../packages/0xcert-ethereum-gateway-contracts/build/wanchain/token-deploy-gateway.json');
  contracts['xcertDeployGatewayContract'] = require('../../packages/0xcert-ethereum-gateway-contracts/build/wanchain/xcert-deploy-gateway.json');

  contracts['tokenTransferProxyContract'] = require('../../packages/0xcert-ethereum-proxy-contracts/build/wanchain/token-transfer-proxy.json');
  contracts['nfTokenTransferProxyContract'] = require('../../packages/0xcert-ethereum-proxy-contracts/build/wanchain/nftoken-transfer-proxy.json');
  contracts['nfTokenSafeTransferProxyContract'] = require('../../packages/0xcert-ethereum-proxy-contracts/build/wanchain/nftoken-safe-transfer-proxy.json');
  contracts['xcertMintProxyContract'] = require('../../packages/0xcert-ethereum-proxy-contracts/build/wanchain/xcert-create-proxy.json');
  contracts['xcertUpdateProxyContract'] = require('../../packages/0xcert-ethereum-proxy-contracts/build/wanchain/xcert-update-proxy.json');
  contracts['abilitableManageProxyContract'] = require('../../packages/0xcert-ethereum-proxy-contracts/build/wanchain/abilitable-manage-proxy.json');
  contracts['xcertBurnProxyContract'] = require('../../packages/0xcert-ethereum-proxy-contracts/build/wanchain/xcert-burn-proxy.json');
  contracts['xcertDeployProxyContract'] = require('../../packages/0xcert-ethereum-proxy-contracts/build/wanchain/xcert-deploy-proxy.json');
  contracts['tokenDeployProxyContract'] = require('../../packages/0xcert-ethereum-proxy-contracts/build/wanchain/token-deploy-proxy.json');
} else {
  contracts['actionsGatewayContract'] = require('../../packages/0xcert-ethereum-gateway-contracts/build/actions-gateway.json');
  contracts['tokenDeployGatewayContract'] = require('../../packages/0xcert-ethereum-gateway-contracts/build/token-deploy-gateway.json');
  contracts['xcertDeployGatewayContract'] = require('../../packages/0xcert-ethereum-gateway-contracts/build/xcert-deploy-gateway.json');
  
  contracts['tokenTransferProxyContract'] = require('../../packages/0xcert-ethereum-proxy-contracts/build/token-transfer-proxy.json');
  contracts['nfTokenTransferProxyContract'] = require('../../packages/0xcert-ethereum-proxy-contracts/build/nftoken-transfer-proxy.json');
  contracts['nfTokenSafeTransferProxyContract'] = require('../../packages/0xcert-ethereum-proxy-contracts/build/nftoken-safe-transfer-proxy.json');
  contracts['xcertMintProxyContract'] = require('../../packages/0xcert-ethereum-proxy-contracts/build/xcert-create-proxy.json');
  contracts['xcertUpdateProxyContract'] = require('../../packages/0xcert-ethereum-proxy-contracts/build/xcert-update-proxy.json');
  contracts['abilitableManageProxyContract'] = require('../../packages/0xcert-ethereum-proxy-contracts/build/abilitable-manage-proxy.json');
  contracts['xcertBurnProxyContract'] = require('../../packages/0xcert-ethereum-proxy-contracts/build/xcert-burn-proxy.json');
  contracts['xcertDeployProxyContract'] = require('../../packages/0xcert-ethereum-proxy-contracts/build/xcert-deploy-proxy.json');
  contracts['tokenDeployProxyContract'] = require('../../packages/0xcert-ethereum-proxy-contracts/build/token-deploy-proxy.json');
}

const ActionsGatewayAbilities = require('../../packages/0xcert-ethereum-gateway-contracts/dist/core/types').ActionsGatewayAbilities;
const XcertCreateProxyAbilities = require('../../packages/0xcert-ethereum-proxy-contracts/dist/core/types').XcertCreateProxyAbilities;
const TokenTransferProxyAbilities = require('../../packages/0xcert-ethereum-proxy-contracts/dist/core/types').TokenTransferProxyAbilities;
const NFTokenTransferProxyAbilities = require('../../packages/0xcert-ethereum-proxy-contracts/dist/core/types').NFTokenTransferProxyAbilities;
const NFTokenSafeTransferProxyAbilities = require('../../packages/0xcert-ethereum-proxy-contracts/dist/core/types').NFTokenSafeTransferProxyAbilities;
const XcertUpdateProxyAbilities = require('../../packages/0xcert-ethereum-proxy-contracts/dist/core/types').XcertUpdateProxyAbilities;
const AbilitableManageProxyAbilities = require('../../packages/0xcert-ethereum-proxy-contracts/dist/core/types').AbilitableManageProxyAbilities;
const XcertBurnProxyAbilities = require('../../packages/0xcert-ethereum-proxy-contracts/dist/core/types').XcertBurnProxyAbilities;

const Web3 = require('web3');
const web3 = new Web3(WEB3_URL);
const actionsGateway = new web3.eth.Contract(contracts.actionsGatewayContract.ActionsGateway.abi);
const tokenDeployGateway = new web3.eth.Contract(contracts.tokenDeployGatewayContract.TokenDeployGateway.abi);
const xcertDeployGateway = new web3.eth.Contract(contracts.xcertDeployGatewayContract.XcertDeployGateway.abi);
const tokenTransferProxy = new web3.eth.Contract(contracts.tokenTransferProxyContract.TokenTransferProxy.abi);
const nfTokenTransferProxy = new web3.eth.Contract(contracts.nfTokenTransferProxyContract.NFTokenTransferProxy.abi);
const nfTokenSafeTransferProxy = new web3.eth.Contract(contracts.nfTokenSafeTransferProxyContract.NFTokenSafeTransferProxy.abi);
const xcertMintProxy = new web3.eth.Contract(contracts.xcertMintProxyContract.XcertCreateProxy.abi);
const xcertUpdateProxy = new web3.eth.Contract(contracts.xcertUpdateProxyContract.XcertUpdateProxy.abi);
const abilitableManageProxy = new web3.eth.Contract(contracts.abilitableManageProxyContract.AbilitableManageProxy.abi);
const xcertBurnProxy = new web3.eth.Contract(contracts.xcertBurnProxyContract.XcertBurnProxy.abi);
const xcertDeployProxy = new web3.eth.Contract(contracts.xcertDeployProxyContract.XcertDeployProxy.abi);
const tokenDeployProxy = new web3.eth.Contract(contracts.tokenDeployProxyContract.TokenDeployProxy.abi);

deploy().then(() => {
  saveLogs();
  return process.exit(0);
});

async function deploy() {
  process.setMaxListeners(0);
  log('*** Script started ***');
  log('*** Starting deploy ***');

  log('Deploying actionsGateway...');
  const actionsGatewayAddress = await deployActionsGateway();
  if(actionsGatewayAddress == '-1') return;
  actionsGateway.options.address = actionsGatewayAddress;

  log('Deploying tokenTransferProxy...');
  const tokenTransferProxyAddress = await deployTokenTransferProxy();
  if(tokenTransferProxyAddress == '-1') return;
  tokenTransferProxy.options.address = tokenTransferProxyAddress;

  log('Deploying nfTokenTransferProxy...');
  const nfTokenTransferProxyAddress = await deployNfTokenTransferProxy();
  if(nfTokenTransferProxyAddress == '-1') return;
  nfTokenTransferProxy.options.address = nfTokenTransferProxyAddress;
 
  log('Deploying nfTokenSafeTransferProxy...');
  const nfTokenSafeTransferProxyAddress = await deployNfTokenSafeTransferProxy();
  if(nfTokenSafeTransferProxyAddress == '-1') return;
  nfTokenSafeTransferProxy.options.address = nfTokenSafeTransferProxyAddress;

  log('Deploying xcertMintProxy...');
  const xcertMintProxyAddress = await deployXcertMintProxy();
  if(xcertMintProxyAddress == '-1') return;
  xcertMintProxy.options.address = xcertMintProxyAddress;

  log('Deploying xcertUpdateProxy...');
  const xcertUpdateProxyAddress = await deployXcertUpdateProxy();
  if(xcertUpdateProxyAddress == '-1') return;
  xcertUpdateProxy.options.address = xcertUpdateProxyAddress;

  log('Deploying abilitableManageProxy...');
  const abilitableManageProxyAddress = await deployAbilitableManageProxy();
  if(abilitableManageProxyAddress == '-1') return;
  abilitableManageProxy.options.address = abilitableManageProxyAddress;

  log('Deploying xcertBurnProxy...');
  const xcertBurnProxyAddress = await deployXcertBurnProxy();
  if(xcertBurnProxyAddress == '-1') return;
  xcertBurnProxy.options.address = xcertBurnProxyAddress;

  log('Deploying xcertDeployProxy...');
  const xcertDeployProxyAddress = await deployXcertDeployProxy();
  if(xcertDeployProxyAddress == '-1') return;
  xcertDeployProxy.options.address = xcertDeployProxyAddress;

  log('Deploying tokenDeployProxy...');
  const tokenDeployProxyAddress = await deployTokenDeployProxy();
  if(tokenDeployProxyAddress == '-1') return;
  tokenDeployProxy.options.address = tokenDeployProxyAddress;

  log('Deploying TokenDeployGateway...');
  const tokenDeployGatewayAddress = await deployTokenDeployGateway(
    tokenDeployProxyAddress,
    tokenTransferProxyAddress
  );
  if(tokenDeployGatewayAddress == '-1') return;
  tokenDeployGateway.options.address = tokenDeployGatewayAddress;
  
  log('Deploying XcertDeployGateway...');
  const xcertDeployGatewayAddress = await deployXcertDeployGateway(
    xcertDeployProxyAddress,
    tokenTransferProxyAddress,
    xcertMintProxyAddress,
    xcertUpdateProxyAddress,
    abilitableManageProxyAddress,
    nfTokenSafeTransferProxyAddress,
    xcertBurnProxyAddress,
  );
  if(xcertDeployGatewayAddress == '-1') return;
  xcertDeployGateway.options.address = xcertDeployGatewayAddress;

  log('*** Deploy complete ***');
  log('*** Starting order gateway configuration ***');

  log('Granting abilities...')
  let status = await ogGrantAbilities();
  if(status < 1) return;

  // Note that order of adding proxies is important!
  log('Adding xcert mint proxy...')
  status = await ogSetXcertMintProxy(xcertMintProxyAddress);
  if(status < 1) return;

  log('Adding token transfer proxy...')
  status = await ogSetTokenTransferProxy(tokenTransferProxyAddress);
  if(status < 1) return;

  log('Adding nftoken transfer proxy...')
  status = await ogSetNfTokenTransferProxy(nfTokenTransferProxyAddress);
  if(status < 1) return;

  log('Adding nftoken safe transfer proxy...')
  status = await ogSetNfTokenSafeTransferProxy(nfTokenSafeTransferProxyAddress);
  if(status < 1) return;

  log('Adding xcert update proxy...')
  status = await ogSetXcertUpdateProxy(xcertUpdateProxyAddress);
  if(status < 1) return;

  log('Adding abilitable manage proxy...')
  status = await ogSetAbilitableManageProxy(abilitableManageProxyAddress);
  if(status < 1) return;

  log('Adding xcert burn proxy...')
  status = await ogSetXcertBurnProxy(xcertBurnProxyAddress);
  if(status < 1) return;

  log('*** Order gateway configuration complete ***');
  log('*** Starting proxy configuration ***');

  log('TokenTransferProxy: Granting abilities to ActionsGateway...')
  status = await ttpGrantAbilities(actionsGatewayAddress);
  if(status < 1) return;

  log('TokenTransferProxy: Granting abilities to XcertDeployGateway...')
  status = await ttpGrantAbilities(xcertDeployGatewayAddress);
  if(status < 1) return;

  log('TokenTransferProxy: Granting abilities to TokenDeployGateway...')
  status = await ttpGrantAbilities(tokenDeployGatewayAddress);
  if(status < 1) return;

  log('NFTokenTransferProxy: Granting abilities...')
  status = await nfttpGrantAbilities(actionsGatewayAddress);
  if(status < 1) return;

  log('NFTokenSafeTransferProxy: Granting abilities...')
  status = await nftstpGrantAbilities(actionsGatewayAddress);
  if(status < 1) return;

  log('XcertMintProxy: Granting abilities...')
  status = await xmpGrantAbilities(actionsGatewayAddress);
  if(status < 1) return;

  log('XcertUpdateProxy: Granting abilities...')
  status = await xupGrantAbilities(actionsGatewayAddress);
  if(status < 1) return;

  log('AbilitableManageProxy: Granting abilities...')
  status = await ampGrantAbilities(actionsGatewayAddress);
  if(status < 1) return;

  log('XcertBurnProxy: Granting abilities...')
  status = await xdpGrantAbilities(actionsGatewayAddress);
  if(status < 1) return;

  log('*** Proxy configuration complete ***');
  log('*** Script completed ***');
};

async function deployActionsGateway()
{
  let status = '-1';

  await actionsGateway.deploy({
    data: '0x' + contracts.actionsGatewayContract.ActionsGateway.evm.bytecode.object, 
  })
  .send({
      from: GATEWAY_DEPLOYER_ACCOUNT,
      gas: 3000000,
  })
  .on('error', (error) => {
    log('actionsGateway deploy error: ' + error); 
  })
  .on('transactionHash', (transactionHash) => { 
    log('actionsGateway transaction hash: ' + transactionHash);
  })
  .then((newContractInstance) => {
    status = newContractInstance.options.address;
    log('actionsGateway deployed: ' + newContractInstance.options.address);
  });
  
  return status;
}

async function deployTokenTransferProxy()
{
  let status = '-1';
  await tokenTransferProxy.deploy({
    data: '0x' + contracts.tokenTransferProxyContract.TokenTransferProxy.evm.bytecode.object
  })
  .send({
      from: PROXY_DEPLOYER_ACCOUNT,
      gas: 2000000
  })
  .on('error', (error) => { 
    log('tokenTransferProxy deploy error: ' + error); 
  })
  .on('transactionHash', (transactionHash) => { 
    log('tokenTransferProxy transaction hash: ' + transactionHash);
  })
  .then((newContractInstance) => {
    status = newContractInstance.options.address;
    log('tokenTransferProxy deployed: ' + newContractInstance.options.address);
  });
  return status;
}

async function deployNfTokenTransferProxy()
{
  let status = '-1';
  await nfTokenTransferProxy.deploy({
    data: '0x' + contracts.nfTokenTransferProxyContract.NFTokenTransferProxy.evm.bytecode.object
  })
  .send({
      from: PROXY_DEPLOYER_ACCOUNT,
      gas: 2000000
  })
  .on('error', (error) => { 
    log('nfTokenTransferProxy deploy error: ' + error); 
  })
  .on('transactionHash', (transactionHash) => { 
    log('nfTokenTransferProxy transaction hash: ' + transactionHash);
  })
  .then((newContractInstance) => {
    status = newContractInstance.options.address;
    log('nfTokenTransferProxy deployed: ' + newContractInstance.options.address);
  });
  return status;
}

async function deployNfTokenSafeTransferProxy()
{
  let status = '-1';
  await nfTokenSafeTransferProxy.deploy({
    data: '0x' + contracts.nfTokenSafeTransferProxyContract.NFTokenSafeTransferProxy.evm.bytecode.object
  })
  .send({
      from: PROXY_DEPLOYER_ACCOUNT,
      gas: 2000000
  })
  .on('error', (error) => { 
    log('nfTokenSafeTransferProxy deploy error: ' + error); 
  })
  .on('transactionHash', (transactionHash) => { 
    log('nfTokenSafeTransferProxy transaction hash: ' + transactionHash);
  })
  .then((newContractInstance) => {
    status = newContractInstance.options.address;
    log('nfTokenSafeTransferProxy deployed: ' + newContractInstance.options.address);
  });
  return status;
}

async function deployXcertMintProxy()
{
  let status = '-1';
  await xcertMintProxy.deploy({
    data: '0x' + contracts.xcertMintProxyContract.XcertCreateProxy.evm.bytecode.object
  })
  .send({
      from: PROXY_DEPLOYER_ACCOUNT,
      gas: 2000000
  })
  .on('error', (error) => { 
    log('xcertMintProxy deploy error: ' + error); 
  })
  .on('transactionHash', (transactionHash) => { 
    log('xcertMintProxy transaction hash: ' + transactionHash);
  })
  .then((newContractInstance) => {
    status = newContractInstance.options.address;
    log('xcertMintProxy deployed: ' + newContractInstance.options.address);
  });
  return status;
}

async function deployXcertUpdateProxy()
{
  let status = '-1';
  await xcertUpdateProxy.deploy({
    data: '0x' + contracts.xcertUpdateProxyContract.XcertUpdateProxy.evm.bytecode.object
  })
  .send({
      from: PROXY_DEPLOYER_ACCOUNT,
      gas: 2000000
  })
  .on('error', (error) => { 
    log('xcertUpdateProxy deploy error: ' + error); 
  })
  .on('transactionHash', (transactionHash) => { 
    log('xcertUpdateProxy transaction hash: ' + transactionHash);
  })
  .then((newContractInstance) => {
    status = newContractInstance.options.address;
    log('xcertUpdateProxy deployed: ' + newContractInstance.options.address);
  });
  return status;
}

async function deployAbilitableManageProxy()
{
  let status = '-1';
  await abilitableManageProxy.deploy({
    data: '0x' + contracts.abilitableManageProxyContract.AbilitableManageProxy.evm.bytecode.object
  })
  .send({
      from: PROXY_DEPLOYER_ACCOUNT,
      gas: 2000000
  })
  .on('error', (error) => { 
    log('abilitableManageProxy deploy error: ' + error); 
  })
  .on('transactionHash', (transactionHash) => { 
    log('abilitableManageProxy transaction hash: ' + transactionHash);
  })
  .then((newContractInstance) => {
    status = newContractInstance.options.address;
    log('abilitableManageProxy deployed: ' + newContractInstance.options.address);
  });
  return status;
}

async function deployXcertBurnProxy()
{
  let status = '-1';
  await xcertBurnProxy.deploy({
    data: '0x' + contracts.xcertBurnProxyContract.XcertBurnProxy.evm.bytecode.object
  })
  .send({
      from: PROXY_DEPLOYER_ACCOUNT,
      gas: 2000000
  })
  .on('error', (error) => { 
    log('xcertBurnProxy deploy error: ' + error); 
  })
  .on('transactionHash', (transactionHash) => { 
    log('xcertBurnProxy transaction hash: ' + transactionHash);
  })
  .then((newContractInstance) => {
    status = newContractInstance.options.address;
    log('xcertBurnProxy deployed: ' + newContractInstance.options.address);
  });
  return status;
}

async function deployXcertDeployProxy()
{
  let status = '-1';
  await xcertDeployProxy.deploy({
    data: '0x' + contracts.xcertDeployProxyContract.XcertDeployProxy.evm.bytecode.object
  })
  .send({
      from: PROXY_DEPLOYER_ACCOUNT,
      gas: 4400000
  })
  .on('error', (error) => { 
    log('xcertDeployProxy deploy error: ' + error); 
  })
  .on('transactionHash', (transactionHash) => { 
    log('xcertDeployProxy transaction hash: ' + transactionHash);
  })
  .then((newContractInstance) => {
    status = newContractInstance.options.address;
    log('xcertDeployProxy deployed: ' + newContractInstance.options.address);
  });
  return status;
}

async function deployTokenDeployProxy()
{
  let status = '-1';
  await tokenDeployProxy.deploy({
    data: '0x' + contracts.tokenDeployProxyContract.TokenDeployProxy.evm.bytecode.object
  })
  .send({
      from: PROXY_DEPLOYER_ACCOUNT,
      gas: 2500000
  })
  .on('error', (error) => { 
    log('tokenDeployProxy deploy error: ' + error); 
  })
  .on('transactionHash', (transactionHash) => { 
    log('tokenDeployProxy transaction hash: ' + transactionHash);
  })
  .then((newContractInstance) => {
    status = newContractInstance.options.address;
    log('tokenDeployProxy deployed: ' + newContractInstance.options.address);
  });
  return status;
}

async function deployTokenDeployGateway(
  tokenDeployProxyAddress,
  tokenTransferProxyAddress
)
{
  let status = '-1';
  await tokenDeployGateway.deploy({
    data: '0x' + contracts.tokenDeployGatewayContract.TokenDeployGateway.evm.bytecode.object,
    arguments: [tokenDeployProxyAddress, tokenTransferProxyAddress]
  })
  .send({
      from: GATEWAY_DEPLOYER_ACCOUNT,
      gas: 2000000
  })
  .on('error', (error) => { 
    log('tokenDeployGateway deploy error: ' + error); 
  })
  .on('transactionHash', (transactionHash) => { 
    log('tokenDeployGateway transaction hash: ' + transactionHash);
  })
  .then((newContractInstance) => {
    status = newContractInstance.options.address;
    log('tokenDeployGateway deployed: ' + newContractInstance.options.address);
  });
  return status;
}

async function deployXcertDeployGateway(
  xcertDeployProxyAddress,
  tokenTransferProxyAddress,
  xcertMintProxyAddress,
  xcertUpdateProxyAddress,
  abilitableManageProxyAddress,
  nfTokenSafeTransferProxyAddress,
  xcertBurnProxyAddress
)
{
  let status = '-1';
  await xcertDeployGateway.deploy({
    data: '0x' + contracts.xcertDeployGatewayContract.XcertDeployGateway.evm.bytecode.object,
    arguments: [
      xcertDeployProxyAddress,
      tokenTransferProxyAddress,
      xcertMintProxyAddress,
      xcertUpdateProxyAddress,
      abilitableManageProxyAddress,
      nfTokenSafeTransferProxyAddress,
      xcertBurnProxyAddress
    ]
  })
  .send({
      from: GATEWAY_DEPLOYER_ACCOUNT,
      gas: 2500000
  })
  .on('error', (error) => { 
    log('xcertDeployGateway deploy error: ' + error); 
  })
  .on('transactionHash', (transactionHash) => { 
    log('xcertDeployGateway transaction hash: ' + transactionHash);
  })
  .then((newContractInstance) => {
    status = newContractInstance.options.address;
    log('xcertDeployGateway deployed: ' + newContractInstance.options.address);
  });
  return status;
}

async function ogGrantAbilities()
{
  let status = 0;
  await actionsGateway.methods.grantAbilities(GATEWAY_DEPLOYER_ACCOUNT, ActionsGatewayAbilities.SET_PROXIES)
  .send({
      from: GATEWAY_DEPLOYER_ACCOUNT,
      gas: 500000
  })
  .on('error', (error) => { 
    status = -1;
    log('Order gateway grant abilities error: ' + error); 
  })
  .on('transactionHash', (transactionHash) => { 
    log('Order gateway grant abilities transaction hash: ' + transactionHash);
  })
  .then(() => {
    status = 1;
    log('Order gateway grant abilities SUCCESS.');
  });
  return status;
}

async function ogSetXcertMintProxy(address)
{
  let status = 0;
  await actionsGateway.methods.addProxy(address, 0)
  .send({
      from: GATEWAY_DEPLOYER_ACCOUNT,
      gas: 500000
  })
  .on('error', (error) => { 
    status = -1;
    log('Order gateway set xcert mint proxy error: ' + error); 
  })
  .on('transactionHash', (transactionHash) => { 
    log('Order gateway set xcert mint proxy transaction hash: ' + transactionHash);
  })
  .then(() => {
    status = 1;
    log('Order gateway set xcert mint proxy SUCCESS.');
  });
  return status;
}

async function ogSetTokenTransferProxy(address)
{
  let status = 0;
  await actionsGateway.methods.addProxy(address, 1)
  .send({
      from: GATEWAY_DEPLOYER_ACCOUNT,
      gas: 500000
  })
  .on('error', (error) => { 
    status = -1;
    log('Order gateway set token transfer proxy error: ' + error); 
  })
  .on('transactionHash', (transactionHash) => { 
    log('Order gateway set token transfer proxy transaction hash: ' + transactionHash);
  })
  .then(() => {
    status = 1;
    log('Order gateway set token transfer proxy SUCCESS.');
  });
  return status;
}

async function ogSetNfTokenTransferProxy(address)
{
  let status = 0;
  await actionsGateway.methods.addProxy(address, 1)
  .send({
      from: GATEWAY_DEPLOYER_ACCOUNT,
      gas: 500000
  })
  .on('error', (error) => { 
    status = -1;
    log('Order gateway set nftoken transfer proxy error: ' + error); 
  })
  .on('transactionHash', (transactionHash) => { 
    log('Order gateway set nftoken transfer proxy transaction hash: ' + transactionHash);
  })
  .then(() => {
    status = 1;
    log('Order gateway set nftoken transfer proxy SUCCESS.');
  });
  return status;
}

async function ogSetNfTokenSafeTransferProxy(address)
{
  let status = 0;
  await actionsGateway.methods.addProxy(address, 1)
  .send({
      from: GATEWAY_DEPLOYER_ACCOUNT,
      gas: 500000
  })
  .on('error', (error) => { 
    status = -1;
    log('Order gateway set nftoken safe transfer proxy error: ' + error); 
  })
  .on('transactionHash', (transactionHash) => { 
    log('Order gateway set nftoken safe transfer proxy transaction hash: ' + transactionHash);
  })
  .then(() => {
    status = 1;
    log('Order gateway set nftoken safe transfer proxy SUCCESS.');
  });
  return status;
}

async function ogSetXcertUpdateProxy(address)
{
  let status = 0;
  await actionsGateway.methods.addProxy(address, 2)
  .send({
      from: GATEWAY_DEPLOYER_ACCOUNT,
      gas: 500000
  })
  .on('error', (error) => { 
    status = -1;
    log('Order gateway set xcert update proxy error: ' + error); 
  })
  .on('transactionHash', (transactionHash) => { 
    log('Order gateway set xcert update proxy transaction hash: ' + transactionHash);
  })
  .then(() => {
    status = 1;
    log('Order gateway set xcert update proxy SUCCESS.');
  });
  return status;
}

async function ogSetXcertBurnProxy(address)
{
  let status = 0;
  await actionsGateway.methods.addProxy(address, 4)
  .send({
      from: GATEWAY_DEPLOYER_ACCOUNT,
      gas: 500000
  })
  .on('error', (error) => { 
    status = -1;
    log('Order gateway set xcert burn proxy error: ' + error); 
  })
  .on('transactionHash', (transactionHash) => { 
    log('Order gateway set xcert burn proxy transaction hash: ' + transactionHash);
  })
  .then(() => {
    status = 1;
    log('Order gateway set xcert burn proxy SUCCESS.');
  });
  return status;
}

async function ogSetAbilitableManageProxy(address)
{
  let status = 0;
  await actionsGateway.methods.addProxy(address, 3)
  .send({
      from: GATEWAY_DEPLOYER_ACCOUNT,
      gas: 500000
  })
  .on('error', (error) => { 
    status = -1;
    log('Order gateway set abilitableManage error: ' + error); 
  })
  .on('transactionHash', (transactionHash) => { 
    log('Order gateway set abilitableManage transaction hash: ' + transactionHash);
  })
  .then(() => {
    status = 1;
    log('Order gateway set abilitableManage SUCCESS.');
  });
  return status;
}

async function ttpGrantAbilities(actionsGatewayAddress)
{
  let status = 0;
  await tokenTransferProxy.methods.grantAbilities(actionsGatewayAddress, TokenTransferProxyAbilities.EXECUTE)
  .send({
      from: PROXY_DEPLOYER_ACCOUNT,
      gas: 500000
  })
  .on('error', (error) => { 
    status = -1;
    log('TokenTransferProxy grant abilities error: ' + error); 
  })
  .on('transactionHash', (transactionHash) => { 
    log('TokenTransferProxy abilities transaction hash: ' + transactionHash);
  })
  .then(() => {
    status = 1;
    log('TokenTransferProxy abilities SUCCESS.');
  });
  return status;
}

async function nfttpGrantAbilities(actionsGatewayAddress)
{
  let status = 0;
  await nfTokenTransferProxy.methods.grantAbilities(actionsGatewayAddress, NFTokenTransferProxyAbilities.EXECUTE)
  .send({
      from: PROXY_DEPLOYER_ACCOUNT,
      gas: 500000
  })
  .on('error', (error) => { 
    status = -1;
    log('NFTokenTransferProxy grant abilities error: ' + error); 
  })
  .on('transactionHash', (transactionHash) => { 
    log('NFTokenTransferProxy abilities transaction hash: ' + transactionHash);
  })
  .then(() => {
    status = 1;
    log('NFTokenTransferProxy abilities SUCCESS.');
  });
  return status;
}

async function nftstpGrantAbilities(actionsGatewayAddress)
{
  let status = 0;
  await nfTokenSafeTransferProxy.methods.grantAbilities(actionsGatewayAddress, NFTokenSafeTransferProxyAbilities.EXECUTE)
  .send({
      from: PROXY_DEPLOYER_ACCOUNT,
      gas: 500000
  })
  .on('error', (error) => { 
    status = -1;
    log('NFTokenSafeTransferProxy grant abilities error: ' + error); 
  })
  .on('transactionHash', (transactionHash) => { 
    log('NFTokenSafeTransferProxy abilities transaction hash: ' + transactionHash);
  })
  .then(() => {
    status = 1;
    log('NFTokenSafeTransferProxy abilities SUCCESS.');
  });
  return status;
}

async function xmpGrantAbilities(actionsGatewayAddress)
{
  let status = 0;
  await xcertMintProxy.methods.grantAbilities(actionsGatewayAddress, XcertCreateProxyAbilities.EXECUTE)
  .send({
      from: PROXY_DEPLOYER_ACCOUNT,
      gas: 500000
  })
  .on('error', (error) => { 
    status = -1;
    log('XcertMintProxy grant abilities error: ' + error); 
  })
  .on('transactionHash', (transactionHash) => { 
    log('XcertMintProxy abilities transaction hash: ' + transactionHash);
  })
  .then(() => {
    status = 1;
    log('XcertMintProxy abilities SUCCESS.');
  });
  return status;
}

async function xupGrantAbilities(actionsGatewayAddress)
{
  let status = 0;
  await xcertUpdateProxy.methods.grantAbilities(actionsGatewayAddress, XcertUpdateProxyAbilities.EXECUTE)
  .send({
      from: PROXY_DEPLOYER_ACCOUNT,
      gas: 500000
  })
  .on('error', (error) => { 
    status = -1;
    log('XcertUpdateProxy grant abilities error: ' + error); 
  })
  .on('transactionHash', (transactionHash) => { 
    log('XcertUpdateProxy abilities transaction hash: ' + transactionHash);
  })
  .then(() => {
    status = 1;
    log('XcertUpdateProxy abilities SUCCESS.');
  });
  return status;
}

async function xdpGrantAbilities(actionsGatewayAddress)
{
  let status = 0;
  await xcertBurnProxy.methods.grantAbilities(actionsGatewayAddress, XcertBurnProxyAbilities.EXECUTE)
  .send({
      from: PROXY_DEPLOYER_ACCOUNT,
      gas: 500000
  })
  .on('error', (error) => { 
    status = -1;
    log('XcertBurnProxy grant abilities error: ' + error); 
  })
  .on('transactionHash', (transactionHash) => { 
    log('XcertBurnProxy abilities transaction hash: ' + transactionHash);
  })
  .then(() => {
    status = 1;
    log('XcertBurnProxy abilities SUCCESS.');
  });
  return status;
}

async function ampGrantAbilities(actionsGatewayAddress)
{
  let status = 0;
  await abilitableManageProxy.methods.grantAbilities(actionsGatewayAddress, AbilitableManageProxyAbilities.EXECUTE)
  .send({
      from: PROXY_DEPLOYER_ACCOUNT,
      gas: 500000
  })
  .on('error', (error) => { 
    status = -1;
    log('abilitableManageProxy grant abilities error: ' + error); 
  })
  .on('transactionHash', (transactionHash) => { 
    log('abilitableManageProxy abilities transaction hash: ' + transactionHash);
  })
  .then(() => {
    status = 1;
    log('abilitableManageProxy abilities SUCCESS.');
  });
  return status;
}

function log(message) {
  if (typeof message === 'object') {
    message = JSON.stringify(message);
  }
  console.log(message);
  logMessages.push(message);
}

function saveLogs() {
  const data = logMessages.join('\n');
  const path = `../logs/deploy_log_${new Date().getTime()}.log`;
  fs.writeFileSync(path, data);
}
