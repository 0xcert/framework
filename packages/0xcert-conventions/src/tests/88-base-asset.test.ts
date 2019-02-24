import { sha } from '@0xcert/utils';
import { Spec } from '@hayspec/spec';
import * as Ajv from 'ajv';
import { Object88, schema88 } from '../assets/88-crypto-collectible';

const spec = new Spec<{
  validate: any;
}>();

spec.before((stage) => {
  stage.set('validate', new Ajv({ allErrors: true }).compile(schema88));
});

spec.test('passes for valid data', (ctx) => {
  const data: Object88 = {
    '$evidence': 'https://troopersgame.com/dog/evidence',
    '$schema': 'http://json-schema.org/draft-07/schema',
    'description': 'A weapon for the Troopers game which can severely injure the enemy.',
    'image': 'https://troopersgame.com/dog.jpg',
    'name': 'Troopers game',
  };
  ctx.true(ctx.get('validate')(data));
});

spec.test('fails for valid data', (ctx) => {
  const data = {
    '$evidence': 'https://troopersgame.com/dog/evidence',
    '$schema': 'http://json-schema.org/draft-07/schema',
    'description': 'A weapon for the Troopers game which can severely injure the enemy.',
    'image': 'https://troopersgame.com/dog.jpg',
    'name': 12,
  };
  ctx.false(ctx.get('validate')(data));
});

spec.test('matches unique schema ID', async (ctx) => {
  ctx.is(await sha(256, JSON.stringify(schema88)), 'e38873339dc9cbc05cc5f8cc03da910ed57cdaf340b603407d2f8e68a0841905');
});

export default spec;
