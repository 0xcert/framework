import { Spec } from '@hayspec/spec';
import * as tracker from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!tracker.MutationTracker);
});

export default spec;
