import { Spec } from '@hayspec/spec';
import { normalize } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  class User {
    public foo: string = 'Foo';
    public bar: string = 'Bar';
  }
  const user = new User();
  ctx.false(normalize(user) instanceof User);
  ctx.is(normalize(null), null);
  ctx.is(normalize(undefined), null); // nullify
  ctx.is(normalize(false), false);
  ctx.deepEqual(normalize(user), {
    foo: 'Foo',
    bar: 'Bar',
  });
});

export default spec;
