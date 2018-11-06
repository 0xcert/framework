import { Spec } from '@hayspec/spec';
import { Model, Prop, prop } from '../../..';

const spec = new Spec();

spec.test('defines model property', (ctx) => {
  class User extends Model {
    @prop({})
    name: string;
  }
  const user = new User();
  const descriptor = Object.getOwnPropertyDescriptor(user, 'name');
  ctx.true(user.$props['name'] instanceof Prop);
  ctx.is(user.name, null);
  ctx.is(typeof descriptor.get, 'function');
  ctx.is(typeof descriptor.set, 'function');
  ctx.true(descriptor.enumerable);
  ctx.false(descriptor.configurable);
  user.name = 'John';
  ctx.is(user.name, 'John');
});

spec.test('supports deep type casting', (ctx) => {
  class Book extends Model {
    @prop({ cast: { handler: 'String' } })
    name: string;
  }
  class User extends Model {
    @prop({ cast: { handler: 'String' } })
    name: string;
    @prop({ cast: { handler: Book } })
    book: Book;
    @prop({ cast: { handler: Book, array: true } })
    books: Book[];
  }
  const book = new Book({
    name: 'Baz',
  });
  const user = new User({
    name: 100,
    book,
    books: [
      book,
      { name: 'Zed' },
    ],
  });
  ctx.is(user.name, '100');
  ctx.is(user.book.name, 'Baz');
  ctx.true(user.book instanceof Book);
  ctx.is(user.books[0].name, 'Baz');
  ctx.true(user.books[0] instanceof Book);
  ctx.is(user.books[1].name, 'Zed');
  ctx.true(user.books[1] instanceof Book);
  ctx.not(user.book, book); // recreates instance
  user.book = book; // preserves instance
  ctx.is(user.book, book);
});

spec.test('supports custom setter', (ctx) => {
  class User extends Model {
    @prop({
      set: (v) => `foo-${v}`,
    })
    name: string;
  }
  const user = new User();
  user.name = 'bar';
  ctx.is(user.name, 'foo-bar');
});

spec.test('supports custom getter', (ctx) => {
  class User extends Model {
    @prop({
      get: (v) => `foo-${v}`,
    })
    name: string;
  }
  const user = new User();
  user.name = 'bar';
  ctx.is(user.name, 'foo-bar');
});

spec.test('supports default value', (ctx) => {
  class User extends Model {
    @prop({
      defaultValue: 'foo',
    })
    name: string;
  }
  const user = new User();
  ctx.is(user.name, 'foo');
});

spec.test('supports property enumerable style', (ctx) => {
  class User0 extends Model {
    @prop({
      enumerable: true,
    })
    name: string;
  }
  class User1 extends Model {
    @prop({
      enumerable: false,
    })
    name: string;
  }
  const user0 = new User0({});
  const user1 = new User1({});
  ctx.deepEqual(Object.keys(user0), ['name']);
  ctx.deepEqual(Object.keys(user1), []);
});

export default spec;
