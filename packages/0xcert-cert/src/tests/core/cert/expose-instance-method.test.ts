import { Spec } from '@hayspec/spec';
import { Cert } from '../../../core/cert';
import { defaultData } from '../helpers/schemas';

const spec = new Spec();

spec.test('returns truncated data object with name', async (ctx) => {
  const cert = new Cert({
    schema: {},
  });
  const metadata = cert.expose(defaultData, [
    ['name'],
  ]);
  ctx.deepEqual(metadata, {
    name: 'B',
  });
});

spec.test('returns truncated data object with event.organizer.name and email', async (ctx) => {
  const cert = new Cert({
    schema: {},
  });
  const metadata = cert.expose(defaultData, [
    ['event', 'organizer', 'name'],
    ['email'],
  ]);
  ctx.deepEqual(metadata, {
    event: {
      organizer: {
        name: 'B',
      },
    },
    email: 'A',
  });
});

spec.test('returns truncated data object with tags.1', async (ctx) => {
  const cert = new Cert({
    schema: {},
  });
  const metadata = cert.expose(defaultData, [
    ['tags', 1],
  ]);
  ctx.deepEqual(metadata, {
    tags: [null, 2],
  });
});

export default spec;
