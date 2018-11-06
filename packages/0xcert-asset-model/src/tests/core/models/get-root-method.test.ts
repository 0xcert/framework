import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('return the first model in a tree of nested models', (ctx) => {
  class Book extends Model {
    @prop()
    title: string;
  }
  class User extends Model {
    @prop({
      cast: { handler: Book },
    })
    book: Book;
  }
  const user = new User({
    book: {
      title: 200,
    },
  });
  ctx.is(user.getRoot(), user);
  ctx.is(user.book.getRoot(), user);
});

export default spec;
