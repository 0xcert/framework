import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('sets properties errors', (ctx) => {
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
    { path: ['book', 'title'], errors: [200, 300] },
    { path: ['books', 1, 'title'], errors: [400] },
  ]);
  ctx.deepEqual(user.getProp('name').getErrorCodes(), [100]);
  ctx.deepEqual(user.getProp('book', 'title').getErrorCodes(), [200, 300]);
  ctx.deepEqual(user.getProp('books', 1, 'title').getErrorCodes(), [400]);
});

export default spec;
