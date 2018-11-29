import { Spec } from '@specron/spec';
import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { AssetLedger } from '../../../core/ledger';

interface Data {
  provider: GenericProvider;
  ledger: AssetLedger;
  protocol: Protocol;
  coinbase: string;
  bob: string;
}

const spec = new Spec<Data>();

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

  stage.set('ledger', new AssetLedger(provider, ledgerId));
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();
  stage.set('coinbase', accounts[0]);
  stage.set('bob', accounts[1]);
});

spec.test('transfer asset', async (ctx) => {
  const xcert = ctx.get('protocol').xcert;
  const ledger = ctx.get('ledger');
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');

  await xcert.instance.methods.mint(coinbase, '1', '0x973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9').send({ from: coinbase });
  await ledger.transferAsset(
    { to: bob, id: '1' }
  );
  const asset1Owner = await xcert.instance.methods.ownerOf('1').call();
  ctx.is(asset1Owner, bob);
});

spec.test('transfer asset to a contract', async (ctx) => {
  const xcert = ctx.get('protocol').xcert;
  const ledger = ctx.get('ledger');
  const coinbase = ctx.get('coinbase');
  const nftokenReceiver = ctx.get('protocol').nftokenReceiver.instance.options.address;

  await xcert.instance.methods.mint(coinbase, '2', '0x973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9').send({ from: coinbase });
  await ledger.transferAsset(
    { to: nftokenReceiver, id: '2' }
  );
  const asset1Owner = await xcert.instance.methods.ownerOf('2').call();
  ctx.is(asset1Owner, nftokenReceiver);
});

spec.test('transfer asset to a contract with data', async (ctx) => {
  const xcert = ctx.get('protocol').xcert;
  const ledger = ctx.get('ledger');
  const coinbase = ctx.get('coinbase');
  const nftokenReceiver = ctx.get('protocol').nftokenReceiver.instance.options.address;

  await xcert.instance.methods.mint(coinbase, '3', '0x973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9').send({ from: coinbase });
  await ledger.transferAsset(
    { to: nftokenReceiver, id: '3', data: '0x01' }
  );
  const asset1Owner = await xcert.instance.methods.ownerOf('3').call();
  ctx.is(asset1Owner, nftokenReceiver);
});

export default spec;
