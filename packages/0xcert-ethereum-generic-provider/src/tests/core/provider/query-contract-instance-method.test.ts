import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { GenericProvider } from '../../..';

interface Data {
  protocol: Protocol;
  provider: GenericProvider;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const provider = new GenericProvider({
    client: stage.web3,
  });

  stage.set('provider', provider);
});

spec.test('returns block data', async (ctx) => {
  const protocol = ctx.get('protocol');
  const provider = ctx.get('provider');

  const res = await provider.queryContract({
    to: protocol.xcert.instance.options.address,
    abi: {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        { "name": "_name", "type": "string" },
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
    },
    tag: 'latest', 
  });

  ctx.is(res[0], 'Xcert');
});

export default spec;
