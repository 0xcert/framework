import { Spec } from '@specron/spec';

interface Data {
  bytesToTypes?: any;
}

const spec = new Spec<Data>();

spec.beforeEach(async (ctx) => {
  const bytesToTypes = await ctx.deploy({
    src: './build/unpack-test-mock.json',
    contract: 'UnpackTestMock',
  });
  ctx.set('bytesToTypes', bytesToTypes);
});

spec.test('correctly unpacks bytes to types', async (ctx) => {
  const bytesToTypes = ctx.get('bytesToTypes');
  // uint256 - 1
  // uint16 - 2
  // uint8 - 3
  // bytes32 - 0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
  // bool - true
  // address - 0xF9196F9f176fd2eF9243E8960817d5FbE63D79aa
  const result = await bytesToTypes.instance.methods.unpack('0x00000000000000000000000000000000000000000000000000000000000000010002039f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a0801f9196f9f176fd2ef9243e8960817d5fbe63d79aa').call();
  ctx.is(result.p6, '1');
  ctx.is(result.p5, '2');
  ctx.is(result.p4, '3');
  ctx.is(result.p3, '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');
  ctx.true(result.p2);
  ctx.is(result.p1, '0xF9196F9f176fd2eF9243E8960817d5FbE63D79aa');
});

export default spec;
