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
  ctx.is(provider.gatewayConfig.actionsOrderId, '0x265A62A3EfB677ca6A0F7C85dC5002EC71F2cde6');
});

export default spec;
