import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { OrderGateway } from '../../..';
import { OrderGatewayProxy } from '../../..';
import { OrderActionKind } from '@0xcert/scaffold';

interface Data {
  protocol: Protocol;
  provider: GenericProvider;
  gateway: OrderGateway;
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
  stage.set('sara', accounts[2]);
  stage.set('jane', accounts[3]);
});

spec.before(async (stage) => {
  const provider = new GenericProvider({ 
    client: stage.web3,
  });

  stage.set('provider', provider);
});

spec.before(async (stage) => {
  const protocol = stage.get('protocol')
  const provider = stage.get('provider');
  const id = protocol.orderGateway.instance.options.address;

  stage.set('gateway', new OrderGateway(provider, id));
});

spec.test('returns proxy account address', async (ctx) => {
  const protocol = ctx.get('protocol');
  const gateway = ctx.get('gateway');

  const tokenTransferProxy = await gateway.getProxyAccountId(OrderGatewayProxy.TOKEN_TRANSFER);
  const nftokenTransferProxy = await gateway.getProxyAccountId(OrderGatewayProxy.NFTOKEN_TRANSFER);
  const nftokenSafeTransferProxy = await gateway.getProxyAccountId(OrderGatewayProxy.NFTOKEN_SAFE_TRANSFER);
  const xcertMintProxy = await gateway.getProxyAccountId(OrderGatewayProxy.XCERT_MINT);

  ctx.is(tokenTransferProxy, protocol.tokenTransferProxy.instance.options.address);
  ctx.is(nftokenTransferProxy, protocol.nftokenTransferProxy.instance.options.address);
  ctx.is(nftokenSafeTransferProxy, protocol.nftokenSafeTransferProxy.instance.options.address);
  ctx.is(xcertMintProxy, protocol.xcertMintProxy.instance.options.address);
});

export default spec;
