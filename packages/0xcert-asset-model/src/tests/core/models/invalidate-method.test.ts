import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('clears property errors', async (ctx) => {
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
    @prop({
      cast: { handler: Book, array: true },
    })
    books: Book[];
  }
  const user = new User({
    book: {},
    books: [null, {}]
  });
  user.applyErrors([
    { path: ['name'], errors: [100] },
    { path: ['book', 'title'], errors: [200] },
    { path: ['books', 1, 'title'], errors: [300] },
  ]);
  user.invalidate();
  ctx.deepEqual(user.getProp('name').getErrorCodes(), []);
  ctx.deepEqual(user.getProp('book', 'title').getErrorCodes(), []);
  ctx.deepEqual(user.getProp('books', 1, 'title').getErrorCodes(), []);
});

export default spec;
