import { Spec } from '@hayspec/spec';
import * as Ajv from 'ajv';
import { Object88, schema88 } from '../assets/88-crypto-collectible';

const ajv = new Ajv({ allErrors: true });
const spec = new Spec();

spec.test('Validates data', (ctx) => {
  const validate = ajv.compile(schema88);
  const data: Object88 = {
    '_evidence': 'https://troopersgame.com/dog/evidence',
    '_schema': 'http://json-schema.org/draft-07/schema',
    'description': 'A weapon for the Troopers game which can severely injure the enemy.',
    'image': 'https://troopersgame.com/dog.jpg',
    'name': 'Troopers game',
  };
  ctx.true(validate(data));
  const data2 = {
    '_evidence': 'https://troopersgame.com/dog/evidence',
    '_schema': 'http://json-schema.org/draft-07/schema',
    'description': 'A weapon for the Troopers game which can severely injure the enemy.',
    'image': 'https://troopersgame.com/dog.jpg',
    'name': 12,
  };
  ctx.false(validate(data2));
});

export default spec;
