import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('returns an array of props', (ctx) => {
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
    name: 'foo',
    book: {
      title: 'bar',
    },
    books: [
      undefined,
      {
        title: 'baz',
      },
    ],
  });
  ctx.deepEqual(user.flatten().map((f) => f.path), [
    ['name'],
    ['book'],
    ['book', 'title'],
    ['books'],
    ['books', 1, 'title']
  ]);
  ctx.deepEqual(Object.keys(user.flatten()[0]), ['path', 'prop']);
  ctx.deepEqual(user.flatten()[0].path, ['name']);
  ctx.is(user.flatten()[0].prop.getValue(), 'foo');
});

export default spec;
