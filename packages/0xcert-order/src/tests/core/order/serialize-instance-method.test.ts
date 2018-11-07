import { Spec } from '@hayspec/spec';
import { Order } from '../../..';

const spec = new Spec();

spec.test('serializes order data', async (ctx) => {
  // const context = ctx.get('context');

  // const order = new Order(context);
  // order.claim = 'foo';
  // order.signature = 'bar';
  // order.recipe = { baz: 'baz' } as any;

  // const data = order.serialize();
  // ctx.deepEqual(data, {
  //   claim: 'foo',
  //   signature: 'bar',
  //   recipe: { baz: 'baz' },
  // });
});

export default spec;
