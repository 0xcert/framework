import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { Spec } from '@specron/spec';
import { AssetLedger } from '../../../core/ledger';

const spec = new Spec<{
  provider: GenericProvider;
  ledger: AssetLedger;
  protocol: Protocol;
  bob: string;
}>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const provider = new GenericProvider({
    client: stage.web3,
    accountId: await stage.web3.eth.getCoinbase(),
    requiredConfirmations: 0,
  });
  stage.set('provider', provider);
});

spec.before(async (stage) => {
  const provider = stage.get('provider');
  const ledgerId = stage.get('protocol').xcert.instance.options.address;
  stage.set('ledger', new AssetLedger(provider, ledgerId));
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();
  stage.set('bob', accounts[1]);
});

spec.test('create a new asset', async (ctx) => {
  const xcert = ctx.get('protocol').xcert;
  const ledger = ctx.get('ledger');
  const bob = ctx.get('bob');
  const mutation = await ledger.createAsset({
    receiverId: bob,
    id: '1',
    imprint: '973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9',
  });
  await mutation.complete();
  ctx.is((mutation.logs[0]).event, 'Transfer');
  ctx.is(await xcert.instance.methods.ownerOf('1').call(), bob);
});

export default spec;
