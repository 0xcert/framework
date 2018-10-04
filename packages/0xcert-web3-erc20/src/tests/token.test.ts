import { Spec } from '@specron/spec';
/**
 * Spec context interfaces.
 */

interface Data {
  token?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
  decimalsMul?: any;
  totalSupply?: any;
}

/**
 * Spec stack instances.
 */

const spec = new Spec<Data>();

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('jane', accounts[2]);
  ctx.set('sara', accounts[3]);
});

spec.beforeEach(async (ctx) => {
  const token = await ctx.deploy({ 
    src: './build/token-mock.json',
    contract: 'TokenMock',
  });
  ctx.set('token', token);
});

spec.beforeEach(async (ctx) => {
  const BN = ctx.web3.utils.BN;
  ctx.set('decimalsMul', new BN('1000000000000000000'));
  ctx.set('totalSupply', new BN('300000000000000000000000000'));
});

spec.test('has correct totalSupply after construction', async (ctx) => {
  const token = ctx.get('token');
  const actualSupply = await token.instance.methods.totalSupply().call();
  const tokenTotalSupply = ctx.get('totalSupply');
  ctx.is(actualSupply.toString(), tokenTotalSupply.toString());
});

spec.test('has correct token name after construction', async (ctx) => {
  const token = ctx.get('token');
  const actualTokenName = await token.instance.methods.name().call();
  const tokenName = 'Mock Token';
  ctx.is(tokenName, actualTokenName);
});

spec.test('has correct token symbol after construction', async (ctx) => {
  const token = ctx.get('token');
  const actualTokenSymbol = await token.instance.methods.symbol().call();
  const tokenSymbol = 'MCK';
  ctx.is(tokenSymbol, actualTokenSymbol);
});

spec.test('has correct token decimals after construction', async (ctx) => {
  const token = ctx.get('token');
  const actualTokenDecimals = await token.instance.methods.decimals().call();
  const tokenDecimals = '18';
  ctx.is(tokenDecimals, actualTokenDecimals);
});

spec.test('has correct owner token balance after construction', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const actualOwnerBalance = await token.instance.methods.balanceOf(owner).call();
  const ownerBalance = ctx.get('totalSupply');
  ctx.is(actualOwnerBalance.toString(), ownerBalance.toString());
});

spec.test('recipient and sender have correct balances after transfer', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));
  const ownerBalance = ctx.get('totalSupply');
  await token.instance.methods.transfer(bob, tokenAmount.toString()).send({ from: owner });
  const actualOwnerBalance = await token.instance.methods.balanceOf(owner).call();
  const actualBobBalance = await token.instance.methods.balanceOf(bob).call();
  ctx.is(actualOwnerBalance.toString(), ownerBalance.sub(tokenAmount).toString());
  ctx.is(actualBobBalance.toString(), tokenAmount.toString());
});

spec.test('emits Transfer event on transfer', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  const logs = await token.instance.methods.transfer(bob, tokenAmount.toString()).send({ from: owner });
  ctx.not(logs.events.Transfer, undefined);
});

spec.test('throws when trying to transfer more than available balance', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const tokenTotalSupply = ctx.get('totalSupply');
  const moreThanBalance = tokenTotalSupply.add(new ctx.web3.utils.BN('1'));
  await ctx.reverts(() => token.instance.methods.transfer(bob, moreThanBalance.toString()).send({ from: owner }), '001001');
});

spec.test('returns the correct allowance amount after approval', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await token.instance.methods.approve(bob, tokenAmount.toString()).send({ from: owner });
  const actualAllowance = await token.instance.methods.allowance(owner, bob).call();
  ctx.is(actualAllowance.toString(), tokenAmount.toString());
});

spec.test('emits Approval event after approval', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  const logs = await token.instance.methods.approve(bob, tokenAmount.toString()).send({ from: owner });
  ctx.not(logs.events.Approval, undefined);
});

spec.test('reverts if owner wants to reset allowance before setting it to 0 first', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));
  const newTokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('50'));

  await token.instance.methods.approve(bob, tokenAmount.toString()).send({ from: owner });
  await ctx.reverts(() => token.instance.methods.approve(bob, newTokenAmount.toString()).send({ from: owner }), '001002');
});

spec.test('successfully resets allowance', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));
  const newTokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('50'));

  await token.instance.methods.approve(bob, tokenAmount.toString()).send({ from: owner });
  await token.instance.methods.approve(bob, 0).send({ from: owner });
  await token.instance.methods.approve(bob, newTokenAmount.toString()).send({ from: owner });

  const actualAllowance = await token.instance.methods.allowance(owner, bob).call();
  ctx.is(actualAllowance.toString(), newTokenAmount.toString());
});

spec.test('returns correct balances after transfering from another account', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const decimalsMul = ctx.get('decimalsMul');
  const ownerSupply = ctx.get('totalSupply');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await token.instance.methods.approve(bob, tokenAmount.toString()).send({ from: owner });
  await token.instance.methods.transferFrom(owner, sara, tokenAmount.toString()).send({ from: bob });

  const balanceOwner = await token.instance.methods.balanceOf(owner).call();
  const balanceSara = await token.instance.methods.balanceOf(sara).call();
  const balanceBob = await token.instance.methods.balanceOf(bob).call();
  ctx.is(balanceOwner.toString(), ownerSupply.sub(tokenAmount).toString());
  ctx.is(balanceSara.toString(), tokenAmount.toString());
  ctx.is(balanceBob.toString(), '0');
});

spec.test('emits Transfer event on transferFrom', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await token.instance.methods.approve(bob, tokenAmount.toString()).send({ from: owner });
  const logs = await token.instance.methods.transferFrom(owner, sara, tokenAmount.toString()).send({ from: bob });

  ctx.not(logs.events.Transfer, undefined);
});

spec.test('throws when trying to transferFrom more than allowed amount', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));
  const tokenAmountAllowed = decimalsMul.mul(new ctx.web3.utils.BN('99'));

  await token.instance.methods.approve(bob, tokenAmountAllowed.toString()).send({ from: owner });
  await ctx.reverts(() => token.instance.methods.transferFrom(owner, sara, tokenAmount.toString()).send({ from: bob }), '001003');
});

spec.test('throws an error when trying to transferFrom more than _from has', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));
  const tokenAmountToSend = decimalsMul.mul(new ctx.web3.utils.BN('101'));

  await token.instance.methods.transfer(bob, tokenAmount.toString()).send({ from: owner });
  await token.instance.methods.approve(sara, tokenAmount.toString()).send({ from: bob});
  await ctx.reverts(() => token.instance.methods.transferFrom(bob, sara, tokenAmountToSend.toString()).send({ from: sara }), '001001');
});

export default spec;
