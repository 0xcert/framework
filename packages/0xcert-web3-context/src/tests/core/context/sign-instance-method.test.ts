import { Spec } from '@specron/spec';
import { Context } from '../../../core/context';
import { SignMethod } from '../../../core/types';

interface Data {
  context: Context;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const context = new Context();
  await context.attach(stage);

  stage.set('context', context);
});

spec.test('signs data and returns signature', async (ctx) => {
  const context = ctx.get('context');

  const signature = await context.sign('foo');

  ctx.true(signature.indexOf(`${SignMethod.ETH_SIGN}:`) === 0);
  ctx.true(signature.length > 10);
});

export default spec;
