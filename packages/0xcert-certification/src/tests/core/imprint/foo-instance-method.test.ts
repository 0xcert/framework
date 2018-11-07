import { Spec } from '@hayspec/spec';
import { Imprint } from '../../..';

const spec = new Spec();

spec.test('populates all proiperties', async (ctx) => {
  const imprint = new Imprint();
  // order.populate({
  //   claim: 'foo',
  //   signature: 'bar',
  //   recipe: {} as any,
  // });

  // ctx.true(!!order.recipe);
});

export default spec;
