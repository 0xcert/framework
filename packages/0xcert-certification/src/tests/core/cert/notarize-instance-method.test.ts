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

spec.test('creates complete evidence object from JSON object', async (ctx) => {
  // const cert = new Cert({
  //   schema: ctx.get('schema'),
  // });
  // const recipe = await cert.notarize({
  //   book: { title: 'foo' },
  //   books: [
  //     { title: 'bar' },
  //   ],
  //   name: 'baz',
  //   tags: [1, 2],
  // });

  // console.log();
  // console.log('-------');
  // console.log(
  //   // JSON.stringify(
  //     // recipe
  //   // , null, 2)
  // );
  // console.log('-------');
});

export default spec;
