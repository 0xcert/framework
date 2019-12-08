import { Spec } from '@hayspec/spec';
import * as Ajv from 'ajv';
import { XcertSchema, xcertSchema } from '../assets/xcert-schema';

const spec = new Spec<{
  validate: any;
}>();

spec.before((stage) => {
  stage.set('validate', new Ajv({ allErrors: true }).compile(xcertSchema));
});

spec.test('allows simple types', (ctx) => {
  const data: XcertSchema = {
    '$schema': 'https://0xcert.org/conventions/json-schema.json',
    '$evidence': 'https://0xcert.org/conventions/json-schema.json',
    'description': '',
    'properties': {
      'string': {
        'description': '',
        'type': 'string',
      },
      'number': {
        'description': '',
        'type': 'number',
      },
      'boolean': {
        'description': '',
        'type': 'boolean',
      },
      'object': {
        'description': '',
        'type': 'object',
        'properties': {
          'string': {
            'description': '',
            'type': 'string',
          },
          'number': {
            'description': '',
            'type': 'number',
          },
          'boolean': {
            'description': '',
            'type': 'boolean',
          },
          'object': {
            'description': '',
            'type': 'object',
            'properties': {
              'string': {
                'description': '',
                'type': 'string',
              },
              'number': {
                'description': '',
                'type': 'number',
              },
              'boolean': {
                'description': '',
                'type': 'boolean',
              },
            },
          },
        },
      },
      'string-array': {
        'description': '',
        'type': 'array',
        'items': {
          'type': 'string',
        },
      },
      'number-array': {
        'description': '',
        'type': 'array',
        'items': {
          'type': 'number',
        },
      },
      'boolean-array': {
        'description': '',
        'type': 'array',
        'items': {
          'type': 'boolean',
        },
      },
      'object-array': {
        'description': '',
        'type': 'array',
        'items': {
          'type': 'object',
          'properties': {},
        },
      },
    },
    'title': '',
    'type': 'object',
  };
  ctx.true(ctx.get('validate')(data));
});

export default spec;
