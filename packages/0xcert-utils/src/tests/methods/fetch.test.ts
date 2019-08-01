import { Spec } from '@hayspec/spec';
import * as path from 'path';
import { fetchJson } from '../../methods/fetch';

const spec = new Spec();

spec.test('downloads a remote file', async (ctx) => {
  const res = await fetchJson('https://docs.0xcert.org/xcert-mock.json');
  ctx.true(!!res.XcertMock);
});

spec.test('reads a local file', async (ctx) => {
  const res = await fetchJson(path.join(__dirname, '..', 'mocks', 'xcert-mock.json'));
  ctx.true(!!res.XcertMock);
});

export default spec;
