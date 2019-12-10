import { Spec } from '@hayspec/spec';
import { Validator } from 'jsonschema';
import { SchemaErc721, schemaErc721 } from '../assets/erc721';

const spec = new Spec<{
  validator: Validator;
}>();

spec.before((stage) => {
  stage.set('validator', new Validator());
});

spec.test('passes for valid data', (ctx) => {
  const data: SchemaErc721 = {
    'description': 'A weapon for the Troopers game which can severely injure the enemy.',
    'image': 'https://troopersgame.com/dog.jpg',
    'name': 'Troopers game',
  };
  ctx.true(ctx.get('validator').validate(data, schemaErc721).valid);
});

spec.test('fails for valid data', (ctx) => {
  const data = {
    'description': 'A weapon for the Troopers game which can severely injure the enemy.',
    'image': 'https://troopersgame.com/dog.jpg',
    'name': 12,
  };
  ctx.false(ctx.get('validator').validate(data, schemaErc721).valid);
});

export default spec;
