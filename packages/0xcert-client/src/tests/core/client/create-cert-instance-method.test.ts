import { Spec } from '@specron/spec';
import { Cert } from '@0xcert/cert';
import { Client } from '../../..';

interface Data {
  client: Client;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  stage.set('client', new Client({
    connector: null,
  }));
});

spec.test('creates a new certificate instance', async (ctx) => {
  const client = ctx.get('client');
  const cert = await client.createCert({});
  ctx.true(cert instanceof Cert);
});

export default spec;
