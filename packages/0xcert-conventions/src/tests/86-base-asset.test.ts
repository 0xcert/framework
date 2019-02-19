import { Spec } from '@hayspec/spec';
import * as Ajv from 'ajv';
import { Object86, schema86 } from '../assets/86-base-asset';

const spec = new Spec();
const ajv = new Ajv({ allErrors: true });

spec.test('Validates data', (ctx) => {
  const validate = ajv.compile(schema86);
  const data: Object86 = {
    '$evidence': 'https://troopersgame.com/dog/evidence',
    '$schema': 'http://json-schema.org/draft-07/schema',
    'description': 'A weapon for the Troopers game which can severely injure the enemy.',
    'image': 'https://troopersgame.com/dog.jpg',
    'name': 'Troopers game',
  };
  ctx.true(validate(data));
  const data2 = {
    '$evidence': 'https://troopersgame.com/dog/evidence',
    '$schema': 'http://json-schema.org/draft-07/schema',
    'description': 'A weapon for the Troopers game which can severely injure the enemy.',
    'image': 'https://troopersgame.com/dog.jpg',
    'name': 12,
  };
  ctx.false(validate(data2));
});

export default spec;
