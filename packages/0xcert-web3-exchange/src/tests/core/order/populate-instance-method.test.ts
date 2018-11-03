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

spec.test('populates order data', async (ctx) => {
  const connector = ctx.get('connector');

  const order = new ExchangeOrder(connector);
  order.populate({
    claim: 'foo',
    signature: 'bar',
    recipe: {} as any,
  });

  ctx.is(order.claim, 'foo');
  ctx.is(order.signature, 'bar');
  ctx.true(!!order.recipe);
});

export default spec;
