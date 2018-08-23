import { Spec } from '@hayspec/spec';
import * as index from '..';

/**
 * Testing module interface.
 */

const spec = new Spec();

spec.test('isHay() returns true', (ctx) => {
  ctx.true(index.isHay());
});

export default spec;