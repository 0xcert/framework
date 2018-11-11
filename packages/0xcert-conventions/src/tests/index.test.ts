import { Spec } from '@hayspec/spec';
import * as conventions from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!conventions.assetMetadata86);
  ctx.true(!!conventions.assetEvidence87);
  ctx.true(!!conventions.cryptoCollectible88);
});

export default spec;
