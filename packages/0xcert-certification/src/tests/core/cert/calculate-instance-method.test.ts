import { Spec } from '@hayspec/spec';
import { Cert } from '../../../core/cert';
import { exampleSchema } from '../helpers/schema';

interface Data {
  schema: any;
}

const spec = new Spec<Data>();

spec.before((ctx) => {
  ctx.set('schema', exampleSchema);
});

spec.test('creates evidence object from selected JSON paths', async (ctx) => {
  const cert = new Cert({
    schema: ctx.get('schema'),
  });
  const data = {
    // book: {
    //   title: 'fooA',
    //   date: { month: 'fooB' },
    // },
    // books: [
    //   { title: 'bar0', date: 'bar0' },
    //   { title: 'bar1', date: 'bar1' },
    // ],
    // name: 'name',
    // tags: [1, 2],
  };
  // const recipe = await cert.notarize(data);
  const proofs = await cert.disclose(data, [
    // ['book', 'date', 'month']
    // ['books', 1, 'title']
  ]);
  const imprint = await cert.calculate(proofs);
  ctx.is(imprint, '');
});

export default spec;
