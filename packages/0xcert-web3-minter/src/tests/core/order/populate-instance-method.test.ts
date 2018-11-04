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

spec.test('populates order data', async (ctx) => {
  const context = ctx.get('context');

  const order = new MinterOrder(context);
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
