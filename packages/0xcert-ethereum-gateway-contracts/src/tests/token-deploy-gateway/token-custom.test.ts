import { Spec } from '@specron/spec';

const spec = new Spec();

spec.test('checks correct token custom', async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  const tokenCustom = await ctx.deploy({
    src: './build/token-custom.json',
    contract: 'TokenCustom',
    args: [
      'Foo',
      'F',
      '50000000000000000000000',
      '18',
      accounts[3],
    ],
  });
  const ownerBalance = await tokenCustom.instance.methods.balanceOf(accounts[3]).call();
  const contractName = await tokenCustom.instance.methods.name().call();
  ctx.is(ownerBalance, '50000000000000000000000');
  ctx.is(contractName, 'Foo');
});

export default spec;
