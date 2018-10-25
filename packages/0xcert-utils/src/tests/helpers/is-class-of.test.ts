import { Spec } from '@hayspec/spec';
import { isClassOf } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  class Fake {}
  class Base {}
  class User extends Base {}
  ctx.true(isClassOf(Base, Base));
  ctx.true(isClassOf(User, Base));
  ctx.false(isClassOf(Fake, Base));
  ctx.false(isClassOf(Base, 'foo'));
  ctx.false(isClassOf(null, Base));
  ctx.false(isClassOf(undefined, Base));
  ctx.false(isClassOf('foo', Base));
  ctx.false(isClassOf(false, Base));
});

export default spec;
