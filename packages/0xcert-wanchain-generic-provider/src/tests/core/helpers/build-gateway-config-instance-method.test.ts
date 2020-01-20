import { Spec } from '@hayspec/spec';
import { buildGatewayConfig, GenericProvider, NetworkKind } from '../../../';

const spec = new Spec();

spec.test('sets correct config', async (ctx) => {
  const provider = new GenericProvider({
    requiredConfirmations: 1,
    gatewayConfig: buildGatewayConfig(NetworkKind.TESTNET),
  });
  ctx.is(provider.gatewayConfig.actionsOrderId, '0x52ff43a24d7046ce8ea3dcfbdb758e564853b794');
});

export default spec;
