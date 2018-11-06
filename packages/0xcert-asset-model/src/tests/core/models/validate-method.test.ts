import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('validates properties and throws an error', async (ctx) => {
  const validate = [
    { handler: (v) => !!v, code: 100 },
    { handler: (v) => !!v, code: 200 },
  ];
  class Book extends Model {
    @prop({
      validate,
    })
    title: string;
  }
  class User extends Model {
    @prop({
      validate,
    })
    name: string;
    @prop({
      validate,
      cast: { handler: Book },
    })
    book0: Book;
    @prop({
      validate,
      cast: { handler: Book, array: true },
    })
    books0: Book[];
    @prop({
      validate,
      cast: { handler: Book },
    })
    book1: Book;
    @prop({
      validate,
      cast: { handler: Book, array: true },
    })
    books1: Book[];
  }
  const user = new User({
    book1: {},
    books1: [{}]
  });
  const errors = [100, 200];
  await user.validate({quiet: true});
  ctx.is(await user.validate().catch(() => false), false);
  ctx.deepEqual(user.collectErrors(), [
    { path: ['name'], errors },
    { path: ['book0'], errors },
    { path: ['books0'], errors },
    { path: ['book1', 'title'], errors },
    { path: ['books1', 0, 'title'], errors },
  ]);
});

export default spec;
