import { Spec } from '@hayspec/spec';
import { sha512 } from '../..';

const spec = new Spec();

spec.test('converts string into SHA512 hash', async (ctx) => {
  ctx.is(await sha512('foo#'), 'c0c9c32f7cfb95d0d46b78d77bb8aa9eb470e44a6143b39ba3310f2ab34498c982ed40c4e87e07f1f6fdc76ffe5079dbbb09672316d916a72ec4f73c48d75098');
  ctx.is(await sha512('bar!'), '56c79f1c6e391260bce4418f48fa72b15d2402f78dcfeab5ad5a0fa9e7826d042f534baa2f61557163dbf2b3a40d4f66936cb84e3fd7304e69fbc8759d60b9f9');
});

export default spec;
