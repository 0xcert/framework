import { Spec } from '@hayspec/spec';
import * as conventions from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!conventions.schema86);
  ctx.true(!!conventions.schema87);
  ctx.true(!!conventions.schema88);
  ctx.true(!!conventions.schemaErc721);
  ctx.true(!!conventions.xcertSchema);
});

export default spec;
