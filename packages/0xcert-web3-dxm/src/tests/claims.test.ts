import { Spec } from '@specron/spec';

const signedClaim = new Spec();

signedClaim.test('with valid signature data', async (ctx) => {
  
});

signedClaim.test('with invalid signature data', async (ctx) => {
  
});

signedClaim.test('from a third party account', async (ctx) => {
  
});

const rawClaim = new Spec();

rawClaim.test('from valid data', async (ctx) => {
  
});

rawClaim.test('from invalid data', async (ctx) => {
  
});

const spec = new Spec();

spec.spec('generate claim', rawClaim);
spec.spec('validate signed claim', signedClaim);

export default spec;