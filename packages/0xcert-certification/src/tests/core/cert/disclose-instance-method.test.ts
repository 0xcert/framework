import { Spec } from '@hayspec/spec';
import { Cert } from '../../../core/cert';

interface Data {
  schema: any;
}

const spec = new Spec<Data>();

spec.before((ctx) => {
  ctx.set('schema', {
    type: 'object',
    properties: {
      'book': {
        type: 'object',
        properties: {
          'title': {
            type: 'string',
          },
        },
      },
      'books': {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            'title': {
              type: 'string',
            },
          },
        },
      },
      'name': {
        type: 'string',
      },
      'tags': {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
  });
});

spec.test('creates evidence object from selected JSON paths', async (ctx) => {
  // const cert = new Cert({
  //   schema: ctx.get('schema'),
  // });
  // const data = {
  //   book: { title: 'foo' },
  //   books: [
  //     { title: 'bar' },
  //     { title: 'baz' },
  //   ],
  //   name: 'baz',
  //   tags: [1, 2],
  // };
  // // const recipe = await cert.notarize(data);
  // const evidence = await cert.disclose(data, [
  //   ['name']
  // ]);
  // console.log();
  // console.log('-------');
  // console.log(
  //   // JSON.stringify(
  //     // recipe
  //     // evidence
  //   // , null, 2)
  // );
  // console.log('-------');
});

export default spec;
