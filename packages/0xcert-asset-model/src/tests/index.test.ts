import { Spec } from '@hayspec/spec';
import * as model from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!model.Model);
  ctx.true(!!model.prop);
});

export default spec;
