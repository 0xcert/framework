import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { EthereumConnector } from '../../..';

interface Data {
  protocol: Protocol;
  connector: EthereumConnector;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const connector = new EthereumConnector(stage.web3.currentProvider);

  stage.set('connector', connector);
});

spec.test('returns block data', async (ctx) => {
  const protocol = ctx.get('protocol');
  const connector = ctx.get('connector');
  const coinbase = await ctx.web3.eth.getCoinbase();

  const res = await connector.mutateContract({
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
