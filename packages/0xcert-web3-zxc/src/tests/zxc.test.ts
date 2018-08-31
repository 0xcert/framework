import { Spec } from '@specron/spec';

const spec = new Spec();

export default spec;

spec.test('emits Transfer event on transfer', async (ctx) => {
 
});

spec.test('throws when trying to transfer before transfer is enabled', async (ctx) => {
 
});

spec.test('throws when trying to transfer more than available balance', async (ctx) => {
 
});

spec.test('throws when trying to transfer to 0x0', async (ctx) => {
 
});

spec.test('throws when trying to transfer to contract address', async (ctx) => {
 
});

spec.test('throws when trying to transfer to crowdsale address', async (ctx) => {
 
});

spec.test('returns the correct allowance amount after approval', async (ctx) => {
 
});

spec.test('emits Approval event after approval', async (ctx) => {
 
});

spec.test('returns correct balances after transfering from another account', async (ctx) => {
 
});

spec.test('emits Transfer event on transferFrom', async (ctx) => {
 
});

spec.test('throws when trying to transferFrom more than allowed amount', async (ctx) => {
 
});

spec.test('throws an error when trying to transferFrom more than _from has', async (ctx) => {
 
});

spec.test('throws when trying to transferFrom before transfers enabled', async (ctx) => {
 
});

spec.test('throws when trying to transferFrom to 0x0', async (ctx) => {
 
});

spec.test('throws when trying to transferFrom to contract address', async (ctx) => {
 
});

spec.test('allows token burning by the owner', async (ctx) => {
 
});

spec.test('allows only owner to burn tokens', async (ctx) => {
 
});

spec.test('does not allow owner to burn more than available balance', async (ctx) => {
 
});

spec.test('should set crowdsale address', async (ctx) => {
 
});

spec.test('should re-set crowdsale address', async (ctx) => {
 
});

spec.test('should set crowdsale address only if called by owner', async (ctx) => {
 
});

spec.test('should allow transfers only for crowdsale address when transfers disabled', async (ctx) => {
 
});




