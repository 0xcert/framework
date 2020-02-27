import { Spec } from '@hayspec/spec';
import { buildGatewayConfig, GenericProvider, NetworkKind } from '../../../';

const spec = new Spec();

spec.test('sets correct config', async (ctx) => {
  const provider = new GenericProvider({
    requiredConfirmations: 1,
    gatewayConfig: buildGatewayConfig(NetworkKind.TESTNET),
  });
  ctx.is(provider.gatewayConfig.actionsOrderId, '0x7b65b89dd2b43229e8bd087fa1601805d571b57d');
});

export default spec;
