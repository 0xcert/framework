import { Spec } from '@specron/spec';
import { Context } from '../../../core/context';

interface Data {
  context: Context;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const context = new Context();
  await context.attach(stage);

  stage.set('context', context);
});

spec.test('wipes context data', async (ctx) => {
  const context = ctx.get('context');
  await context.detach();

  ctx.is(context.makerId, null);
  ctx.is(context.minterId, null);
  ctx.is(context.signMethod, null);
  ctx.is(context.web3, null);
});

export default spec;
