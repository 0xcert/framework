import { Spec } from '@hayspec/spec';
import * as middleware from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!middleware.StorageMiddleware);
});

export default spec;
