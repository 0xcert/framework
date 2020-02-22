import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { AssetSetOperatorOrder, OrderKind } from '@0xcert/scaffold';
import { Spec } from '@specron/spec';
import { Gateway } from '../../../../core/gateway';

interface Data {
  protocol: Protocol;
  coinbaseGenericProvider: GenericProvider;
  bobGenericProvider: GenericProvider;
  coinbase: string;
  bob: string;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();
  stage.set('coinbase', accounts[0]);
  stage.set('bob', accounts[1]);
});

spec.before(async (stage) => {
  const coinbase = stage.get('coinbase');
  const bob = stage.get('bob');

  const coinbaseGenericProvider = new GenericProvider({
    client: stage.web3,
    accountId: coinbase,
    requiredConfirmations: 0,
  });
  const bobGenericProvider = new GenericProvider({
    client: stage.web3,
    accountId: bob,
    requiredConfirmations: 0,
  });

  stage.set('coinbaseGenericProvider', coinbaseGenericProvider);
  stage.set('bobGenericProvider', bobGenericProvider);
});

spec.before(async (stage) => {
  const coinbase = stage.get('coinbase');
  const bob = stage.get('bob');

  const erc20 = stage.get('protocol').erc20;
  const xcert = stage.get('protocol').xcert.instance.options.address;

  await erc20.instance.methods.transfer(bob, 100000).send({ form: coinbase });
  await erc20.instance.methods.approve(xcert, 100000).send({ from: bob });
});

spec.test('marks AssetSetOperatorOrder order as canceled on the network which prevents the order from being performed', async (ctx) => {
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const tokenId = ctx.get('protocol').erc20.instance.options.address;
  const bobGenericProvider = ctx.get('bobGenericProvider');
  const coinbaseGenericProvider = ctx.get('coinbaseGenericProvider');
  const xcert = ctx.get('protocol').xcert.instance.options.address;

  const order: AssetSetOperatorOrder = {
    kind: OrderKind.ASSET_SET_OPERATOR_ORDER,
    ledgerId: xcert,
    owner: bob,
    operator: coinbase,
    isOperator: true,
    tokenTransferData: {
      ledgerId: tokenId,
      receiverId: coinbase,
      value: '10000',
    },
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
  };

  const gatewayBob = new Gateway(bobGenericProvider);
  const sign = await gatewayBob.sign(order);
  const mutation = await gatewayBob.cancel(order);
  await mutation.complete();

  const gatewayCoinbase = new Gateway(coinbaseGenericProvider);
  await ctx.throws(() => gatewayCoinbase.perform(order, sign));
});

export default spec;
