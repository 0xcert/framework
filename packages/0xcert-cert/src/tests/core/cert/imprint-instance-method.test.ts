import { Spec } from '@hayspec/spec';
import { Cert } from '../../../core/cert';
import { defaultData, defaultSchema } from '../helpers/schemas';

const spec = new Spec();

spec.test('calculates imprint for complete data object', async (ctx) => {
  const cert = new Cert({
    schema: defaultSchema,
  });
  const imprint = await cert.imprint(defaultData);
  ctx.is(imprint, '048c8f3384d5600792a4c8279d2c933fa43c26b81f2cab63462b72dd7488baad');
});

export default spec;
