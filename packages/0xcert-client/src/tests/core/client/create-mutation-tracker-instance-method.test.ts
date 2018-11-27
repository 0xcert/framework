import { Spec } from '@specron/spec';
import { MutationTracker } from '@0xcert/mutation-tracker';
import { Client } from '../../..';

interface Data {
  client: Client;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  stage.set('client', new Client({
    provider: null,
  }));
});

spec.test('creates a new mutation tracker instance', async (ctx) => {
  const client = ctx.get('client');
  const tracker = await client.createMutationTracker();
  ctx.true(tracker instanceof MutationTracker);
});

export default spec;
