import { Spec } from '@specron/spec';

interface Data {
  token?: any;
  burner?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
  decimalsMul?: any;
  totalSupply?: any;
}

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
    src: './build/zxc-mock.json',
    contract: 'Zxc',
  });
  ctx.set('token', token);
});

spec.beforeEach(async (ctx) => {
  const token = ctx.get('token');
  const burner = await ctx.deploy({
    src: './build/zxc-burner.json',
    contract: 'ZxcBurner',
    args: [token.receipt._address],
  });
  ctx.set('burner', burner);
});

spec.beforeEach(async (ctx) => {
  const BN = ctx.web3.utils.BN;
  ctx.set('decimalsMul', new BN('1000000000000000000'));
  ctx.set('totalSupply', new BN('500000000000000000000000000'));
});

spec.beforeEach(async (ctx) => {
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');
  const burner = ctx.get('burner');
  const token = ctx.get('token');
  await token.instance.methods.enableTransfer().send({ from: owner });
  await token.instance.methods.transferOwnership(burner.receipt._address).send({ from: owner });

  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));
  await token.instance.methods.transfer(bob, tokenAmount.toString()).send({ from: owner });
  await token.instance.methods.transfer(jane, tokenAmount.toString()).send({ from: owner });
});

spec.test('correctly burns tokens', async (ctx) => {
  const token = ctx.get('token');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const burner = ctx.get('burner');
  const decimalsMul = ctx.get('decimalsMul');
  const supply = ctx.get('totalSupply');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await burner.instance.methods.claim().send({ from: owner });

  await token.instance.methods.approve(burner.receipt._address, tokenAmount.toString()).send({ from: jane });
  await burner.instance.methods.burn(tokenAmount.toString()).send({ from: jane });

  const janeBalance = await token.instance.methods.balanceOf(jane).call();
  ctx.is(janeBalance, '0');

  const totalSupply = await token.instance.methods.totalSupply().call();
  ctx.is(totalSupply, (supply.sub(tokenAmount)).toString());
});

spec.test('fails burning if ownership not claimed', async (ctx) => {
  const jane = ctx.get('jane');
  const token = ctx.get('token');
  const burner = ctx.get('burner');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await token.instance.methods.approve(burner.receipt._address, tokenAmount.toString()).send({ from: jane });
  await ctx.reverts(() => burner.instance.methods.burn(tokenAmount.toString()).send({ from: jane }));
});

spec.test('fails burning when tokens are not approved', async (ctx) => {
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const burner = ctx.get('burner');
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await burner.instance.methods.claim().send({ from: owner });

  await ctx.reverts(() => burner.instance.methods.burn(tokenAmount.toString()).send({ from: jane }));
});

export default spec;
