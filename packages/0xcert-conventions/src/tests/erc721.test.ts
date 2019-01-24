import { Spec } from '@hayspec/spec';
import * as Ajv from 'ajv';
import { ObjectErc721, schemaErc721 } from '../assets/erc721';

const ajv = new Ajv({allErrors: true});
const spec = new Spec();

spec.test('Validates data', (ctx) => {
  const validate = ajv.compile(schemaErc721);
  const data: ObjectErc721 = {
    'description': 'A weapon for the Troopers game which can severely injure the enemy.',
    'image': 'https://troopersgame.com/dog.jpg',
    'name': 'Troopers game',
  };
  ctx.true(validate(data));
  const data2 = {
    'description': 'A weapon for the Troopers game which can severely injure the enemy.',
    'image': 'https://troopersgame.com/dog.jpg',
    'name': 12,
  };
  ctx.false(validate(data2));
});

export default spec;
