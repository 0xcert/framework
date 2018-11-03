import { Spec } from '@specron/spec';
import { Connector } from '@0xcert/web3-connector';
import { MinterOrder } from '../../../core/order';

interface Data {
  connector: Connector;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const connector = new Connector();
  await connector.attach(stage);

  stage.set('connector', connector);
});

spec.test('signes order claim and sets the signature', async (ctx) => {
  const connector = ctx.get('connector');

  const order = new MinterOrder(connector);
  order.claim = 'foo';
  await order.sign();

  ctx.is(order.signature.indexOf('0:'), 0);
});

export default spec;
