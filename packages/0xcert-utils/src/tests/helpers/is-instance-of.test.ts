import { Spec } from '@hayspec/spec';
import { isInstanceOf } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  class Fake {}
  class Base {}
  class User extends Base {}
  ctx.true(isInstanceOf(new Base(), Base));
  ctx.true(isInstanceOf(new User(), Base));
  ctx.false(isInstanceOf(new Fake(), Base));
  ctx.false(isInstanceOf(new Base(), 'foo'));
  ctx.false(isInstanceOf(null, Base));
  ctx.false(isInstanceOf(undefined, Base));
  ctx.false(isInstanceOf('foo', Base));
  ctx.false(isInstanceOf(false, Base));
});

export default spec;
