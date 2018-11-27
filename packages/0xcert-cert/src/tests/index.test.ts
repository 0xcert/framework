import { Spec } from '@hayspec/spec';
import * as certification from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!certification.Cert);
});

export default spec;
