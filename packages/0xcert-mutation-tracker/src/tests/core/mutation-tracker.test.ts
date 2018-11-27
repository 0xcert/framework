import { Spec } from '@hayspec/spec';
import { FakeGenericProvider } from '../helpers/provider';
import { MutationTracker, MutationEvent } from '../..';

interface Data {
  provider: FakeGenericProvider;
  tracker: MutationTracker;
}

const spec = new Spec<Data>();

spec.beforeEach((ctx) => {
  ctx.set('provider', new FakeGenericProvider());
});

spec.beforeEach((ctx) => {
  ctx.set('tracker', new MutationTracker(
    ctx.get('provider')
  ))
});

spec.test('adds and removes mutation ids', async (ctx) => {
  const tracker = ctx.get('tracker');
  tracker.add('100', '200', '300');
  ctx.deepEqual(Object.keys(tracker.transactions), ['100', '200', '300']);
  tracker.remove('200');
  ctx.deepEqual(Object.keys(tracker.transactions), ['100', '300']);
  tracker.clear();
  ctx.deepEqual(Object.keys(tracker.transactions), []);
});

spec.test('starts and stops the heartbit', async (ctx) => {
  const tracker = ctx.get('tracker');
  let counter = 0;
  tracker.on(MutationEvent.TICK, () => counter++);
  tracker.start();
  await ctx.sleep(6000);
  ctx.is(counter, 2);
  tracker.stop();
  await ctx.sleep(6000);
  ctx.is(counter, 2);
});

spec.test('handles mutation confirmations', async (ctx) => {
  const provider = ctx.get('provider');
  const tracker = ctx.get('tracker');
  const stats = { confirm: 0, complete: 0 };
  tracker.add('100', '101', '102');
  tracker.on(MutationEvent.CONFIRM, () => stats.confirm++);
  tracker.on(MutationEvent.COMPLETE, () => stats.complete++);
  for (let i = 0; i < 10; i++) {
    await tracker.tick();
    provider.confirmations = i; // simulate confirmations
  }
  ctx.is(stats.confirm, 12);
  ctx.is(stats.complete, 3);
});

export default spec;
