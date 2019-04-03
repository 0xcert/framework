import { Spec } from '@hayspec/spec';
import * as storage from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!storage.Storage);
});

export default spec;
