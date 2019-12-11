import { Spec } from '@hayspec/spec';
import { Validator } from 'jsonschema';
import { Schema86, schema86 } from '../assets/86-base-asset';

const spec = new Spec<{
  validator: Validator;
}>();

spec.before((stage) => {
  stage.set('validator', new Validator());
});

spec.test('passes for valid data', (ctx) => {
  const data: Schema86 = {
    '$evidence': 'https://troopersgame.com/dog/evidence',
    '$schema': 'http://json-schema.org/draft-07/schema',
    'description': 'A weapon for the Troopers game which can severely injure the enemy.',
    'image': 'https://troopersgame.com/dog.jpg',
    'name': 'Troopers game',
  };
  ctx.true(ctx.get('validator').validate(data, schema86).valid);
});

spec.test('fails for valid data', (ctx) => {
  const data = {
    '$evidence': 'https://troopersgame.com/dog/evidence',
    '$schema': 'http://json-schema.org/draft-07/schema',
    'description': 'A weapon for the Troopers game which can severely injure the enemy.',
    'image': 'https://troopersgame.com/dog.jpg',
    'name': 12,
  };
  ctx.false(ctx.get('validator').validate(data, schema86).valid);
});

export default spec;
