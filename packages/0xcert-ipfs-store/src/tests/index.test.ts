import { Spec } from '@hayspec/spec';
import * as store from '..';

const spec = new Spec();

spec.test('exposed content', (ctx) => {
  ctx.true(!!store.Store);
});

export default spec;
