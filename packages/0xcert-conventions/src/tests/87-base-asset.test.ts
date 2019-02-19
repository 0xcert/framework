import { Spec } from '@hayspec/spec';
import * as Ajv from 'ajv';
import { Object87, schema87 } from '../assets/87-asset-evidence';

const ajv = new Ajv({ allErrors: true });
const spec = new Spec();

spec.test('Validates data', (ctx) => {
  const validate = ajv.compile(schema87);
  const data: Object87 = {
    '$schema': 'http://json-schema.org/draft-07/schema',
    'data': [
      {
        'path': [],
        'nodes': [
          {
            'index': 1,
            'hash': 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          },
          {
            'index': 3,
            'hash': 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          },
          {
            'index': 8,
            'hash': 'fe57a125a8377ddd78ac9e8000b3cc7bf695601d1c194192e12cac46e3005c97',
          },
        ],
        'values': [
          {
            'index': 2,
            'value': 'A weapon for the Troopers game which can severely injure the enemy.',
          },
          {
            'index': 3,
            'value': 'https://troopersgame.com/dog.jpg',
          },
        ],
      },
    ],
  };
  ctx.true(validate(data));

  const data2 = {
    '$schema': 'http://json-schema.org/draft-07/schema',
    'data': [
      {
        'path': [],
        'nodes': [
          {
            'index': 1,
            'hash': 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          },
          {
            'index': 3,
            'hash': 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          },
          {
            'index': 8,
            'hash': 'fe57a125a8377ddd78ac9e8000b3cc7bf695601d1c194192e12cac46e3005c97',
          },
        ],
        'values': [
          {
            'index': 2,
            'value': 'A weapon for the Troopers game which can severely injure the enemy.',
          },
          {
            'index': 3,
            'value': 123423432,
          },
        ],
      },
    ],
  };
  ctx.false(validate(data2));
});

export default spec;
