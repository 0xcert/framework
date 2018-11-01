import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/web3-sandbox';
import { Folder } from '@0xcert/web3-folder';
import { Connector } from '../../core/connector';

interface Data {
  accounts: string[];
  protocol: Protocol;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  stage.set('accounts', await stage.web3.eth.getAccounts());
});

spec.test('method `getFolder` returns a new Folder instance', async (ctx) => {
  const connector = new Connector(ctx);
  const folder = await connector.getFolder(ctx.get('protocol').xcert.instance.options.address);
  ctx.true(folder instanceof Folder);
});

export default spec;
