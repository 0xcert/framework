import { Spec } from '@hayspec/spec';
import * as client from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!client.Client);
});

export default spec;
