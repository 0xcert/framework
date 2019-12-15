import { Spec } from '@hayspec/spec';
import { Validator } from 'jsonschema';
import { Schema87, schema87 } from '../assets/87-asset-evidence';

const spec = new Spec<{
  validator: Validator;
}>();

spec.before((stage) => {
  stage.set('validator', new Validator());
});

spec.test('passes for valid data', (ctx) => {
  const schema: Schema87 = {
    '$schema': 'http://json-schema.org/draft-07/schema',
    'data': [
      {
        'path': [],
        'nodes': [
          {
            'index': 1,
            'hash': '9b61df344ebc1740d60333efc401150f756c3e3bc13f9ca31ddd96b8fc7180fe',
          },
        ],
        'values': [
          {
            'index': 3,
            'value': 'https://troopersgame.com/dog.jpg',
            'nonce': '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
          },
        ],
      },
    ],
  };
  ctx.true(ctx.get('validator').validate(schema, schema87).valid);
});

spec.test('fails for valid data', (ctx) => {
  const schema = {
    '$schema': 'http://json-schema.org/draft-07/schema',
    'data': [
      {
        'nodes': [
          {
            'index': '9b61df344ebc1740d60333efc401150f756c3e3bc13f9ca31ddd96b8fc7180fe',
          },
        ],
        'values': [
          {
            'index': 'foo',
            'value': 'https://troopersgame.com/dog.jpg',
            'nonce': '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
          },
        ],
      },
    ],
  };
  ctx.false(ctx.get('validator').validate(schema, schema87).valid);
});

export default spec;
