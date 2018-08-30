import { Spec } from '@hayspec/spec';
import { sha256 } from '../..';

const spec = new Spec();

spec.test('converts string into SHA256 hash', async (ctx) => {
  ctx.is(await sha256('foo#'), '1be8b7d6d1cee093012d345c4ad7fe97fd96c6264b8645ff1479aadae73b2cc8');
  ctx.is(await sha256('bar!'), 'aba486bc2a09c13af75ec06cd314746ead68be5cd4577e4242e627e82c77531c');
});

export default spec;