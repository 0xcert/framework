import { Spec } from '@hayspec/spec';
import * as scaffold from '..';

const spec = new Spec();

spec.test('compile all files', (ctx) => {
  ctx.is(
    typeof scaffold,
    typeof scaffold,
  );
});

export default spec;
