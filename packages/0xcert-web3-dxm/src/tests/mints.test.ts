import { Spec } from '@specron/spec';

/**
 * Perform mint.
 */

const perform = new Spec();

perform.test('10 ZXC => Cat #1', async (ctx) => {
  
});

perform.test('10 ZXC, 50 BNB => Cat #1', async (ctx) => {
  
});

perform.test('Dog #1, Dog #2, Dog #3 => Cat #1', async (ctx) => {
  
});

perform.test('Dog #1, Dog #2, Dog #3, 10 ZXC => Cat #1', async (ctx) => {
  
});

perform.test('Dog #1, Fox #7, 10 ZXC => Cat #1', async (ctx) => {
  
});

perform.test('fails if msg.sender is not the receiver', async (ctx) => {
  
});

perform.test('fails when trying to perform already performed mint', async (ctx) => {
  
});

perform.test('fails when approved token amount is not sufficient', async (ctx) => {
  
});

perform.test('fails when trying to perform canceled mint', async (ctx) => {
  
});

perform.test('fails when proxy does not have the mint rights', async (ctx) => {
  
});

perform.test('fails when to and the owner addresses are the same', async (ctx) => {
  
});

perform.test('fails if current time is after expirationTimestamp', async (ctx) => {
  
});


/**
 * Cancel mint.
 */

const cancel = new Spec();

cancel.test('succeeds', async (ctx) => {
  
});

cancel.test('fails when a third party tries to cancel it', async (ctx) => {
  
});

cancel.test('fails when trying to cancel an already performed mint', async (ctx) => {
  
});

cancel.test('fails when trying to cancel an already canceled mint', async (ctx) => {
  
});

/**
 * Test definition.
 * 
 * ERC20: BNB, OMG, BAT, GNT, ZXC
 * ERC721: Cat, Dog, Fox, Bee, Ant, Ape, Pig
 */

const spec = new Spec();

spec.spec('perform an atomic mint', perform);

spec.spec('cancel an atomic mint', cancel);

export default spec;