import { Spec } from '@specron/spec';
import { Context } from '@0xcert/web3-context';
import { MinterOrder } from '../../../core/order';

interface Data {
  context: Context;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const context = new Context();
  await context.attach(stage);

  stage.set('context', context);
});

spec.test('serializes order data', async (ctx) => {
  const context = ctx.get('context');

  const order = new MinterOrder(context);
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
