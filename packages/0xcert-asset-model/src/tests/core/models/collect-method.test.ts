import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('returns an array of results', (ctx) => {
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
  const results = user.collect(({ path }) => path);
  ctx.deepEqual(results, [
    ['name'],
    ['book'],
    ['book', 'title']
  ]);
});

export default spec;
