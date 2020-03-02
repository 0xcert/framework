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
  ctx.is(provider.gatewayConfig.actionsOrderId, '0xbb719e35c67198e4453923eeccF0c678C6129982');
});

export default spec;
