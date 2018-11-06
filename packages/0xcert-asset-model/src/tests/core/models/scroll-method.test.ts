import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('runs the provided handler on each prop', (ctx) => {
  class Book extends Model {
    @prop()
    title: string;
  }
  class User extends Model {
    @prop()
    name: string;
    @prop({
      cast: { handler: Book },
    })
    book: Book;
  }
  const user = new User({
    name: 'foo',
    book: {
      title: 'bar',
    },
  });
  const count = user.scroll(({ path }) => null);
  ctx.deepEqual(count, 3);
});

export default spec;
