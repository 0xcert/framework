import { Storage } from '@0xcert/storage-ipfs';
import * as bodyParser from 'body-parser';
import * as level from 'level';

/**
 * IPFS storage express middleware config
 */
export interface StorageMiddlewareConfig {

  /**
   * Database path
   */
  levelDbPath?: string;

  /**
   * IPFS gateway URI
   */
  ipfsGatewayUri?: string;

  /**
   * IPFS gateway port
   */
  ipfsGatewayPort?: number;

  /**
   * IPFS gateway protocol (http or https)
   */
  ipfsGatewayProtocol?: string;

  /**
   * IPFS API URI
   */
  ipfsApiUri?: string;

  /**
   * IPFS API port
   */
  ipfsApiPort?: number;

  /**
   * IPFS API protocol (http or https)
   */
  ipfsApiProtocol?: string;
}

/**
 * IPFS storage express middleware class
 */
export class StorageMiddleware {

  /**
   * LevelDB database instance
   */
  protected db: any;

  /**
   * IPFS storage instance
   */
  protected ipfs: Storage;

  /**
   * Class constructor.
   */
  public constructor(config: StorageMiddlewareConfig) {
    this.db = new level(config.levelDbPath || '0xcertdb');
    this.ipfs = new Storage({ ...config });
  }

  /**
   * Middleware getter function.
   */
  public getter() {
    return async (req, res) => {
      const { id } = req.params;
      const ipfsHash = await this.db.get(id);
      const ipfsJson = await this.ipfs.get(ipfsHash);
      res.json(await ipfsJson.json());
    };
  }

  /**
   * Middleware setter function.
   */
  public setter() {
    const jsonParser = bodyParser.json();

    const respond = async (req, res) => {
      const { id } = req.params;
      const json = req.body;
      const jsonString = JSON.stringify(json);
      const ipfsHash = await this.ipfs.add(Buffer.alloc(jsonString.length, jsonString));
      await this.db.put(id, ipfsHash[0].hash);
      res.json({ success: true });
    };

    return async (req, res) => {
      if (!req.body) {
        jsonParser(req, res, async (err) => respond(req, res));
      } else {
        respond(req, res);
      }
    };
  }

}
