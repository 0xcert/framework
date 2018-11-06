import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('sets properties to their fake values', (ctx) => {
  class Book extends Model {
    @prop({
      fakeValue: 'foo',
    })
    title: string;
  }
  class User extends Model {
    @prop({
      fakeValue: 'bar',
    })
    name: string;
    @prop({
      cast: { handler: Book },
      fakeValue: 'bar',
    })
    book: Book;
    @prop({
      cast: { handler: Book, array: true },
      fakeValue: [null, {}],
    })
    books: Book[];
  }
  const user = new User();
  user.fake();
  ctx.deepEqual(user.serialize(), {
    name: 'bar',
    book: {
      title: 'foo',
    },
    books: [
      null,
      {
        title: 'foo',
      },
    ],
  });
});

export default spec;
