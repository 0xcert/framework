import { Spec } from '@hayspec/spec';
import * as conventions from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!conventions.SCHEMA_86);
  ctx.true(!!conventions.SCHEMA_87);
  ctx.true(!!conventions.SCHEMA_88);
  ctx.true(!!conventions.SCHEMA_ERC721);
});

export default spec;
