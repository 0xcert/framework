import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { AssetLedgerCapability } from '@0xcert/scaffold';
import { Spec } from '@specron/spec';
import * as path from 'path';
import { AssetLedger } from '../../../core/ledger';

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
    assetLedgerSource: path.join(__dirname, '..', '..', '..', '..', 'node_modules', '@0xcert', 'ethereum-xcert-contracts', 'build', 'xcert-mock.json'),
  });
  stage.set('provider', provider);
});

spec.test('deploys new asset ledger', async (ctx) => {
  const provider = ctx.get('provider');
  const capabilities = [
    AssetLedgerCapability.TOGGLE_TRANSFERS,
  ];
  const info = {
    name: 'Foo',
    symbol: 'Bar',
    uriPrefix: 'https://example.com',
    uriPostfix: '.json',
    schemaId: '0000000000000000000000000000000000000000000000000000000000000000',
  };
  const ledger = await AssetLedger.deploy(provider, { ...info, capabilities }).then((mutation) => {
    return mutation.complete();
  }).then((mutation) => {
    return AssetLedger.getInstance(provider, mutation.receiverId);
  });
  delete info.schemaId;
  ctx.deepEqual(await ledger.getInfo(), { ...info, supply: '0' });
  ctx.deepEqual(await ledger.getCapabilities(), capabilities);
});

export default spec;
