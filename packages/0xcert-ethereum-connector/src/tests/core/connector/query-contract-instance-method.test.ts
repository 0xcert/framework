import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { Connector } from '../../..';

interface Data {
  protocol: Protocol;
  connector: Connector;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const connector = new Connector({
    provider: stage.web3,
  });

  stage.set('connector', connector);
});

spec.test('returns block data', async (ctx) => {
  const protocol = ctx.get('protocol');
  const connector = ctx.get('connector');

  const res = await connector.queryContract({
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
