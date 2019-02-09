import { Spec } from '@hayspec/spec';
import { fetch } from '../../methods/fetch';

const spec = new Spec();

spec.test('downloads a remote file', async (ctx) => {
  const res = await fetch('https://docs.0xcert.org/xcert-mock.json').then((r) => r.json());
  ctx.true(!!res.XcertMock);
});

export default spec;
