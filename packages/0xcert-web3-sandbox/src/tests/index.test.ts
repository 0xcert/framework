import { Spec } from '@hayspec/spec';
import * as sandbox from '..';

const spec = new Spec();

spec.test('exposed content', (t) => {
  t.true(!!sandbox.Sandbox);
  t.true(!!sandbox.Protocol);
});

export default spec;
