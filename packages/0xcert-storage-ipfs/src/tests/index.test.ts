import { Spec } from '@hayspec/spec';
import * as storage from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!storage.StorageIPFS);
});

export default spec;
