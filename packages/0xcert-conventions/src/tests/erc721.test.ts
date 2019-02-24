import { sha } from '@0xcert/utils';
import { Spec } from '@hayspec/spec';
import * as Ajv from 'ajv';
import { ObjectErc721, schemaErc721 } from '../assets/erc721';

const spec = new Spec<{
  validate: any;
}>();

spec.before((stage) => {
  stage.set('validate', new Ajv({ allErrors: true }).compile(schemaErc721));
});

spec.test('passes for valid data', (ctx) => {
  const data: ObjectErc721 = {
    'description': 'A weapon for the Troopers game which can severely injure the enemy.',
    'image': 'https://troopersgame.com/dog.jpg',
    'name': 'Troopers game',
  };
  ctx.true(ctx.get('validate')(data));
});

spec.test('fails for valid data', (ctx) => {
  const data = {
    'description': 'A weapon for the Troopers game which can severely injure the enemy.',
    'image': 'https://troopersgame.com/dog.jpg',
    'name': 12,
  };
  ctx.false(ctx.get('validate')(data));
});

spec.test('matches unique schema ID', async (ctx) => {
  ctx.is(await sha(256, JSON.stringify(schemaErc721)), 'f003cad0867f9711540527c0c909fd9e053b8d41c3cd01ed3666b774ef188c8f');
});

export default spec;
