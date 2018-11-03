import { Spec } from '@specron/spec';
import * as folder from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!folder.Folder);
  ctx.true(!!folder.FolderTransferState);
  ctx.true(!!folder.FolderAbility);
  ctx.true(!!folder.FolderCapability);  
});

export default spec;
