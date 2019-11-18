import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { Spec } from '@specron/spec';
import { Gateway, ProxyKind } from '../../../..';

interface Data {
  protocol: Protocol;
  provider: GenericProvider;
  bob?: string;
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
  const bob = stage.get('bob');
  const provider = new GenericProvider({
    client: stage.web3,
    unsafeRecipientIds: [bob],
  });

  stage.set('provider', provider);
});

spec.test('returns proxy account address', async (ctx) => {
  const protocol = ctx.get('protocol');
  const provider = ctx.get('provider');
  const bob = ctx.get('bob');
  const id = protocol.actionsGateway.instance.options.address;

  const gateway = new Gateway(provider, { actionsOrderId: id, assetLedgerDeployOrderId: '', valueLedgerDeployOrderId: '' });

  const tokenTransferProxy = await gateway.getProxyAccountId(ProxyKind.TRANSFER_TOKEN);
  const nftokenTransferProxy = await gateway.getProxyAccountId(ProxyKind.TRANSFER_ASSET, bob);
  const nftokenSafeTransferProxy = await gateway.getProxyAccountId(ProxyKind.TRANSFER_ASSET);
  const xcertCreateProxy = await gateway.getProxyAccountId(ProxyKind.CREATE_ASSET);

  ctx.is(tokenTransferProxy, protocol.tokenTransferProxy.instance.options.address);
  ctx.is(nftokenTransferProxy, protocol.nftokenTransferProxy.instance.options.address);
  ctx.is(nftokenSafeTransferProxy, protocol.nftokenSafeTransferProxy.instance.options.address);
  ctx.is(xcertCreateProxy, protocol.xcertCreateProxy.instance.options.address);
});

spec.test('returns null when calling getProxyAccountId on a contract that does not support it', async (ctx) => {
  const protocol = ctx.get('protocol');
  const provider = ctx.get('provider');
  const id = protocol.erc20.instance.options.address;

  const gateway = new Gateway(provider, { actionsOrderId: id, assetLedgerDeployOrderId: '', valueLedgerDeployOrderId: '' });

  const tokenTransferProxy = await gateway.getProxyAccountId(ProxyKind.TRANSFER_TOKEN);
  ctx.is(tokenTransferProxy, null);
});

export default spec;
