import { Spec } from '@hayspec/spec';
import { Order } from '../../..';

const spec = new Spec();

spec.test('populates all proiperties', async (ctx) => {
  const order = new Order();
  // order.populate({
  //   claim: 'foo',
  //   signature: 'bar',
  //   recipe: {} as any,
  // });

  // ctx.true(!!order.recipe);
});

export default spec;
