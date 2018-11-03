import { Spec } from '@specron/spec';
import { Connector } from '@0xcert/web3-connector';
import { ExchangeOrder } from '../../../core/order';

interface Data {
  connector: Connector;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const connector = new Connector();
  await connector.attach(stage);

  stage.set('connector', connector);
});

spec.test('serializes order data', async (ctx) => {
  const connector = ctx.get('connector');

  const order = new ExchangeOrder(connector);
  order.claim = 'foo';
  order.signature = 'bar';
  order.recipe = { baz: 'baz' } as any;

  const data = order.serialize();
  ctx.deepEqual(data, {
    claim: 'foo',
    signature: 'bar',
    recipe: { baz: 'baz' },
  });
});

export default spec;
