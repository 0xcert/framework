import { Spec } from '@specron/spec';
import { tuple } from '../..';

const spec = new Spec();

spec.test('transforms an object to tuple', (ctx) => {
  const res = tuple({
    foo: "FOO",
    bar: ["BAR1", "BAR2"],
    baz: {
      bazfoo: [1, 2],
      bazbar: 'BAZBAR',
    },
    zed: [
      {
        zedfoo: [1, 2],
        zedbar: 'BAZBAR',
      },
    ],
  });
  ctx.deepEqual(res, [
    "FOO",
    ["BAR1", "BAR2"],
    [[1, 2], 'BAZBAR'],
    [[[1, 2], 'BAZBAR']],
  ]);
});

export default spec;
