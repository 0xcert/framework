import { Spec } from '@specron/spec';
import { DappTokenAbilities } from '..';
import * as common from './helpers/common';

interface Data {
  dappToken?: any;
  migrationToken?: any;
  token?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
  zeroAddress?: string;
  ttProxy?: string;
  decimalsMul?: any;
  totalTokenSupply?: any;
}

const spec = new Spec<Data>();

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('jane', accounts[2]);
  ctx.set('sara', accounts[3]);
  ctx.set('ttProxy', accounts[4]);
  ctx.set('zeroAddress', '0x0000000000000000000000000000000000000000');
});

spec.beforeEach(async (ctx) => {
  const token = await ctx.deploy({
    src: './build/token-mock.json',
    contract: 'TokenMock',
    args: ['ERC20', 'ERC', 18, '300000000000000000000000000'],
  });
  ctx.set('token', token);
});

spec.beforeEach(async (ctx) => {
  const token = ctx.get('token');
  const ttProxy = ctx.get('ttProxy');
  const dappToken = await ctx.deploy({
    src: './build/dapp-token-mock.json',
    contract: 'DappTokenMock',
    args: ['Dapp token', 'DXC', 18, token.receipt._address, ttProxy],
  });
  ctx.set('dappToken', dappToken);
});

spec.beforeEach(async (ctx) => {
  const token = ctx.get('token');
  const ttProxy = ctx.get('ttProxy');
  const dappToken = await ctx.deploy({
    src: './build/dapp-token-mock.json',
    contract: 'DappTokenMock',
    args: ['Migration token', 'MXC', 18, token.receipt._address, ttProxy],
  });
  ctx.set('migrationToken', dappToken);
});

spec.beforeEach(async (ctx) => {
  const BN = ctx.web3.utils.BN;
  ctx.set('decimalsMul', new BN('1000000000000000000'));
  ctx.set('totalTokenSupply', new BN('300000000000000000000000000'));
});

spec.test('correctly checks all the supported interfaces', async (ctx) => {
  const dappToken = ctx.get('dappToken');
  const tokenInterface = await dappToken.instance.methods.supportsInterface('0x36372b07').call();
  const tokenNameInterface = await dappToken.instance.methods.supportsInterface('0x06fdde03').call();
  const tokenSymbolInterface = await dappToken.instance.methods.supportsInterface('0x95d89b41').call();
  const tokenDecimalsInterface = await dappToken.instance.methods.supportsInterface('0x313ce567').call();
  const tokenNoneExistingInterface = await dappToken.instance.methods.supportsInterface('0x19be5360').call();
  ctx.is(tokenInterface, true);
  ctx.is(tokenNameInterface, true);
  ctx.is(tokenSymbolInterface, true);
  ctx.is(tokenDecimalsInterface, true);
  ctx.is(tokenNoneExistingInterface, false);
});

spec.test('has correct totalSupply after construction', async (ctx) => {
  const dappToken = ctx.get('dappToken');
  const actualSupply = await dappToken.instance.methods.totalSupply().call();
  ctx.is(actualSupply.toString(), '0');
});

spec.test('has correct token name after construction', async (ctx) => {
  const dappToken = ctx.get('dappToken');
  const actualTokenName = await dappToken.instance.methods.name().call();
  ctx.is(actualTokenName, 'Dapp token');
});

spec.test('has correct token symbol after construction', async (ctx) => {
  const dappToken = ctx.get('dappToken');
  const actualTokenSymbol = await dappToken.instance.methods.symbol().call();
  ctx.is(actualTokenSymbol, 'DXC');
});

spec.test('has correct token decimals after construction', async (ctx) => {
  const dappToken = ctx.get('dappToken');
  const actualTokenDecimals = await dappToken.instance.methods.decimals().call();
  ctx.is(actualTokenDecimals, '18');
});

spec.test('sucessfully deposits token into dapp token', async (ctx) => {
  const token = ctx.get('token');
  const dappToken = ctx.get('dappToken');
  const owner = ctx.get('owner');
  const ttProxy = ctx.get('ttProxy');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));
  const tokenOwnerBalance = ctx.get('totalTokenSupply').sub(tokenAmount);

  await token.instance.methods.approve(dappToken.receipt._address, tokenAmount.toString()).send({ from: owner });
  const logs = await dappToken.instance.methods.deposit(tokenAmount.toString(), owner).send({ from: owner });
  ctx.not(logs.events.Transfer, undefined);

  const tokenDappTokenBalance = await token.instance.methods.balanceOf(dappToken.receipt._address).call();
  const dappTokenOwnerBalance = await dappToken.instance.methods.balanceOf(owner).call();
  const actualTokenOwnerBalance = await token.instance.methods.balanceOf(owner).call();
  const actualSupply = await dappToken.instance.methods.totalSupply().call();
  const proxyAllowance = await dappToken.instance.methods.allowance(owner, ttProxy).call();

  ctx.is(dappTokenOwnerBalance.toString(), tokenAmount.toString());
  ctx.is(tokenDappTokenBalance.toString(), tokenAmount.toString());
  ctx.is(tokenOwnerBalance.toString(), actualTokenOwnerBalance.toString());
  ctx.is(actualSupply.toString(), tokenAmount.toString());
  ctx.is(proxyAllowance.toString(), tokenAmount.toString());
});

spec.test('sucessfully deposits token into dapp token with another receiver', async (ctx) => {
  const token = ctx.get('token');
  const dappToken = ctx.get('dappToken');
  const owner = ctx.get('owner');
  const sara = ctx.get('sara');
  const ttProxy = ctx.get('ttProxy');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));
  const tokenOwnerBalance = ctx.get('totalTokenSupply').sub(tokenAmount);

  await token.instance.methods.approve(dappToken.receipt._address, tokenAmount.toString()).send({ from: owner });
  const logs = await dappToken.instance.methods.deposit(tokenAmount.toString(), sara).send({ from: owner });
  ctx.not(logs.events.Transfer, undefined);

  const tokenDappTokenBalance = await token.instance.methods.balanceOf(dappToken.receipt._address).call();
  const dappTokenOwnerBalance = await dappToken.instance.methods.balanceOf(owner).call();
  const dappTokenSaraBalance = await dappToken.instance.methods.balanceOf(sara).call();
  const actualTokenOwnerBalance = await token.instance.methods.balanceOf(owner).call();
  const actualSupply = await dappToken.instance.methods.totalSupply().call();
  const proxyAllowance = await dappToken.instance.methods.allowance(sara, ttProxy).call();

  ctx.is(dappTokenOwnerBalance.toString(), '0');
  ctx.is(dappTokenSaraBalance.toString(), tokenAmount.toString());
  ctx.is(tokenDappTokenBalance.toString(), tokenAmount.toString());
  ctx.is(tokenOwnerBalance.toString(), actualTokenOwnerBalance.toString());
  ctx.is(actualSupply.toString(), tokenAmount.toString());
  ctx.is(proxyAllowance.toString(), tokenAmount.toString());
});

spec.test('sucessfully withdraws token from dapp token', async (ctx) => {
  const token = ctx.get('token');
  const dappToken = ctx.get('dappToken');
  const owner = ctx.get('owner');
  const ttProxy = ctx.get('ttProxy');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));
  const halfTokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('50'));
  const tokenOwnerBalance = ctx.get('totalTokenSupply').sub(halfTokenAmount);

  await token.instance.methods.approve(dappToken.receipt._address, tokenAmount.toString()).send({ from: owner });
  await dappToken.instance.methods.deposit(tokenAmount.toString(), owner).send({ from: owner });
  const logs = await dappToken.instance.methods.withdraw(halfTokenAmount.toString()).send({ from: owner });
  ctx.not(logs.events.Transfer, undefined);

  const tokenDappTokenBalance = await token.instance.methods.balanceOf(dappToken.receipt._address).call();
  const dappTokenOwnerBalance = await dappToken.instance.methods.balanceOf(owner).call();
  const actualTokenOwnerBalance = await token.instance.methods.balanceOf(owner).call();
  const actualSupply = await dappToken.instance.methods.totalSupply().call();
  const proxyAllowance = await dappToken.instance.methods.allowance(owner, ttProxy).call();

  ctx.is(dappTokenOwnerBalance.toString(), halfTokenAmount.toString());
  ctx.is(tokenDappTokenBalance.toString(), halfTokenAmount.toString());
  ctx.is(tokenOwnerBalance.toString(), actualTokenOwnerBalance.toString());
  ctx.is(actualSupply.toString(), halfTokenAmount.toString());
  ctx.is(proxyAllowance.toString(), tokenAmount.toString());
});

spec.test('sucessfully whitelists an address', async (ctx) => {
  const dappToken = ctx.get('dappToken');
  const owner = ctx.get('owner');
  const ttProxy = ctx.get('ttProxy');

  await dappToken.instance.methods.grantAbilities(owner, DappTokenAbilities.SET_WHITELISTED).send({ from: owner });
  const logs = await dappToken.instance.methods.setWhitelistedRecipient(ttProxy, true).send({ from: owner });
  ctx.not(logs.events.WhitelistedRecipient, undefined);
  const isTTProxyWhitelisted = await dappToken.instance.methods.whitelistedRecipients(ttProxy).call();
  ctx.true(isTTProxyWhitelisted);
});

spec.test('sucessfully transfers to a whitelisted address', async (ctx) => {
  const dappToken = ctx.get('dappToken');
  const owner = ctx.get('owner');
  const ttProxy = ctx.get('ttProxy');
  const token = ctx.get('token');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await dappToken.instance.methods.grantAbilities(owner, DappTokenAbilities.SET_WHITELISTED).send({ from: owner });
  await dappToken.instance.methods.setWhitelistedRecipient(ttProxy, true).send({ from: owner });
  await token.instance.methods.approve(dappToken.receipt._address, tokenAmount.toString()).send({ from: owner });
  await dappToken.instance.methods.deposit(tokenAmount.toString(), owner).send({ from: owner });
  const logs = await dappToken.instance.methods.transfer(ttProxy, tokenAmount.toString()).send({ from: owner });

  const ttProxyBalance = await dappToken.instance.methods.balanceOf(ttProxy).call();
  const ownerBalance = await dappToken.instance.methods.balanceOf(owner).call();

  ctx.not(logs.events.Transfer, undefined);
  ctx.is(ttProxyBalance.toString(), tokenAmount.toString());
  ctx.is(ownerBalance.toString(), '0');
});

spec.test('sucessfully transfersFrom to a whitelisted address', async (ctx) => {
  const dappToken = ctx.get('dappToken');
  const owner = ctx.get('owner');
  const ttProxy = ctx.get('ttProxy');
  const token = ctx.get('token');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await dappToken.instance.methods.grantAbilities(owner, DappTokenAbilities.SET_WHITELISTED).send({ from: owner });
  await dappToken.instance.methods.setWhitelistedRecipient(ttProxy, true).send({ from: owner });
  await token.instance.methods.approve(dappToken.receipt._address, tokenAmount.toString()).send({ from: owner });
  await dappToken.instance.methods.deposit(tokenAmount.toString(), owner).send({ from: owner });
  await dappToken.instance.methods.approve(ttProxy, tokenAmount.toString()).send({ from: owner });
  const logs = await dappToken.instance.methods.transferFrom(owner, ttProxy, tokenAmount.toString()).send({ from: ttProxy });

  const ttProxyBalance = await dappToken.instance.methods.balanceOf(ttProxy).call();
  const ownerBalance = await dappToken.instance.methods.balanceOf(owner).call();

  ctx.not(logs.events.Transfer, undefined);
  ctx.is(ttProxyBalance.toString(), tokenAmount.toString());
  ctx.is(ownerBalance.toString(), '0');
});

spec.test('fails transferring to a non whitelisted address', async (ctx) => {
  const dappToken = ctx.get('dappToken');
  const owner = ctx.get('owner');
  const ttProxy = ctx.get('ttProxy');
  const token = ctx.get('token');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await token.instance.methods.approve(dappToken.receipt._address, tokenAmount.toString()).send({ from: owner });
  await dappToken.instance.methods.deposit(tokenAmount.toString(), owner).send({ from: owner });
  await ctx.reverts(() => dappToken.instance.methods.transfer(ttProxy, tokenAmount.toString()).send({ from: owner }), '010003');
});

spec.test('fails transfersFrom to a non whitelisted address', async (ctx) => {
  const dappToken = ctx.get('dappToken');
  const owner = ctx.get('owner');
  const ttProxy = ctx.get('ttProxy');
  const token = ctx.get('token');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await token.instance.methods.approve(dappToken.receipt._address, tokenAmount.toString()).send({ from: owner });
  await dappToken.instance.methods.deposit(tokenAmount.toString(), owner).send({ from: owner });
  await dappToken.instance.methods.approve(ttProxy, tokenAmount.toString()).send({ from: owner });
  await ctx.reverts(() => dappToken.instance.methods.transferFrom(owner, ttProxy, tokenAmount.toString()).send({ from: ttProxy }), '010003');
});

spec.test('succesfully migrates migrateToken to dappToken', async (ctx) => {
  const token = ctx.get('token');
  const dappToken = ctx.get('dappToken');
  const migrationToken = ctx.get('migrationToken');
  const owner = ctx.get('owner');
  const decimalsMul = ctx.get('decimalsMul');
  const ttProxy = ctx.get('ttProxy');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));
  const tokenOwnerBalance = ctx.get('totalTokenSupply').sub(tokenAmount);

  await token.instance.methods.approve(migrationToken.receipt._address, tokenAmount.toString()).send({ from: owner });
  await migrationToken.instance.methods.deposit(tokenAmount.toString(), owner).send({ from: owner });

  await migrationToken.instance.methods.grantAbilities(owner, DappTokenAbilities.SET_MIGRATE_ADDRESS).send({ from: owner });
  await migrationToken.instance.methods.startMigration(dappToken.receipt._address).send({ from: owner });

  await dappToken.instance.methods.grantAbilities(owner, DappTokenAbilities.SET_MIGRATION_CALLER).send({ from: owner });
  await dappToken.instance.methods.setApprovedMigrator(migrationToken.receipt._address, true).send({ from: owner });

  const logs = await migrationToken.instance.methods.migrate().send({ from: owner });
  ctx.not(logs.events.Transfer, undefined);

  const tokenDappTokenBalance = await token.instance.methods.balanceOf(dappToken.receipt._address).call();
  const dappTokenOwnerBalance = await dappToken.instance.methods.balanceOf(owner).call();
  const migrationTokenOwnerBalance = await migrationToken.instance.methods.balanceOf(owner).call();
  const actualTokenOwnerBalance = await token.instance.methods.balanceOf(owner).call();
  const dappTokenActualSupply = await dappToken.instance.methods.totalSupply().call();
  const migrationTokenActualSupply = await migrationToken.instance.methods.totalSupply().call();
  const proxyAllowance = await dappToken.instance.methods.allowance(owner, ttProxy).call();

  ctx.is(dappTokenOwnerBalance.toString(), tokenAmount.toString());
  ctx.is(tokenDappTokenBalance.toString(), tokenAmount.toString());
  ctx.is(migrationTokenOwnerBalance.toString(), '0');
  ctx.is(migrationTokenActualSupply.toString(), '0');
  ctx.is(tokenOwnerBalance.toString(), actualTokenOwnerBalance.toString());
  ctx.is(dappTokenActualSupply.toString(), tokenAmount.toString());
  ctx.is(proxyAllowance.toString(), tokenAmount.toString());
});

spec.test('fails to migrate if migration address not set', async (ctx) => {
  const token = ctx.get('token');
  const migrationToken = ctx.get('migrationToken');
  const owner = ctx.get('owner');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await token.instance.methods.approve(migrationToken.receipt._address, tokenAmount.toString()).send({ from: owner });
  await migrationToken.instance.methods.deposit(tokenAmount.toString(), owner).send({ from: owner });

  await ctx.reverts(() => migrationToken.instance.methods.migrate().send({ from: owner }), '010004');
});

spec.test('fails to migrate if migration caller is not set', async (ctx) => {
  const token = ctx.get('token');
  const migrationToken = ctx.get('migrationToken');
  const dappToken = ctx.get('dappToken');
  const owner = ctx.get('owner');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await token.instance.methods.approve(migrationToken.receipt._address, tokenAmount.toString()).send({ from: owner });
  await migrationToken.instance.methods.deposit(tokenAmount.toString(), owner).send({ from: owner });
  await migrationToken.instance.methods.grantAbilities(owner, DappTokenAbilities.SET_MIGRATE_ADDRESS).send({ from: owner });
  await migrationToken.instance.methods.startMigration(dappToken.receipt._address).send({ from: owner });

  await ctx.reverts(() => migrationToken.instance.methods.migrate().send({ from: owner }), '010006');
});

spec.test('fails to deposit after migration started', async (ctx) => {
  const token = ctx.get('token');
  const migrationToken = ctx.get('migrationToken');
  const dappToken = ctx.get('dappToken');
  const owner = ctx.get('owner');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await migrationToken.instance.methods.grantAbilities(owner, DappTokenAbilities.SET_MIGRATE_ADDRESS).send({ from: owner });
  await migrationToken.instance.methods.startMigration(dappToken.receipt._address).send({ from: owner });

  await token.instance.methods.approve(migrationToken.receipt._address, tokenAmount.toString()).send({ from: owner });
  await ctx.reverts(() => migrationToken.instance.methods.deposit(tokenAmount.toString(), owner).send({ from: owner }), '010005');
});

spec.test('fails to transfer after migration started', async (ctx) => {
  const token = ctx.get('token');
  const migrationToken = ctx.get('migrationToken');
  const dappToken = ctx.get('dappToken');
  const ttProxy = ctx.get('ttProxy');
  const owner = ctx.get('owner');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await token.instance.methods.approve(migrationToken.receipt._address, tokenAmount.toString()).send({ from: owner });
  await migrationToken.instance.methods.deposit(tokenAmount.toString(), owner).send({ from: owner });
  await migrationToken.instance.methods.grantAbilities(owner, DappTokenAbilities.SET_WHITELISTED).send({ from: owner });
  await migrationToken.instance.methods.setWhitelistedRecipient(ttProxy, true).send({ from: owner });
  await migrationToken.instance.methods.grantAbilities(owner, DappTokenAbilities.SET_MIGRATE_ADDRESS).send({ from: owner });
  await migrationToken.instance.methods.startMigration(dappToken.receipt._address).send({ from: owner });

  await ctx.reverts(() => migrationToken.instance.methods.transfer(ttProxy, tokenAmount.toString()).send({ from: owner }), '010005');
});

spec.test('fails to transferFrom after migration started', async (ctx) => {
  const token = ctx.get('token');
  const migrationToken = ctx.get('migrationToken');
  const dappToken = ctx.get('dappToken');
  const ttProxy = ctx.get('ttProxy');
  const owner = ctx.get('owner');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await token.instance.methods.approve(migrationToken.receipt._address, tokenAmount.toString()).send({ from: owner });
  await migrationToken.instance.methods.deposit(tokenAmount.toString(), owner).send({ from: owner });
  await migrationToken.instance.methods.grantAbilities(owner, DappTokenAbilities.SET_WHITELISTED).send({ from: owner });
  await migrationToken.instance.methods.setWhitelistedRecipient(ttProxy, true).send({ from: owner });
  await migrationToken.instance.methods.grantAbilities(owner, DappTokenAbilities.SET_MIGRATE_ADDRESS).send({ from: owner });
  await migrationToken.instance.methods.startMigration(dappToken.receipt._address).send({ from: owner });
  await migrationToken.instance.methods.approve(ttProxy, tokenAmount.toString()).send({ from: owner });

  await ctx.reverts(() => migrationToken.instance.methods.transferFrom(owner, ttProxy, tokenAmount.toString()).send({ from: ttProxy }), '010005');
});

spec.test('throws when trying to transfer more than available balance', async (ctx) => {
  const token = ctx.get('token');
  const dappToken = ctx.get('dappToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));
  const moreThanBalance = tokenAmount.add(new ctx.web3.utils.BN('1'));

  await dappToken.instance.methods.grantAbilities(owner, DappTokenAbilities.SET_WHITELISTED).send({ from: owner });
  await dappToken.instance.methods.setWhitelistedRecipient(bob, true).send({ from: owner });

  await token.instance.methods.approve(dappToken.receipt._address, tokenAmount.toString()).send({ from: owner });
  await dappToken.instance.methods.deposit(tokenAmount.toString(), owner).send({ from: owner });
  await ctx.reverts(() => dappToken.instance.methods.transfer(bob, moreThanBalance.toString()).send({ from: owner }), '010001');
});

spec.test('returns the correct allowance amount after approval', async (ctx) => {
  const dappToken = ctx.get('dappToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await dappToken.instance.methods.approve(bob, tokenAmount.toString()).send({ from: owner });
  const actualAllowance = await dappToken.instance.methods.allowance(owner, bob).call();
  ctx.is(actualAllowance.toString(), tokenAmount.toString());
});

spec.test('emits Approval event after approval', async (ctx) => {
  const dappToken = ctx.get('dappToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  const logs = await dappToken.instance.methods.approve(bob, tokenAmount.toString()).send({ from: owner });
  ctx.not(logs.events.Approval, undefined);
});

spec.test('successfully resets allowance', async (ctx) => {
  const dappToken = ctx.get('dappToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));
  const newTokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('50'));

  await dappToken.instance.methods.approve(bob, tokenAmount.toString()).send({ from: owner });
  await dappToken.instance.methods.approve(bob, 0).send({ from: owner });
  await dappToken.instance.methods.approve(bob, newTokenAmount.toString()).send({ from: owner });

  const actualAllowance = await dappToken.instance.methods.allowance(owner, bob).call();
  ctx.is(actualAllowance.toString(), newTokenAmount.toString());
});

spec.test('correctly approves with signature', async (ctx) => {
  const dappToken = ctx.get('dappToken');
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));
  const feeAmount = decimalsMul.mul(new ctx.web3.utils.BN('10'));
  const seed = common.getCurrentTime();
  const expiration = common.getCurrentTime() + 3600;

  await token.instance.methods.approve(dappToken.receipt._address, tokenAmount.toString()).send({ from: owner });
  await dappToken.instance.methods.deposit(tokenAmount.toString(), owner).send({ from: owner });

  const claim = await dappToken.instance.methods.generateClaim(owner, sara, tokenAmount.toString(), bob, feeAmount.toString(), seed, expiration).call();
  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);
  const logs = await dappToken.instance.methods.approveWithSignature(owner, sara, tokenAmount.toString(), bob, feeAmount.toString(), seed, expiration, signatureDataTuple).send({ from: bob });
  const actualAllowance = await dappToken.instance.methods.allowance(owner, sara).call();
  const bobBalance = await dappToken.instance.methods.balanceOf(bob).call();
  ctx.not(logs.events.Approval, undefined);
  ctx.not(logs.events.Transfer, undefined);
  ctx.is(actualAllowance.toString(), tokenAmount.toString());
  ctx.is(bobBalance.toString(), feeAmount.toString());
});

spec.test('correctly approves with signature with any performer', async (ctx) => {
  const dappToken = ctx.get('dappToken');
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const zeroAddress = ctx.get('zeroAddress');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));
  const feeAmount = decimalsMul.mul(new ctx.web3.utils.BN('10'));
  const seed = common.getCurrentTime();
  const expiration = common.getCurrentTime() + 3600;

  await token.instance.methods.approve(dappToken.receipt._address, tokenAmount.toString()).send({ from: owner });
  await dappToken.instance.methods.deposit(tokenAmount.toString(), owner).send({ from: owner });

  const claim = await dappToken.instance.methods.generateClaim(owner, sara, tokenAmount.toString(), zeroAddress, feeAmount.toString(), seed, expiration).call();
  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);
  const logs = await dappToken.instance.methods.approveWithSignature(owner, sara, tokenAmount.toString(), zeroAddress, feeAmount.toString(), seed, expiration, signatureDataTuple).send({ from: bob });
  const actualAllowance = await dappToken.instance.methods.allowance(owner, sara).call();
  const bobBalance = await dappToken.instance.methods.balanceOf(bob).call();
  ctx.not(logs.events.Approval, undefined);
  ctx.not(logs.events.Transfer, undefined);
  ctx.is(actualAllowance.toString(), tokenAmount.toString());
  ctx.is(bobBalance.toString(), feeAmount.toString());
});

spec.test('fails approving with signature if signature is invalid', async (ctx) => {
  const dappToken = ctx.get('dappToken');
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));
  const feeAmount = decimalsMul.mul(new ctx.web3.utils.BN('10'));
  const seed = common.getCurrentTime();
  const expiration = common.getCurrentTime() + 3600;

  await token.instance.methods.approve(dappToken.receipt._address, tokenAmount.toString()).send({ from: owner });
  await dappToken.instance.methods.deposit(tokenAmount.toString(), owner).send({ from: owner });

  const claim = await dappToken.instance.methods.generateClaim(owner, sara, tokenAmount.toString(), bob, feeAmount.toString(), seed, expiration).call();
  const signature = await ctx.web3.eth.sign(claim, bob);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);
  await ctx.reverts(() => dappToken.instance.methods.approveWithSignature(owner, sara, tokenAmount.toString(), bob, feeAmount.toString(), seed, expiration, signatureDataTuple).send({ from: bob }), '010007');
});

spec.test('fails approving with signature if claim has expired', async (ctx) => {
  const dappToken = ctx.get('dappToken');
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));
  const feeAmount = decimalsMul.mul(new ctx.web3.utils.BN('10'));
  const seed = common.getCurrentTime();
  const expiration = common.getCurrentTime() - 3600;

  await token.instance.methods.approve(dappToken.receipt._address, tokenAmount.toString()).send({ from: owner });
  await dappToken.instance.methods.deposit(tokenAmount.toString(), owner).send({ from: owner });

  const claim = await dappToken.instance.methods.generateClaim(owner, sara, tokenAmount.toString(), bob, feeAmount.toString(), seed, expiration).call();
  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);
  await ctx.reverts(() => dappToken.instance.methods.approveWithSignature(owner, sara, tokenAmount.toString(), bob, feeAmount.toString(), seed, expiration, signatureDataTuple).send({ from: bob }), '010009');
});

spec.test('fails approving with signature if claim has already been performed', async (ctx) => {
  const dappToken = ctx.get('dappToken');
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));
  const feeAmount = decimalsMul.mul(new ctx.web3.utils.BN('10'));
  const seed = common.getCurrentTime();
  const expiration = common.getCurrentTime() + 3600;

  await token.instance.methods.approve(dappToken.receipt._address, tokenAmount.toString()).send({ from: owner });
  await dappToken.instance.methods.deposit(tokenAmount.toString(), owner).send({ from: owner });

  const claim = await dappToken.instance.methods.generateClaim(owner, sara, tokenAmount.toString(), bob, feeAmount.toString(), seed, expiration).call();
  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);
  await dappToken.instance.methods.approveWithSignature(owner, sara, tokenAmount.toString(), bob, feeAmount.toString(), seed, expiration, signatureDataTuple).send({ from: bob });
  await ctx.reverts(() => dappToken.instance.methods.approveWithSignature(owner, sara, tokenAmount.toString(), bob, feeAmount.toString(), seed, expiration, signatureDataTuple).send({ from: bob }), '010008');
});

spec.test('fails approving with signature if claim has been canceled', async (ctx) => {
  const dappToken = ctx.get('dappToken');
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));
  const feeAmount = decimalsMul.mul(new ctx.web3.utils.BN('10'));
  const seed = common.getCurrentTime();
  const expiration = common.getCurrentTime() + 3600;

  await token.instance.methods.approve(dappToken.receipt._address, tokenAmount.toString()).send({ from: owner });
  await dappToken.instance.methods.deposit(tokenAmount.toString(), owner).send({ from: owner });

  const claim = await dappToken.instance.methods.generateClaim(owner, sara, tokenAmount.toString(), bob, feeAmount.toString(), seed, expiration).call();
  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);
  await dappToken.instance.methods.cancelApproveWithSignature(sara, tokenAmount.toString(), bob, feeAmount.toString(), seed, expiration).send({ from: owner });
  await ctx.reverts(() => dappToken.instance.methods.approveWithSignature(owner, sara, tokenAmount.toString(), bob, feeAmount.toString(), seed, expiration, signatureDataTuple).send({ from: bob }), '010011');
});

spec.test('fails approving with signature if signature kind is invalid', async (ctx) => {
  const dappToken = ctx.get('dappToken');
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));
  const feeAmount = decimalsMul.mul(new ctx.web3.utils.BN('10'));
  const seed = common.getCurrentTime();
  const expiration = common.getCurrentTime() + 3600;

  await token.instance.methods.approve(dappToken.receipt._address, tokenAmount.toString()).send({ from: owner });
  await dappToken.instance.methods.deposit(tokenAmount.toString(), owner).send({ from: owner });

  const claim = await dappToken.instance.methods.generateClaim(owner, sara, tokenAmount.toString(), bob, feeAmount.toString(), seed, expiration).call();
  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 3,
  };
  const signatureDataTuple = ctx.tuple(signatureData);
  await ctx.reverts(() => dappToken.instance.methods.approveWithSignature(owner, sara, tokenAmount.toString(), bob, feeAmount.toString(), seed, expiration, signatureDataTuple).send({ from: bob }));
});

spec.test('throws when trying to transferFrom more than allowed amount', async (ctx) => {
  const token = ctx.get('token');
  const dappToken = ctx.get('dappToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));
  const tokenAmountAllowed = decimalsMul.mul(new ctx.web3.utils.BN('99'));

  await dappToken.instance.methods.grantAbilities(owner, DappTokenAbilities.SET_WHITELISTED).send({ from: owner });
  await dappToken.instance.methods.setWhitelistedRecipient(sara, true).send({ from: owner });
  await token.instance.methods.approve(dappToken.receipt._address, tokenAmount.toString()).send({ from: owner });
  await dappToken.instance.methods.deposit(tokenAmount.toString(), owner).send({ from: owner });

  await dappToken.instance.methods.approve(bob, tokenAmountAllowed.toString()).send({ from: owner });
  await ctx.reverts(() => dappToken.instance.methods.transferFrom(owner, sara, tokenAmount.toString()).send({ from: bob }), '010002');
});

spec.test('throws an error when trying to transferFrom more than _from has', async (ctx) => {
  const token = ctx.get('token');
  const dappToken = ctx.get('dappToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));
  const tokenAmountToSend = decimalsMul.mul(new ctx.web3.utils.BN('101'));

  await dappToken.instance.methods.grantAbilities(owner, DappTokenAbilities.SET_WHITELISTED).send({ from: owner });
  await dappToken.instance.methods.setWhitelistedRecipient(sara, true).send({ from: owner });
  await token.instance.methods.approve(dappToken.receipt._address, tokenAmount.toString()).send({ from: owner });
  await dappToken.instance.methods.deposit(tokenAmount.toString(), owner).send({ from: owner });

  await dappToken.instance.methods.approve(bob, tokenAmount.toString()).send({ from: owner });
  await ctx.reverts(() => dappToken.instance.methods.transferFrom(bob, sara, tokenAmountToSend.toString()).send({ from: sara }), '010001');
});

export default spec;
