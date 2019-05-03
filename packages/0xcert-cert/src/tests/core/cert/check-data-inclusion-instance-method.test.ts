import { Spec } from '@hayspec/spec';
import { Cert } from '../../../core/cert';
import { PropRecipe } from '../../../core/prop';
import { exampleData, exampleSchema, pictureSchema } from '../helpers/schema';

const spec = new Spec();

class CertTest extends Cert {
  public checkDataInclusionTest(data: any, recipes: PropRecipe[]): boolean {
    return this.checkDataInclusion(data, recipes);
  }
}

spec.test('checks data inclusion with example schema', async (ctx) => {
  const cert = new CertTest({
    schema: exampleSchema,
  });
  const recipes = await cert.notarize(exampleData);
  ctx.is(await cert.checkDataInclusionTest(exampleData, recipes), true);
});

spec.test('checks data inclusion with picture schema', async (ctx) => {
  const cert = new CertTest({ schema: pictureSchema });
  const data = {
    '$evidence': 'https://troopersgame.com/dog/evidence.json',
    '$schema': 'https://conventions.0xcert.org/86-base-asset-schema.json',
    'description': 'A weapon for the Troopers game which can severely injure the enemy.',
    'name': 'Magic Sword',
    'pictures': [{
      'src': 'https://image.src/image.jpg',
    }],
  };

  const recipes = await cert.notarize(data);
  ctx.is(await cert.checkDataInclusionTest(data, recipes), true);
});

spec.test('checks data without array inclusion with picture schema', async (ctx) => {
  const cert = new CertTest({ schema: pictureSchema });
  const data = {
    '$evidence': 'https://troopersgame.com/dog/evidence.json',
    '$schema': 'https://conventions.0xcert.org/86-base-asset-schema.json',
    'description': 'A weapon for the Troopers game which can severely injure the enemy.',
    'name': 'Magic Sword',
  };

  const recipes = await cert.notarize(data);
  ctx.is(await cert.checkDataInclusionTest(data, recipes), true);
});

export default spec;
