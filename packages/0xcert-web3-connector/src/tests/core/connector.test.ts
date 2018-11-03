import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/web3-sandbox';
import { Connector } from '../../core/connector';
import { SignMethod } from '../../core/types';

interface Data {
  protocol: Protocol;
  coinbase: string;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);

  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();

  stage.set('coinbase', accounts[0]);
});

spec.test('method `attach` initializes connector', async (ctx) => {
  const connector = new Connector();
  await connector.attach(ctx);

  ctx.true(!!connector.minterId);
  ctx.true(!!connector.web3);
  ctx.is(connector.makerId, ctx.get('coinbase'));
  ctx.is(connector.signMethod, SignMethod.ETH_SIGN);
});

spec.test('method `detach` wipes connector', async (ctx) => {
  const connector = new Connector();
  await connector.attach(ctx);
  await connector.detach();

  ctx.is(connector.makerId, null);
  ctx.is(connector.minterId, null);
  ctx.is(connector.signMethod, null);
  ctx.is(connector.web3, null);
});

spec.test('method `sign` signs data and returns signature', async (ctx) => {
  const connector = new Connector();
  await connector.attach(ctx);

  const signature = await connector.sign('foo');

  ctx.true(signature.indexOf(`${SignMethod.ETH_SIGN}:`) === 0);
  ctx.true(signature.length > 10);
});

export default spec;
