import { Spec } from '@hayspec/spec';
import { Validator } from 'jsonschema';
import { XcertSchema, xcertSchema } from '../assets/xcert-schema';

const spec = new Spec<{
  validator: Validator;
}>();

spec.before((stage) => {
  stage.set('validator', new Validator());
});

spec.test('allows simple types', (ctx) => {
  const data: XcertSchema = {
    '$schema': 'https://conventions.0xcert.org/xcert-schema.json',
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
  ctx.true(ctx.get('validator').validate(data, xcertSchema).valid);
});

export default spec;
