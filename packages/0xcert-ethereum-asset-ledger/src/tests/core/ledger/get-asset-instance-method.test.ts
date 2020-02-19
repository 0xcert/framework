import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { Spec } from '@specron/spec';
import { AssetLedger } from '../../../core/ledger';

const spec = new Spec<{
  provider: GenericProvider;
  protocol: Protocol;
  coinbase: string;
}>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const provider = new GenericProvider({
    client: stage.web3,
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
  stage.set('coinbase', accounts[0]);
});

spec.test('returns asset info (xcert contract)', async (ctx) => {
  const xcert = ctx.get('protocol').xcert;
  const coinbase = ctx.get('coinbase');
  const provider = ctx.get('provider');
  const ledgerId = ctx.get('protocol').xcert.instance.options.address;
  const ledger = new AssetLedger(provider, ledgerId);
  await xcert.instance.methods
    .create(coinbase, '1', '0x973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9')
    .send({ from: coinbase });
  ctx.deepEqual(await ledger.getAsset('1'), {
    id: '1',
    uri: 'https://0xcert.org/1.json',
    imprint: '973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9',
    schemaId: '0500000000000000000000000000000000000000000000000000000000000000',
  });
});

spec.test('returns asset info (erc721 contract)', async (ctx) => {
  const erc721 = ctx.get('protocol').erc721;
  const coinbase = ctx.get('coinbase');
  const provider = ctx.get('provider');
  const ledgerId = ctx.get('protocol').erc721.instance.options.address;
  const ledger = new AssetLedger(provider, ledgerId);
  await erc721.instance.methods.create(coinbase, '1').send({ from: coinbase });
  ctx.deepEqual(await ledger.getAsset('1'), {
    id: '1',
    uri: null,
    imprint: null,
    schemaId: null,
  });
});

export default spec;
