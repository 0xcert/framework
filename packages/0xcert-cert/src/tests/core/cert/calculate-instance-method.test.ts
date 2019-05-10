import { Spec } from '@hayspec/spec';
import { Cert } from '../../../core/cert';
import { defaultData, defaultSchema } from '../helpers/schemas';

const spec = new Spec();

spec.test('imprints complete data object', async (ctx) => {
  const cert = new Cert({
    schema: defaultSchema,
  });
  const recipes = await cert.notarize(defaultData);
  const imprint = await cert.calculate(defaultData, recipes);
  ctx.is(imprint, '048c8f3384d5600792a4c8279d2c933fa43c26b81f2cab63462b72dd7488baad');
});

spec.test('validates selected paths', async (ctx) => {
  const cert = new Cert({
    schema: defaultSchema,
  });
  const recipes = await cert.disclose(defaultData, [
    ['name'],
  ]);
  const data = { name: 'B' };
  const imprint = await cert.calculate(data, recipes);
  ctx.is(imprint, '048c8f3384d5600792a4c8279d2c933fa43c26b81f2cab63462b72dd7488baad');
});

spec.test('validates selected nested paths', async (ctx) => {
  const cert = new Cert({
    schema: defaultSchema,
  });
  const recipes = await cert.disclose(defaultData, [
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
    schema: defaultSchema,
  });
  const recipes = await cert.disclose(defaultData, [
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
    schema: defaultSchema,
  });
  const recipes = await cert.disclose(defaultData, [
    ['name'],
  ]);
  const data = {
    name: 'B',
    custom: [{ title: 'B0' }],
  };
  const imprint = await cert.calculate(data, recipes);
  ctx.is(imprint, '048c8f3384d5600792a4c8279d2c933fa43c26b81f2cab63462b72dd7488baad');
});

spec.test('pass on preliminary array and following object empty fields', async (ctx) => {
  // Ref: https://github.com/0xcert/framework/issues/499
  const cert = new Cert({
    schema: defaultSchema,
  });
  const data = {
    email: 'foo',
  };
  const recipes = await cert.notarize(data);
  const imprint = await cert.calculate(data, recipes);
  ctx.is(imprint, 'f5414c1036e8764d0ded2f3b33dd85bc511f080752a1d27eec17d647bdf7b62f');
});

export default spec;
