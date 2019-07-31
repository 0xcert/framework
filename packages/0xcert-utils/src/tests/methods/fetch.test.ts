import { Spec } from '@hayspec/spec';
import * as path from 'path';
import { fetch } from '../../methods/fetch';

const spec = new Spec();

spec.test('downloads a remote file', async (ctx) => {
  const res = await fetch('https://docs.0xcert.org/xcert-mock.json').then((r) => r.json());
  ctx.true(!!res.XcertMock);
});

spec.test('reads a local file', async (ctx) => {
  const res = await fetch(path.join(__dirname, '..', 'mocks', 'xcert-mock.json')).then((r) => JSON.parse(r));
  ctx.true(!!res.XcertMock);
});

export default spec;
