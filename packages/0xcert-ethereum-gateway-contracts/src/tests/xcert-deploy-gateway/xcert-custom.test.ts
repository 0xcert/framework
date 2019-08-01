import { Spec } from '@specron/spec';

const spec = new Spec();

spec.test('checks correct deploy', async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  const xcertCustom = await ctx.deploy({
    src: './build/xcert-custom.json',
    contract: 'XcertCustom',
    args: [
      'Foo',
      'F',
      'uri prefix',
      'uri postfix',
      '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658',
      ['0x9d118770', '0xbda0e852', '0xbedb86fb', '0x20c5429b'],
      accounts[2],
      accounts[3],
    ],
  });
  const senderSuperAbility = await xcertCustom.instance.methods.isAble(accounts[0], 1).call();
  const ownerSuperAbility = await xcertCustom.instance.methods.isAble(accounts[2], 1).call();
  const proxySignCreateAssetAbility = await xcertCustom.instance.methods.isAble(accounts[3], 32).call();
  ctx.false(senderSuperAbility);
  ctx.true(ownerSuperAbility);
  ctx.true(proxySignCreateAssetAbility);
});

export default spec;
