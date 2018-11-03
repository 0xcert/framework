import { Spec } from '@hayspec/spec';
import { realize } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  ctx.is(realize('foo'), 'foo');
  ctx.is(realize(100), 100);
  ctx.is(realize(() => 'bar'), 'bar');
  ctx.is(realize(function() { return `${this.foo}bar`; }, { foo: 'foo' }), 'foobar');
  ctx.is(realize(function(a, b) { return `${a}${b}baz`; }, null, ['foo', 'bar']), 'foobarbaz');
});

export default spec;
