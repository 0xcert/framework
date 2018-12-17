import { Spec } from '@specron/spec';
import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { AssetLedgerCapability } from "@0xcert/scaffold";
import { ValueLedger } from '../../../core/ledger';

const spec = new Spec<{
  provider: GenericProvider;
  protocol: Protocol;
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

spec.test('deploys new value ledger', async (ctx) => {
  const provider = ctx.get('provider');
  const info = {
    name: 'Foo',
    symbol: 'Bar',
    decimals: '6',
    supply: '100',
  };
  const ledger = await ValueLedger.deploy(provider, info).then((mutation) => {
    return mutation.complete();
  }).then((mutation) => {
    return ValueLedger.getInstance(provider, mutation.receiverId);
  });
  ctx.deepEqual(await ledger.getInfo(), info)
});

export default spec;
