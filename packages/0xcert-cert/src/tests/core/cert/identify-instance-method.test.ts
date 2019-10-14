import { Spec } from '@hayspec/spec';
import { Cert } from '../../../core/cert';

const spec = new Spec();

spec.test('calculates schema ID', async (ctx) => {
  const cert0 = new Cert({
    schema: {
      type: 'object',
      required: ['name', '$schema', 'tags', 'age'],
      name: 'foo',
      properties: {
        name: {
          type: 'string',
          description: '',
        },
        tags: {
          type: 'array',
          items: {
            type: 'string',
            title: 'foo',
          },
        },
      },
    },
  });
  const cert1 = new Cert({
    schema: {
      name: 'foo',
      required: ['name', '$schema', 'tags', 'age'],
      properties: {
        name: {
          description: '',
          type: 'string',
        },
        tags: {
          items: {
            title: 'foo',
            type: 'string',
          },
          type: 'array',
        },
      },
      type: 'object',
    },
  });
  ctx.is(await cert0.identify(), '4310b2be8bba387708e80b34d8cb922e03cf0459c8c0d38a74f95d751b242570');
  ctx.is(await cert1.identify(), '4310b2be8bba387708e80b34d8cb922e03cf0459c8c0d38a74f95d751b242570');
});

export default spec;
