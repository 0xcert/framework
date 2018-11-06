import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('converts a model into serialized object with only keys that pass the test', (ctx) => {
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
      title: 'bar'
    },
    books: [
      undefined,
      {
        title: 'bar',
      },
    ],
  });
  const result = user.filter(({ path, prop }) => prop.getValue() !== 'foo');
  ctx.deepEqual(result as any, {
    book: {
      title: 'bar',
    },
    books: [
      null,
      {
        title: 'bar',
      },
    ],
  });
});

export default spec;
