import { Spec } from '@specron/spec';
import { GenericProvider } from '../../..';
import { buildGatewayConfig } from '../../../core/helpers';
import { NetworkKind } from '../../../core/types';

const spec = new Spec();

spec.test('sets correct config', async (ctx) => {
  const provider = new GenericProvider({
    client: ctx.web3,
    requiredConfirmations: 1,
    gatewayConfig: buildGatewayConfig(NetworkKind.ROPSTEN),
  });
  ctx.is(provider.gatewayConfig.multiOrderId, '0x0000000000000000000000000000000000000000');
});

export default spec;
