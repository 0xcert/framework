import { Spec } from '@hayspec/spec';
import { buildGatewayConfig, GenericProvider, NetworkKind } from '../..';

const spec = new Spec();

spec.test('sets correct config', async (ctx) => {
  const provider = new GenericProvider({
    requiredConfirmations: 1,
    gatewayConfig: buildGatewayConfig(NetworkKind.TESTNET),
  });
  ctx.is(provider.gatewayConfig.actionsOrderId, '0x0000000000000000000000000000000000000000');
});

export default spec;
