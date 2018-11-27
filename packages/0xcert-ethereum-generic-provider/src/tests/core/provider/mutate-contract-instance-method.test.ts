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
  const coinbase = await ctx.web3.eth.getCoinbase();

  const res = await provider.mutateContract({
    from: coinbase,
    to: protocol.xcert.instance.options.address,
    abi: {
      "constant": false,
      "inputs": [
        { "name": "_to", "type": "address" },
        { "name": "_id", "type": "uint256" },
        { "name": "_proof", "type": "bytes32" },
      ],
      "name": "mint",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
    },
    data: [
      coinbase,
      100,
      '0x',
    ],
  });

  ctx.true(res.length === 66);
});

export default spec;
