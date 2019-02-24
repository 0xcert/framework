import { Spec } from '@hayspec/spec';
import { Cert } from '../../../core/cert';
import { exampleData, exampleSchema } from '../helpers/schema';

const spec = new Spec();

spec.test('imprints complete data object', async (ctx) => {
  const cert = new Cert({
    schema: exampleSchema,
  });
  const recipes = await cert.notarize(exampleData);
  const imprint = await cert.calculate(exampleData, recipes);
  ctx.is(imprint, '048c8f3384d5600792a4c8279d2c933fa43c26b81f2cab63462b72dd7488baad');
});

spec.test('validates selected paths', async (ctx) => {
  const cert = new Cert({
    schema: exampleSchema,
  });
  const recipes = await cert.disclose(exampleData, [
    ['name'],
  ]);
  const data = { name: 'B' };
  const imprint = await cert.calculate(data, recipes);
  ctx.is(imprint, '048c8f3384d5600792a4c8279d2c933fa43c26b81f2cab63462b72dd7488baad');
});

spec.test('validates selected nested paths', async (ctx) => {
  const cert = new Cert({
    schema: exampleSchema,
  });
  const recipes = await cert.disclose(exampleData, [
    ['name'],
    ['books', 1, 'title'],
  ]);
  const data = {
    name: 'B',
    books: [{}, { title: 'B1' }],
  };
  const imprint = await cert.calculate(data, recipes);
  ctx.is(imprint, '048c8f3384d5600792a4c8279d2c933fa43c26b81f2cab63462b72dd7488baad');
});

spec.test('fails when data includes more data then exposed', async (ctx) => {
  const cert = new Cert({
    schema: exampleSchema,
  });
  const recipes = await cert.disclose(exampleData, [
    ['name'],
    ['books', 1, 'title'],
  ]);
  const data = {
    name: 'B',
    books: [{ title: 'B0' }, { title: 'B1' }], // ['books', 0, 'title'], is not exposed
  };
  const imprint = await cert.calculate(data, recipes);
  ctx.is(imprint, null);
});

spec.test('pass on custom properties not defined by schema', async (ctx) => {
  const cert = new Cert({
    schema: exampleSchema,
  });
  const recipes = await cert.disclose(exampleData, [
    ['name'],
  ]);
  const data = {
    name: 'B',
    custom: [{ title: 'B0' }],
  };
  const imprint = await cert.calculate(data, recipes);
  ctx.is(imprint, '048c8f3384d5600792a4c8279d2c933fa43c26b81f2cab63462b72dd7488baad');
});

export default spec;
