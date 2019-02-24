import { sha } from '@0xcert/utils';
import { Spec } from '@hayspec/spec';
import * as Ajv from 'ajv';
import { Object86, schema86 } from '../assets/86-base-asset';

const spec = new Spec<{
  validate: any;
}>();

spec.before((stage) => {
  stage.set('validate', new Ajv({ allErrors: true }).compile(schema86));
});

spec.test('passes for valid data', (ctx) => {
  const data: Object86 = {
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
  ctx.is(await sha(256, JSON.stringify(schema86)), '3c065f842bf043fb2380b968b3c22e105daaa24042c25fedc73445fd34f30e71');
});

export default spec;
