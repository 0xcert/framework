import { Spec } from '@hayspec/spec';
import * as expoed from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!expoed.TransactionQueue);
});

export default spec;
