import * as level from 'level';

export class StorageMiddleware {
 protected db: any;

 public constructor() {
   this.db = new level('0x-db');
 }

 public getter(options = {}) {
   return async (req, res, next) => {
     const { id } = req.params;
     const ipfsHash = this.db.get(id);
     const ipfsJson = await IPFS.get(ipfsHash);
     res.json(ipfsJson);
   };
 }

 public setter(options = {}) {
   return async (req, res, next) => {
     const { id } = req.params;
     const json = req.body; // uporabi "body-parser" middleware
     const ipfsHash = await IPFS.set(json);
     await this.db.set(id, ipfsHash);
     res.json({ success: true });
   };
 }
}
