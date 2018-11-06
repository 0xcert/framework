import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('returns `true` if the prop exists', (ctx) => {
  class User extends Model {
    @prop()
    name: string;
  }
  const user = new User();
  ctx.is(user.isProp(['name']), true);
  ctx.is(user.isProp(['book', 'title']), false);
});

export default spec;
