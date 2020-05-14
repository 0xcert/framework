import { NetworkKind } from '@0xcert/ethereum-generic-provider';
import { HttpProvider } from '@0xcert/ethereum-http-provider';
import { Spec } from '@hayspec/spec';
import { Ens } from '../../../core/ens';

const spec = new Spec<{
}>();

spec.test('returns ens domain', async (ctx) => {
  const provider = new HttpProvider({
    url: 'https://ropsten.infura.io/v3/06312ac7a50b4bd49762abc5cf79dab8',
  });
  const ens =  new Ens(provider, NetworkKind.ROPSTEN);
  const domain = await ens.getDomain('0xF9196F9f176fd2eF9243E8960817d5FbE63D79aa');
  ctx.is('0xcert.eth', domain);
});

export default spec;
