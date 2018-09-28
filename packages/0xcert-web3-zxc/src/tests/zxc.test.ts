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
  zeroAddress?: string;
  decimalsMul?: any;
  totalSupply?: any;
}

/**
 * Spec stack instances.
 */
const spec = new Spec<Data>();

export default spec;

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('jane', accounts[2]);
  ctx.set('sara', accounts[3]);
  ctx.set('zeroAddress', '0x0000000000000000000000000000000000000000');
});

spec.beforeEach(async (ctx) => {
  const token = await ctx.deploy({ 
    src: './build/zxc.json',
    contract: 'Zxc',
  });
  ctx.set('token', token);
});

spec.beforeEach(async (ctx) => {
  const BN = ctx.web3.utils.BN;
  ctx.set('decimalsMul', new BN('1000000000000000000'));
  ctx.set('totalSupply', new BN('500000000000000000000000000'));
});

spec.test('emits Transfer event on transfer', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100')).toString();

  await token.methods.enableTransfer().send({ from: owner });
  const logs = await token.methods.transfer(bob, tokenAmount).send({ from: owner });
  ctx.not(logs.events.Transfer, undefined);
});

spec.test('throws when trying to transfer before transfer is enabled', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100')).toString();

  await ctx.reverts(() => token.methods.transfer(bob, tokenAmount).send({ from: owner }), '002004');
});

spec.test('throws when trying to transfer more than available balance', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));
  const moreThanBalance = tokenAmount.add(decimalsMul.mul(new ctx.web3.utils.BN('1'))).toString();

  await token.methods.enableTransfer().send({ from: owner });
  await token.methods.transfer(bob, tokenAmount.toString()).send({ from: owner })
  await ctx.reverts(() => token.methods.transfer(sara, moreThanBalance).send({ from: bob }), '001001');
});

spec.test('throws when trying to transfer to zero address', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const zeroAddress = ctx.get('zeroAddress');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100')).toString();

  await token.methods.enableTransfer().send({ from: owner });
  await ctx.reverts(() => token.methods.transfer(zeroAddress, tokenAmount).send({ from: owner }), '002001');
});

spec.test('throws when trying to transfer to contract address', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100')).toString();

  await token.methods.enableTransfer().send({ from: owner });
  await ctx.reverts(() => token.methods.transfer(token._address, tokenAmount).send({ from: owner }), '002002');
});

spec.test('throws when trying to transfer to crowdsale address', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100')).toString();

  await token.methods.enableTransfer().send({ from: owner });
  await token.methods.setCrowdsaleAddress(bob).send({ from: owner });
  await ctx.reverts(() => token.methods.transfer(bob, tokenAmount).send({ from: bob }), '002003');
});

spec.test('returns the correct allowance amount after approval', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100')).toString();

  await token.methods.approve(bob, tokenAmount).send({ from: owner });
  const allowance = await token.methods.allowance(owner, bob).call();
  ctx.is(allowance, tokenAmount);
});

spec.test('emits Approval event after approval', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100')).toString();

  const logs = await token.methods.approve(bob, tokenAmount).send({ from: owner });
  ctx.not(logs.events.Approval, undefined);
});

spec.test('returns correct balances after transfering from another account', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenTotalSupply = ctx.get('totalSupply');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await token.methods.enableTransfer().send({ from: owner });
  await token.methods.approve(bob, tokenAmount.toString()).send({ from: owner });
  await token.methods.transferFrom(owner, sara, tokenAmount.toString()).send({ from: bob });

  const balance0 = await token.methods.balanceOf(owner).call();
  const balance1 = await token.methods.balanceOf(sara).call();
  const balance2 = await token.methods.balanceOf(bob).call();

  ctx.is(balance0, tokenTotalSupply.sub(tokenAmount).toString());
  ctx.is(balance1, tokenAmount.toString());
  ctx.is(balance2, '0');
});

spec.test('emits Transfer event on transferFrom', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100')).toString();

  await token.methods.enableTransfer().send({ from: owner });
  await token.methods.approve(bob, tokenAmount).send({ from: owner });
  const logs = await token.methods.transferFrom(owner, sara, tokenAmount).send({ from: bob });
  ctx.not(logs.events.Transfer, undefined);
});

spec.test('throws when trying to transferFrom more than allowed amount', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));
  const moreThanBalance = tokenAmount.add(decimalsMul.mul(new ctx.web3.utils.BN('1'))).toString();

  await token.methods.enableTransfer().send({ from: owner });
  await token.methods.approve(bob, tokenAmount.toString()).send({ from: owner });
  await ctx.reverts(() => token.methods.transferFrom(owner, sara, moreThanBalance).send({ from: bob }), '001003');
});

spec.test('throws an error when trying to transferFrom more than _from has', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));
  const moreThanBalance = tokenAmount.add(decimalsMul.mul(new ctx.web3.utils.BN('1'))).toString();

  await token.methods.enableTransfer().send({ from: owner });
  await token.methods.transfer(bob, tokenAmount.toString()).send({ from: owner })
  await token.methods.approve(sara, moreThanBalance).send({ from: bob });
  await ctx.reverts(() => token.methods.transferFrom(bob, owner, moreThanBalance).send({ from: sara }), '001001');
});

spec.test('throws when trying to transferFrom before transfers enabled', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100')).toString();

  await token.methods.approve(bob, tokenAmount).send({ from: owner });
  await ctx.reverts(() => token.methods.transferFrom(owner, sara, tokenAmount).send({ from: bob }), '002004');
});

spec.test('throws when trying to transferFrom to 0x0', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const zeroAddress = ctx.get('zeroAddress');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100')).toString();

  await token.methods.enableTransfer().send({ from: owner });
  await token.methods.approve(bob, tokenAmount).send({ from: owner });
  await ctx.reverts(() => token.methods.transferFrom(owner, zeroAddress, tokenAmount).send({ from: bob }), '002001');
});

spec.test('throws when trying to transferFrom to contract address', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100')).toString();

  await token.methods.enableTransfer().send({ from: owner });
  await token.methods.approve(bob, tokenAmount).send({ from: owner });
  await ctx.reverts(() => token.methods.transferFrom(owner, token._address, tokenAmount).send({ from: bob }), '002002');
});

spec.test('allows token burning by the owner', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const decimalsMul = ctx.get('decimalsMul');
  const tokensToBurn = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await token.methods.enableTransfer().send({ from: owner });
  const totalSupplyPrior = await token.methods.totalSupply().call();
  const logs = await token.methods.burn(tokensToBurn.toString()).send({ from: owner })
  const totalSupplyAfter = await token.methods.totalSupply().call();
  const balance = await token.methods.balanceOf(owner).call();

  ctx.is(balance, totalSupplyAfter);
  ctx.is(totalSupplyAfter, new ctx.web3.utils.BN(totalSupplyPrior).sub(tokensToBurn).toString());
  ctx.not(logs.events.Burn, undefined);
});

spec.test('allows only owner to burn tokens', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const decimalsMul = ctx.get('decimalsMul');
  const tokensToBurn = decimalsMul.mul(new ctx.web3.utils.BN('100')).toString();

  await token.methods.enableTransfer().send({ from: owner });
  await ctx.reverts(() => token.methods.burn(tokensToBurn).send({ from: bob }));
});

spec.test('does not allow owner to burn more than available balance', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const tokenTotalSupply = ctx.get('totalSupply');
  const tokensToBurn = tokenTotalSupply.add(new ctx.web3.utils.BN('1')).toString();

  await token.methods.enableTransfer().send({ from: owner });
  await ctx.reverts(() => token.methods.burn(tokensToBurn).send({ from: owner }), '002005');
});

spec.test('should set crowdsale address', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');

  await token.methods.setCrowdsaleAddress(bob).send({ from: owner });
  const crowdsaleAddress = await token.methods.crowdsaleAddress().call();
  ctx.is(crowdsaleAddress, bob);
});

spec.test('should re-set crowdsale address', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');

  await token.methods.setCrowdsaleAddress(bob).send({ from: owner });
  let crowdsaleAddress = await token.methods.crowdsaleAddress().call();
  ctx.is(crowdsaleAddress, bob);

  await token.methods.setCrowdsaleAddress(sara).send({ from: owner });
  crowdsaleAddress = await token.methods.crowdsaleAddress().call();
  ctx.is(crowdsaleAddress, sara);
});

spec.test('should set crowdsale address only if called by owner', async (ctx) => {
  const token = ctx.get('token');
  const bob = ctx.get('bob');

  await ctx.reverts(() => token.methods.setCrowdsaleAddress(bob).send({ from: bob }));
});

spec.test('should allow transfers only for crowdsale address when transfers disabled', async (ctx) => {
  const token = ctx.get('token');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const jane = ctx.get('jane');
  const decimalsMul = ctx.get('decimalsMul');
  const approvedTokens = decimalsMul.mul(new ctx.web3.utils.BN('100')).toString();
  const tokenAmount10 = decimalsMul.mul(new ctx.web3.utils.BN('10')).toString();
  const tokenAmount5 = decimalsMul.mul(new ctx.web3.utils.BN('5')).toString();

  await token.methods.setCrowdsaleAddress(bob).send({ from: owner });
  await token.methods.approve(bob, approvedTokens).send({ from: owner });

  // Transfer 10 tokens from crowdsale to account2
  await token.methods.transferFrom(owner, sara, tokenAmount10).send({ from: bob });
  let accountBalance = await token.methods.balanceOf(sara).call();
  ctx.is(accountBalance, tokenAmount10.toString());

  // Transfer 5 tokens from account2 to account3 - should fail!
  await ctx.reverts(() => token.methods.transfer(jane, tokenAmount5).send({ from: sara }), '002004');
  // Transfer 5 tokens from owner to account3 - should fail!
  await ctx.reverts(() => token.methods.transfer(jane, tokenAmount5).send({ from: owner }), '002004');

  await token.methods.enableTransfer().send({ from: owner });
  // Transfer 5 tokens from account2 to account3 - should succeed!
  await token.methods.transfer(jane, tokenAmount5).send({ from: sara });
  // Transfer 5 tokens from account2 to account3 - should succeed!
  await token.methods.transfer(jane, tokenAmount5).send({ from: owner });
  accountBalance = await token.methods.balanceOf(jane).call();
  ctx.is(accountBalance, tokenAmount10.toString());
});




