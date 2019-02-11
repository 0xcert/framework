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
  ctx.is(imprint, 'fe3ea95fa6bda2001c58fd13d5c7655f83b8c8bf225b9dfa7b8c7311b8b68933');
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
  ctx.is(imprint, 'fe3ea95fa6bda2001c58fd13d5c7655f83b8c8bf225b9dfa7b8c7311b8b68933');
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
  ctx.is(imprint, 'fe3ea95fa6bda2001c58fd13d5c7655f83b8c8bf225b9dfa7b8c7311b8b68933');
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

export default spec;
