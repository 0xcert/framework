import { Spec } from '@hayspec/spec';
import * as certification from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!certification.Notary);
});

export default spec;
