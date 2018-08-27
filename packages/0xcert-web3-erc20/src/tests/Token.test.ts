import { Spec } from '@specron/spec';

const spec = new Spec();

spec.test('has correct totalSupply after construction', async (ctx) => {

});

spec.test('has correct token name after construction', async (ctx) => {

});

spec.test('has correct token symbol after construction', async (ctx) => {

});

spec.test('has correct token decimals after construction', async (ctx) => {

});

spec.test('has correct owner token balance after construction', async (ctx) => {

});

spec.test('recipient and sender have correct balances after transfer', async (ctx) => {

});

spec.test('emits Transfer event on transfer', async (ctx) => {

});

spec.test('throws when trying to transfer more than available balance', async (ctx) => {

});

spec.test('returns the correct allowance amount after approval', async (ctx) => {

});

spec.test('emits Approval event after approval', async (ctx) => {

});

spec.test('reverts if owner wants to reset allowance before setting it to 0 first', async (ctx) => {

});

spec.test('successfully resets allowance', async (ctx) => {

});

spec.test('returns correct balances after transfering from another account', async (ctx) => {

});

spec.test('emits Transfer event on transferFrom', async (ctx) => {

});

spec.test('throws when trying to transferFrom more than allowed amount', async (ctx) => {

});

spec.test('throws an error when trying to transferFrom more than _from has', async (ctx) => {

});

export default spec;