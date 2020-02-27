import { Spec } from '@hayspec/spec';
import { buildGatewayConfig, GenericProvider, NetworkKind } from '../../../';

const spec = new Spec();

spec.test('sets correct config', async (ctx) => {
  const provider = new GenericProvider({
    requiredConfirmations: 1,
    gatewayConfig: buildGatewayConfig(NetworkKind.TESTNET),
  });
  ctx.is(provider.gatewayConfig.actionsOrderId, '0x7b65B89Dd2b43229E8BD087fA1601805d571b57D');
});

export default spec;
