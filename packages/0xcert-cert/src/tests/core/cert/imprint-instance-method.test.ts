import { Spec } from '@hayspec/spec';
import { Cert } from '../../../core/cert';
import { exampleData, exampleSchema } from '../helpers/schema';

const spec = new Spec();

spec.test('calculates imprint for complete data object', async (ctx) => {
  const cert = new Cert({
    schema: exampleSchema,
  });
  const imprint = await cert.imprint(exampleData);
  ctx.is(imprint, 'fe3ea95fa6bda2001c58fd13d5c7655f83b8c8bf225b9dfa7b8c7311b8b68933');
});

export default spec;
