import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { Spec } from '@specron/spec';
import { AssetLedger } from '../../../core/ledger';

const spec = new Spec<{
  provider: GenericProvider;
  ledger: AssetLedger;
  protocol: Protocol;
  coinbase: string;
  bob: string;
  jane: string;
}>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const provider = new GenericProvider({
    client: stage.web3,
    accountId: await stage.web3.eth.getCoinbase(),
    unsafeRecipientIds: [stage.get('protocol').tokenTransferProxy.instance.options.address],
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
  stage.set('coinbase', accounts[0]);
  stage.set('bob', accounts[1]);
  stage.set('jane', accounts[2]);
});

spec.test('transfer asset', async (ctx) => {
  const xcert = ctx.get('protocol').xcert;
  const ledger = ctx.get('ledger');
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  await xcert.instance.methods.create(coinbase, '1', '0x973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9').send({ from: coinbase });
  const mutation = await ledger.transferAsset({
    receiverId: bob,
    id: '1',
  });
  await mutation.complete();
  ctx.is((mutation.logs[0]).event, 'Transfer');
  ctx.is(await xcert.instance.methods.ownerOf('1').call(), bob);
});

spec.test('transfer asset to a contract', async (ctx) => {
  const xcert = ctx.get('protocol').xcert;
  const ledger = ctx.get('ledger');
  const coinbase = ctx.get('coinbase');
  const nftokenReceiver = ctx.get('protocol').nftokenReceiver.instance.options.address;
  await xcert.instance.methods.create(coinbase, '2', '0x973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9').send({ from: coinbase });
  await ledger.transferAsset({
    receiverId: nftokenReceiver,
    id: '2',
  });
  ctx.is(await xcert.instance.methods.ownerOf('2').call(), nftokenReceiver);
});

spec.test('transfer asset to a contract with data', async (ctx) => {
  const xcert = ctx.get('protocol').xcert;
  const ledger = ctx.get('ledger');
  const coinbase = ctx.get('coinbase');
  const nftokenReceiver = ctx.get('protocol').nftokenReceiver.instance.options.address;
  await xcert.instance.methods.create(coinbase, '3', '0x973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9').send({ from: coinbase });
  await ledger.transferAsset({
    receiverId: nftokenReceiver, id: '3', data: '0x01',
  });
  ctx.is(await xcert.instance.methods.ownerOf('3').call(), nftokenReceiver);
});

spec.test('fails when trying to transfer asset to a contract that does not implement receiver', async (ctx) => {
  const xcert = ctx.get('protocol').xcert;
  const ledger = ctx.get('ledger');
  const coinbase = ctx.get('coinbase');
  const erc20 = ctx.get('protocol').erc20.instance.options.address;
  await xcert.instance.methods.create(coinbase, '4', '0x973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9').send({ from: coinbase });
  await ledger.transferAsset({
    receiverId: erc20,
    id: '4',
  }).then(() => {
    ctx.fail();
  }).catch(() => {
    ctx.pass();
  });
});

spec.test('transfer to asset contract that does not implement receiver but is marked as unsafe', async (ctx) => {
  const xcert = ctx.get('protocol').xcert;
  const ledger = ctx.get('ledger');
  const coinbase = ctx.get('coinbase');
  const tokenTransferProxy = ctx.get('protocol').tokenTransferProxy.instance.options.address;
  await xcert.instance.methods.create(coinbase, '5', '0x973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9').send({ from: coinbase });
  await ledger.transferAsset({
    receiverId: tokenTransferProxy,
    id: '5',
  });
  ctx.is(await xcert.instance.methods.ownerOf('5').call(), tokenTransferProxy);
});

spec.test('transfer approved asset', async (ctx) => {
  const xcert = ctx.get('protocol').xcert;
  const ledger = ctx.get('ledger');
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');
  await xcert.instance.methods.create(bob, '6', '0x973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9').send({ from: coinbase });
  await xcert.instance.methods.approve(coinbase, '6').send({ from: bob });
  await ledger.transferAsset({
    senderId: bob,
    receiverId: jane,
    id: '6',
  });
  ctx.is(await xcert.instance.methods.ownerOf('6').call(), jane);
});

spec.test('transfer to approved asset contract that does not implement receiver but is marked as unsafe', async (ctx) => {
  const xcert = ctx.get('protocol').xcert;
  const ledger = ctx.get('ledger');
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const tokenTransferProxy = ctx.get('protocol').tokenTransferProxy.instance.options.address;
  await xcert.instance.methods.create(bob, '7', '0x973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9').send({ from: coinbase });
  await xcert.instance.methods.approve(coinbase, '7').send({ from: bob });
  await ledger.transferAsset({
    senderId: bob,
    receiverId: tokenTransferProxy,
    id: '7',
  });
  ctx.is(await xcert.instance.methods.ownerOf('7').call(), tokenTransferProxy);
});

export default spec;
