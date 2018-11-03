import { Spec } from '@hayspec/spec';
import { toDate } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  const d = new Date();
  ctx.is(toDate(d), d);
  ctx.deepEqual(toDate(100000), new Date(100000));
  ctx.deepEqual(toDate('2016-01-02'), new Date('2016-01-02'));
  ctx.is(toDate(), null);
  ctx.is(toDate(undefined), null);
  ctx.is(toDate(null), null);
  ctx.is(toDate('8sadufsdjfk1231'), null);
});

export default spec;
