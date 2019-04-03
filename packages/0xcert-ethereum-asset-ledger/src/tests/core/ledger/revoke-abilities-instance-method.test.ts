import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { OrderGateway } from '@0xcert/ethereum-order-gateway';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { GeneralAssetLedgerAbility, SuperAssetLedgerAbility } from '@0xcert/scaffold';
import { Spec } from '@specron/spec';
import { AssetLedger } from '../../../core/ledger';

const spec = new Spec<{
  provider: GenericProvider;
  ledger: AssetLedger;
  gateway: OrderGateway;
  protocol: Protocol;
  bob: string;
  jane: string;
  owner: string;
}>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const provider = new GenericProvider({
    client: stage.web3,
    accountId: await stage.web3.eth.getCoinbase(),
  });
  stage.set('provider', provider);
});

spec.before(async (stage) => {
  const provider = stage.get('provider');
  const ledgerId = stage.get('protocol').xcert.instance.options.address;
  const orderGatewayId = stage.get('protocol').orderGateway.instance.options.address;
  stage.set('ledger', new AssetLedger(provider, ledgerId));
  stage.set('gateway', new OrderGateway(provider, orderGatewayId));
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();
  stage.set('owner', accounts[0]);
  stage.set('bob', accounts[1]);
  stage.set('jane', accounts[2]);
});

spec.test('revokes ledger abilities for an account', async (ctx) => {
  const ledger = ctx.get('ledger');
  const bob = ctx.get('bob');
  await ledger.grantAbilities(bob, [GeneralAssetLedgerAbility.CREATE_ASSET, GeneralAssetLedgerAbility.UPDATE_URI_BASE]).then(() => ctx.sleep(200));
  await ledger.revokeAbilities(bob, [GeneralAssetLedgerAbility.UPDATE_URI_BASE]).then(() => ctx.sleep(200));
  const abilities = await ledger.getAbilities(bob);
  ctx.deepEqual(abilities, [GeneralAssetLedgerAbility.CREATE_ASSET]);
});

spec.test('revokes ledger abilities for an order gateway', async (ctx) => {
  const ledger = ctx.get('ledger');
  const gateway = ctx.get('gateway');
  const proxyId = ctx.get('protocol').xcertCreateProxy.instance.options.address;
  await ledger.grantAbilities(gateway, [GeneralAssetLedgerAbility.CREATE_ASSET]);
  await ledger.revokeAbilities(gateway, [GeneralAssetLedgerAbility.CREATE_ASSET]).then(() => ctx.sleep(200));
  const abilities = await ledger.getAbilities(proxyId);
  ctx.deepEqual(abilities, []);
});

spec.test('revokes ledger super abilities for an account', async (ctx) => {
  const ledger = ctx.get('ledger');
  const jane = ctx.get('jane');
  await ledger.grantAbilities(jane, [SuperAssetLedgerAbility.MANAGE_ABILITIES]).then(() => ctx.sleep(200));
  await ledger.revokeAbilities(jane, [SuperAssetLedgerAbility.MANAGE_ABILITIES]).then(() => ctx.sleep(200));
  const abilities = await ledger.getAbilities(jane);
  ctx.deepEqual(abilities, []);
});

spec.test('revokes own super ability', async (ctx) => {
  const ledger = ctx.get('ledger');
  const owner = ctx.get('owner');
  await ledger.revokeAbilities(owner, [SuperAssetLedgerAbility.MANAGE_ABILITIES]).then(() => ctx.sleep(200));
  const abilities = await ledger.getAbilities(owner);
  ctx.deepEqual(abilities, [
    GeneralAssetLedgerAbility.CREATE_ASSET,
    GeneralAssetLedgerAbility.REVOKE_ASSET,
    GeneralAssetLedgerAbility.TOGGLE_TRANSFERS,
    GeneralAssetLedgerAbility.UPDATE_ASSET,
    GeneralAssetLedgerAbility.ALLOW_CREATE_ASSET,
    GeneralAssetLedgerAbility.UPDATE_URI_BASE,
  ]);
});

export default spec;
