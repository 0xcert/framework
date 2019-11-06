import { XcertAbilities } from '@0xcert/ethereum-xcert-contracts/src/core/types';
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
      [accounts[3], accounts[4], accounts[5], accounts[6], accounts[7]],
    ],
  });
  const senderSuperAbility = await xcertCustom.instance.methods.isAble(accounts[0], 1).call();
  const ownerSuperAbility = await xcertCustom.instance.methods.isAble(accounts[2], 1).call();
  const proxyCreateAssetAbility = await xcertCustom.instance.methods.isAble(accounts[3], XcertAbilities.CREATE_ASSET).call();
  const proxyUpdateAssetAbility = await xcertCustom.instance.methods.isAble(accounts[4], XcertAbilities.UPDATE_ASSET_IMPRINT).call();
  const proxyAbilatableManageAbility = await xcertCustom.instance.methods.isAble(accounts[5], XcertAbilities.MANAGE_ABILITIES).call();
  const nftSafeTransferProxyApproved = await xcertCustom.instance.methods.isApprovedForAll(accounts[2], accounts[6]).call();
  const xcertBurnProxyApproved = await xcertCustom.instance.methods.isApprovedForAll(accounts[2], accounts[7]).call();
  ctx.false(senderSuperAbility);
  ctx.true(ownerSuperAbility);
  ctx.true(proxyCreateAssetAbility);
  ctx.true(proxyUpdateAssetAbility);
  ctx.true(proxyAbilatableManageAbility);
  ctx.true(proxyAbilatableManageAbility);
  ctx.true(nftSafeTransferProxyApproved);
  ctx.true(xcertBurnProxyApproved);
});

export default spec;
